import { z } from "zod";
import { OpenRouterServiceError, InvalidInputError, ResumeValidationError, type RateLimitDetails } from "./errors";
import { geminiResumeJsonSchema, openRouterResumeJsonSchema } from "./openrouter-schema";
import { buildSystemPrompt, buildUserPrompt } from "./prompts";
import { generationInputSchema, optimizedResumeSchema, type OptimizeResumeInput, type OptimizedResume } from "./types";

const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash";
export const GROQ_MODELS = ["openai/gpt-oss-120b"] as const;
export const AI_PROVIDERS = ["gemini", "groq", "openrouter"] as const;
export type AiProvider = (typeof AI_PROVIDERS)[number];

const providerKeys: Record<AiProvider, string> = {
  gemini: "GEMINI_API_KEY",
  groq: "GROQ_API_KEY",
  openrouter: "OPENROUTER_API_KEY",
};
const responseSchema = z.object({ choices: z.array(z.object({ message: z.object({ content: z.string() }) })).min(1) });
const providerErrorSchema = z.object({
  error: z.object({ message: z.string().optional(), type: z.string().optional(), code: z.string().optional() }),
});
const jsonSchemaFormat = (schema: unknown) => ({
  type: "json_schema",
  json_schema: { name: "tailored_resume", strict: true, schema },
});

type ProviderConfig = {
  model: string;
  endpoint: string;
  headers: Record<string, string>;
  systemPrompt: string;
  responseFormat: unknown;
};

function requireValue(value: string | undefined, message: string) {
  const trimmed = value?.trim();
  if (!trimmed) throw new OpenRouterServiceError("OPENROUTER_CONFIGURATION_ERROR", message);
  return trimmed;
}

function bearerHeaders(apiKey: string): Record<string, string> {
  return { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
}

export function configuredProviders(): AiProvider[] {
  return AI_PROVIDERS.filter((provider) => Boolean(process.env[providerKeys[provider]]?.trim()));
}

function activeProvider(): string {
  return process.env.AI_PROVIDER?.trim().toLowerCase() || configuredProviders()[0] || "gemini";
}

function groqSystemPrompt(): string {
  return `${buildSystemPrompt()}

Return a JSON object that matches this JSON schema exactly. Use null for unavailable optional fields and empty arrays for absent education, certifications, or projects:
${JSON.stringify(openRouterResumeJsonSchema)}`;
}

function providerConfig(): ProviderConfig {
  const provider = activeProvider();

  if (provider === "openrouter") {
    const apiKey = requireValue(process.env.OPENROUTER_API_KEY, "OpenRouter is not configured.");
    const model = requireValue(process.env.OPENROUTER_MODEL, "OpenRouter is not configured.");
    const headers = bearerHeaders(apiKey);
    if (process.env.OPENROUTER_APP_URL) headers["HTTP-Referer"] = process.env.OPENROUTER_APP_URL;
    if (process.env.OPENROUTER_APP_NAME) headers["X-OpenRouter-Title"] = process.env.OPENROUTER_APP_NAME;
    return { model, endpoint: OPENROUTER_ENDPOINT, headers, systemPrompt: buildSystemPrompt(), responseFormat: jsonSchemaFormat(openRouterResumeJsonSchema) };
  }

  if (provider === "groq") {
    const apiKey = requireValue(process.env.GROQ_API_KEY, "Groq is not configured.");
    const model = z.enum(GROQ_MODELS).safeParse(process.env.GROQ_MODEL?.trim() || GROQ_MODELS[0]);
    if (!model.success) throw new OpenRouterServiceError("OPENROUTER_CONFIGURATION_ERROR", "Groq model is not supported.");
    return { model: model.data, endpoint: GROQ_ENDPOINT, headers: bearerHeaders(apiKey), systemPrompt: groqSystemPrompt(), responseFormat: { type: "json_object" } };
  }

  if (provider !== "gemini") {
    throw new OpenRouterServiceError("OPENROUTER_CONFIGURATION_ERROR", "AI provider is not configured.");
  }

  const apiKey = requireValue(process.env.GEMINI_API_KEY, "Gemini is not configured.");
  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
  return { model, endpoint: GEMINI_ENDPOINT, headers: bearerHeaders(apiKey), systemPrompt: buildSystemPrompt(), responseFormat: jsonSchemaFormat(geminiResumeJsonSchema) };
}

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

async function rateLimitDetails(response: Response): Promise<(RateLimitDetails & { providerCode?: string }) | undefined> {
  const body = providerErrorSchema.safeParse(await response.json().catch(() => null));
  const error = body.success ? body.data.error : undefined;
  if (response.status === 413 && error?.code !== "rate_limit_exceeded") return undefined;
  return {
    limit: parseLimit(error?.type, error?.message),
    retryAfterSeconds: parseRetrySeconds(response, error?.message),
    providerCode: error?.code,
  };
}

export async function optimizeResume(input: OptimizeResumeInput): Promise<OptimizedResume> {
  const parsedInput = generationInputSchema.safeParse(input);
  if (!parsedInput.success) throw new InvalidInputError(parsedInput.error.issues[0]?.message ?? "Invalid generation input.");
  const { model, endpoint, headers, systemPrompt, responseFormat } = providerConfig();
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers,
      signal: AbortSignal.timeout(60_000),
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: buildUserPrompt(parsedInput.data) },
        ],
        temperature: 0.3,
        max_completion_tokens: 4_000,
        stream: false,
        response_format: responseFormat,
        ...(endpoint === GROQ_ENDPOINT ? { reasoning_effort: "medium" } : {}),
      }),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") throw new OpenRouterServiceError("OPENROUTER_TIMEOUT", "The generation provider timed out.", error);
    throw new OpenRouterServiceError("OPENROUTER_UNAVAILABLE", "The generation provider is unavailable.", error);
  }
  if (!response.ok) {
    const cause = {
      status: response.status,
      statusText: response.statusText,
      requestId: response.headers.get("x-request-id") ?? undefined,
      model,
    };
    if (response.status === 402) throw new OpenRouterServiceError("OPENROUTER_CREDITS_EXHAUSTED", "Generation provider credits are exhausted.", cause);
    if (response.status === 401 || response.status === 403) throw new OpenRouterServiceError("OPENROUTER_UNAUTHORIZED", "The generation provider rejected the credentials.", cause);
    if (response.status === 429 || response.status === 413) {
      const details = await rateLimitDetails(response);
      if (details) {
        const { providerCode, ...rateLimit } = details;
        throw new OpenRouterServiceError("OPENROUTER_RATE_LIMITED", "Generation provider rate limit reached.", { ...cause, ...rateLimit, providerCode }, rateLimit);
      }
    }
    throw new OpenRouterServiceError("OPENROUTER_UNAVAILABLE", `Generation request failed with HTTP ${response.status}.`, cause);
  }
  const envelope = responseSchema.safeParse(await response.json().catch(() => null));
  if (!envelope.success) throw new ResumeValidationError("The generation provider returned an invalid response.");
  let content: unknown;
  try { content = JSON.parse(envelope.data.choices[0]!.message.content); } catch { throw new ResumeValidationError("The generation provider returned malformed JSON."); }
  const result = optimizedResumeSchema.safeParse(content);
  if (!result.success) throw new ResumeValidationError("Generation output failed validation.", result.error);
  return result.data;
}
