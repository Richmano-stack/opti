import { z } from "zod";
import { OpenRouterServiceError, InvalidInputError, ResumeValidationError } from "./errors";
import { openRouterResumeJsonSchema } from "./openrouter-schema";
import { buildSystemPrompt, buildUserPrompt } from "./prompts";
import { generationInputSchema, optimizedResumeSchema, type OptimizeResumeInput, type OptimizedResume } from "./types";

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const responseSchema = z.object({ choices: z.array(z.object({ message: z.object({ content: z.string() }) })).min(1) });

function config() {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  const model = process.env.OPENROUTER_MODEL?.trim();
  if (!apiKey || !model) throw new OpenRouterServiceError("OPENROUTER_CONFIGURATION_ERROR", "OpenRouter is not configured.");
  return { apiKey, model };
}

export async function optimizeResume(input: OptimizeResumeInput): Promise<OptimizedResume> {
  const parsedInput = generationInputSchema.safeParse(input);
  if (!parsedInput.success) throw new InvalidInputError(parsedInput.error.issues[0]?.message ?? "Invalid generation input.");
  const { apiKey, model } = config();
  const headers: Record<string, string> = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  if (process.env.OPENROUTER_APP_URL) headers["HTTP-Referer"] = process.env.OPENROUTER_APP_URL;
  if (process.env.OPENROUTER_APP_NAME) headers["X-OpenRouter-Title"] = process.env.OPENROUTER_APP_NAME;
  let response: Response;
  try {
    response = await fetch(ENDPOINT, { method: "POST", headers, signal: AbortSignal.timeout(60_000), body: JSON.stringify({ model, messages: [{ role: "system", content: buildSystemPrompt() }, { role: "user", content: buildUserPrompt(parsedInput.data) }], temperature: 0.3, max_completion_tokens: 4_000, response_format: { type: "json_schema", json_schema: { name: "tailored_resume", strict: true, schema: openRouterResumeJsonSchema } } }) });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") throw new OpenRouterServiceError("OPENROUTER_TIMEOUT", "OpenRouter timed out.", error);
    throw new OpenRouterServiceError("OPENROUTER_UNAVAILABLE", "OpenRouter is unavailable.", error);
  }
  if (!response.ok) {
    if (response.status === 402) throw new OpenRouterServiceError("OPENROUTER_CREDITS_EXHAUSTED", "OpenRouter credits are exhausted.");
    if (response.status === 401 || response.status === 403) throw new OpenRouterServiceError("OPENROUTER_UNAUTHORIZED", "OpenRouter rejected the credentials.");
    if (response.status === 429) throw new OpenRouterServiceError("OPENROUTER_RATE_LIMITED", "OpenRouter rate limit reached.");
    throw new OpenRouterServiceError("OPENROUTER_UNAVAILABLE", "OpenRouter request failed.");
  }
  const envelope = responseSchema.safeParse(await response.json().catch(() => null));
  if (!envelope.success) throw new ResumeValidationError("OpenRouter returned an invalid response.");
  let content: unknown;
  try { content = JSON.parse(envelope.data.choices[0]!.message.content); } catch { throw new ResumeValidationError("OpenRouter returned malformed JSON."); }
  const result = optimizedResumeSchema.safeParse(content);
  if (!result.success) throw new ResumeValidationError("OpenRouter output failed validation.", result.error);
  return result.data;
}
