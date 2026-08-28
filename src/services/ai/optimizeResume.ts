import { GoogleGenerativeAI } from "@google/generative-ai";

import {
  GeminiServiceError,
  InvalidInputError,
  ResumeValidationError,
} from "./errors";
import { buildSystemPrompt, buildUserPrompt } from "./prompts";
import { optimizedResumeGeminiSchema } from "./schema";
import {
  generationInputSchema,
  optimizedResumeSchema,
  type OptimizeResumeInput,
  type OptimizedResume,
} from "./types";

const DEFAULT_MODEL = "gemini-2.0-flash";

function resolveApiKey(): string {
  const apiKey =
    process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey?.trim()) {
    throw new GeminiServiceError(
      "Missing Gemini API key. Set GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY in the server environment.",
    );
  }

  return apiKey.trim();
}

function parseInput(input: OptimizeResumeInput): OptimizeResumeInput {
  const validation = generationInputSchema.safeParse(input);

  if (!validation.success) {
    throw new InvalidInputError(
      validation.error.issues[0]?.message ?? "Resume generation input is invalid.",
    );
  }

  return validation.data;
}

function parseJsonResponse(rawText: string): unknown {
  try {
    return JSON.parse(rawText) as unknown;
  } catch {
    throw new ResumeValidationError(
      "Gemini returned malformed JSON that could not be parsed.",
      undefined,
      rawText,
    );
  }
}

/**
 * Accepts raw resume + job description strings and returns a validated,
 * ATS-optimized structured resume payload via Gemini structured JSON output.
 */
export async function optimizeResume(
  input: OptimizeResumeInput,
): Promise<OptimizedResume> {
  const validatedInput = parseInput(input);

  const genAI = new GoogleGenerativeAI(resolveApiKey());
  const model = genAI.getGenerativeModel({
    model: DEFAULT_MODEL,
    systemInstruction: buildSystemPrompt(),
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: optimizedResumeGeminiSchema,
      temperature: 0.3,
    },
  });

  let rawText: string;

  try {
    const result = await model.generateContent(buildUserPrompt(validatedInput));
    rawText = result.response.text();
  } catch (error) {
    throw new GeminiServiceError("Gemini API request failed.", error);
  }

  if (!rawText.trim()) {
    throw new ResumeValidationError("Gemini returned an empty response.");
  }

  const parsed = parseJsonResponse(rawText);
  const validation = optimizedResumeSchema.safeParse(parsed);

  if (!validation.success) {
    throw new ResumeValidationError(
      "Gemini response failed schema validation.",
      validation.error,
      parsed,
    );
  }

  return validation.data;
}
