import { z } from "zod";

import { OpenRouterServiceError } from "./errors";
import { geminiResumeJsonSchema, openRouterResumeJsonSchema } from "./openrouter-schema";
import { buildSystemPrompt } from "./prompts";

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

export type ProviderConfig = {
  model: string;
  endpoint: string;
  headers: Record<string, string>;
  systemPrompt: string;
  responseFormat: unknown;
  reasoningEffort?: "medium";
};

function requireValue(value: string | undefined, message: string) {
  const trimmed = value?.trim();
  if (!trimmed) throw new OpenRouterServiceError("OPENROUTER_CONFIGURATION_ERROR", message);
  return trimmed;
}

function bearerHeaders(apiKey: string): Record<string, string> {
  return { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
}

function jsonSchemaFormat(schema: unknown) {
  return {
    type: "json_schema",
    json_schema: { name: "tailored_resume", strict: true, schema },
  };
}

function groqSystemPrompt(): string {
  return `${buildSystemPrompt()}

Return a JSON object that matches this JSON schema exactly. Use null for unavailable optional fields and empty arrays for absent education, certifications, or projects:
${JSON.stringify(openRouterResumeJsonSchema)}`;
}

export function configuredProviders(): AiProvider[] {
  return AI_PROVIDERS.filter((provider) => Boolean(process.env[providerKeys[provider]]?.trim()));
}

export function providerConfig(provider: AiProvider): ProviderConfig {
  if (provider === "openrouter") {
    const apiKey = requireValue(process.env.OPENROUTER_API_KEY, "OpenRouter is not configured.");
    const model = requireValue(process.env.OPENROUTER_MODEL, "OpenRouter is not configured.");
    const headers = bearerHeaders(apiKey);
    if (process.env.OPENROUTER_APP_URL) headers["HTTP-Referer"] = process.env.OPENROUTER_APP_URL;
    if (process.env.OPENROUTER_APP_NAME) headers["X-OpenRouter-Title"] = process.env.OPENROUTER_APP_NAME;
    return {
      model,
      endpoint: OPENROUTER_ENDPOINT,
      headers,
      systemPrompt: buildSystemPrompt(),
      responseFormat: jsonSchemaFormat(openRouterResumeJsonSchema),
    };
  }

  if (provider === "groq") {
    const apiKey = requireValue(process.env.GROQ_API_KEY, "Groq is not configured.");
    const model = z.enum(GROQ_MODELS).safeParse(process.env.GROQ_MODEL?.trim() || GROQ_MODELS[0]);
    if (!model.success) throw new OpenRouterServiceError("OPENROUTER_CONFIGURATION_ERROR", "Groq model is not supported.");
    return {
      model: model.data,
      endpoint: GROQ_ENDPOINT,
      headers: bearerHeaders(apiKey),
      systemPrompt: groqSystemPrompt(),
      responseFormat: { type: "json_object" },
      reasoningEffort: "medium",
    };
  }

  if (provider !== "gemini") {
    throw new OpenRouterServiceError("OPENROUTER_CONFIGURATION_ERROR", "AI provider is not configured.");
  }

  const apiKey = requireValue(process.env.GEMINI_API_KEY, "Gemini is not configured.");
  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
  return {
    model,
    endpoint: GEMINI_ENDPOINT,
    headers: bearerHeaders(apiKey),
    systemPrompt: buildSystemPrompt(),
    responseFormat: jsonSchemaFormat(geminiResumeJsonSchema),
  };
}
