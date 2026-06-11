import { GoogleGenerativeAI } from "@google/generative-ai";

import {
  GeminiServiceError,
  InvalidInputError,
  ResumeValidationError,
} from "./errors";
import { buildSystemPrompt, buildUserPrompt } from "./prompts";
import { optimizedResumeGeminiSchema } from "./schema";
import {
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

function assertValidInput(input: OptimizeResumeInput): void {
  if (!input.resume?.trim()) {
    throw new InvalidInputError("Resume text is required and cannot be empty.");
  }

  if (!input.jobDescription?.trim()) {
    throw new InvalidInputError("Job description text is required and cannot be empty.");
  }
}

function parseJsonResponse(rawText: string): unknown {
  try {
    return JSON.parse(rawText) as unknown;
  } catch (error) {
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
  assertValidInput(input);

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
    const result = await model.generateContent(buildUserPrompt(input));
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
