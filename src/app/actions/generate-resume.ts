"use server";

import { parseContactReview, type ContactField } from "@/services/contact-info";
import { prepareContactPreflight } from "@/services/contact-preflight";

import { OpenRouterServiceError } from "../../services/ai/errors";
import { logGenerationError } from "../../services/ai/log-generation-error";
import { optimizeResume } from "../../services/ai/optimizeResume";
import {
  generationInputSchema,
  type OptimizeResumeInput,
  type OptimizedResume,
} from "../../services/ai/types";

type GenerateResumeErrorCode =
  | "INVALID_INPUT"
  | "CONFIGURATION_ERROR"
  | "RATE_LIMITED"
  | "SERVICE_UNAVAILABLE";

export type GenerateResumeError = {
  code: GenerateResumeErrorCode;
  message: string;
};

export type GenerateResumeResult =
  | { ok: true; data: OptimizedResume }
  | { ok: false; error: GenerateResumeError };

export type GuestGenerationState =
  | { status: "idle" }
  | { status: "missing_contact_info"; missingFields: ContactField[] }
  | { status: "success"; data: OptimizedResume }
  | {
      status: "error";
      error: GenerateResumeError;
    };

const providerErrors: Record<
  OpenRouterServiceError["code"],
  GenerateResumeResult & { ok: false }
> = {
  OPENROUTER_CONFIGURATION_ERROR: {
    ok: false,
    error: {
      code: "CONFIGURATION_ERROR",
      message: "Résumé generation is not configured yet.",
    },
  },
  OPENROUTER_CREDITS_EXHAUSTED: {
    ok: false,
    error: {
      code: "CONFIGURATION_ERROR",
      message: "Résumé generation needs provider credits or a free model.",
    },
  },
  OPENROUTER_RATE_LIMITED: {
    ok: false,
    error: {
      code: "RATE_LIMITED",
      message: "The résumé service is busy. Please try again shortly.",
    },
  },
  OPENROUTER_UNAUTHORIZED: {
    ok: false,
    error: {
      code: "SERVICE_UNAVAILABLE",
      message: "Résumé generation is temporarily unavailable. Please try again later.",
    },
  },
  OPENROUTER_TIMEOUT: {
    ok: false,
    error: {
      code: "SERVICE_UNAVAILABLE",
      message: "Résumé generation took too long. Please try again.",
    },
  },
  OPENROUTER_UNAVAILABLE: {
    ok: false,
    error: {
      code: "SERVICE_UNAVAILABLE",
      message: "Résumé generation is temporarily unavailable. Please try again later.",
    },
  },
};

export async function generateResume(
  input: OptimizeResumeInput,
): Promise<GenerateResumeResult> {
  const parsed = generationInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: "Add your résumé and the job description to continue.",
      },
    };
  }

  try {
    return { ok: true, data: await optimizeResume(parsed.data) };
  } catch (error) {
    logGenerationError(error);

    if (error instanceof OpenRouterServiceError) {
      return providerErrors[error.code];
    }

    return {
      ok: false,
      error: {
        code: "SERVICE_UNAVAILABLE",
        message: "Résumé generation failed. Please try again.",
      },
    };
  }
}
export async function submitGuestResume(
  _previousState: GuestGenerationState,
  formData: FormData,
): Promise<GuestGenerationState> {
  const input = {
    resume: String(formData.get("resume") ?? ""),
    jobDescription: String(formData.get("jobDescription") ?? ""),
  };
  const parsedInput = generationInputSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      status: "error",
      error: {
        code: "INVALID_INPUT",
        message: "Add your résumé and the job description to continue.",
      },
    };
  }

  const preflight = prepareContactPreflight(
    parsedInput.data.resume,
    parseContactReview(formData),
  );

  if (preflight.status === "missing") {
    return {
      status: "missing_contact_info",
      missingFields: preflight.fields,
    };
  }

  const result = await generateResume({
    resume: preflight.resume,
    jobDescription: parsedInput.data.jobDescription,
  });

  if (result.ok) {
    return { status: "success", data: result.data };
  }

  return { status: "error", error: result.error };
}
