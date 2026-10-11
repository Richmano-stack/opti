import { z } from "zod";

import type { ProviderConfig } from "./ai-provider-config";
import { OpenRouterServiceError, ResumeValidationError, type RateLimitDetails } from "./errors";
import { buildUserPrompt } from "./prompts";
import { optimizedResumeSchema, type OptimizeResumeInput, type OptimizedResume } from "./types";

const responseSchema = z.object({
  choices: z.array(z.object({ message: z.object({ content: z.string() }) })).min(1),
});

const providerErrorSchema = z.object({
  error: z.object({
    message: z.string().optional(),
    type: z.string().optional(),
    code: z.string().optional(),
  }),
});

function parseRetrySeconds(response: Response, message: string | undefined): number | undefined {
  const header = Number(response.headers.get("retry-after"));
  if (Number.isFinite(header) && header > 0) return Math.ceil(header);
  const match = message?.match(/try again in (?:(\d+)m)?([\d.]+)s/i);
  if (!match) return undefined;
  return Math.ceil(Number(match[1] ?? 0) * 60 + Number(match[2]));
}

function parseLimit(type: string | undefined, message: string | undefined): RateLimitDetails["limit"] {
  if (type === "tokens" || /\(TP[MD]\)/.test(message ?? "")) return "tokens";
  if (type === "requests" || /\(RP[MD]\)/.test(message ?? "")) return "requests";
  return undefined;
}

async function rateLimitDetails(
  response: Response,
): Promise<(RateLimitDetails & { providerCode?: string }) | undefined> {
  const body = providerErrorSchema.safeParse(await response.json().catch(() => null));
  const error = body.success ? body.data.error : undefined;
  if (response.status === 413 && error?.code !== "rate_limit_exceeded") return undefined;
  return {
    limit: parseLimit(error?.type, error?.message),
    retryAfterSeconds: parseRetrySeconds(response, error?.message),
    providerCode: error?.code,
  };
}

export async function requestResume(
  config: ProviderConfig,
  input: OptimizeResumeInput,
  timeoutMs: number,
): Promise<OptimizedResume> {
  const { model, endpoint, headers, systemPrompt, responseFormat, reasoningEffort } = config;
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers,
      signal: AbortSignal.timeout(timeoutMs),
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: buildUserPrompt(input) },
        ],
        temperature: 0.3,
        max_completion_tokens: 4_000,
        stream: false,
        response_format: responseFormat,
        ...(reasoningEffort ? { reasoning_effort: reasoningEffort } : {}),
      }),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new OpenRouterServiceError("OPENROUTER_TIMEOUT", "The generation provider timed out.", error);
    }
    throw new OpenRouterServiceError("OPENROUTER_UNAVAILABLE", "The generation provider is unavailable.", error);
  }

  if (!response.ok) {
    const cause = {
      status: response.status,
      statusText: response.statusText,
      requestId: response.headers.get("x-request-id") ?? undefined,
      model,
    };
    if (response.status === 402) {
      throw new OpenRouterServiceError("OPENROUTER_CREDITS_EXHAUSTED", "Generation provider credits are exhausted.", cause);
    }
    if (response.status === 401 || response.status === 403) {
      throw new OpenRouterServiceError("OPENROUTER_UNAUTHORIZED", "The generation provider rejected the credentials.", cause);
    }
    if (response.status === 429 || response.status === 413) {
      const details = await rateLimitDetails(response);
      if (details) {
        const { providerCode, ...rateLimit } = details;
        throw new OpenRouterServiceError(
          "OPENROUTER_RATE_LIMITED",
          "Generation provider rate limit reached.",
          { ...cause, ...rateLimit, providerCode },
          rateLimit,
        );
      }
    }
    throw new OpenRouterServiceError("OPENROUTER_UNAVAILABLE", `Generation request failed with HTTP ${response.status}.`, cause);
  }

  const envelope = responseSchema.safeParse(await response.json().catch(() => null));
  if (!envelope.success) throw new ResumeValidationError("The generation provider returned an invalid response.");
  let content: unknown;
  try {
    content = JSON.parse(envelope.data.choices[0]!.message.content);
  } catch {
    throw new ResumeValidationError("The generation provider returned malformed JSON.");
  }
  const result = optimizedResumeSchema.safeParse(content);
  if (!result.success) throw new ResumeValidationError("Generation output failed validation.", result.error);
  return result.data;
}
