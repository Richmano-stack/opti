"use server";

import { getServerSession } from "@/server/auth/session";
import { parseContactReview, type ContactField, type ContactReview } from "@/services/contact-info";
import { prepareContactPreflight } from "@/services/contact-preflight";
import type { OptimizedResume } from "@/services/ai/types";
import { findMasterResumeByUserId, upsertMasterResume } from "@/services/master-resume";

import {
  generateResume,
  type GenerateResumeError,
  type GenerateResumeResult,
} from "./generate-resume";

export type AccountGenerationError = GenerateResumeError | {
  code: "UNAUTHORIZED" | "MASTER_RESUME_REQUIRED";
  message: string;
};

export type AccountGenerationResult =
  | GenerateResumeResult
  | { ok: false; missingFields: ContactField[] }
  | { ok: false; error: AccountGenerationError };

export type AccountGenerationState =
  | { status: "idle" }
  | { status: "missing_contact_info"; missingFields: ContactField[] }
  | { status: "success"; data: OptimizedResume }
  | { status: "error"; error: AccountGenerationError };

const emptyContactReview: ContactReview = {
  reviewedFields: [],
  additions: {},
  saveToMasterResume: false,
};

export async function generateAccountResume(
  jobDescription: string,
  contactReview: ContactReview = emptyContactReview,
): Promise<AccountGenerationResult> {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return {
      ok: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Sign in to tailor your saved resume.",
      },
    };
  }

  let masterResume;

  try {
    masterResume = await findMasterResumeByUserId(session.user.id);
  } catch (error) {
    console.error("[resume-generation] Failed to load saved master resume", {
      name: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : String(error),
      userId: session.user.id,
    });

    return {
      ok: false,
      error: {
        code: "SERVICE_UNAVAILABLE",
        message: "Your saved resume could not be loaded. Please try again.",
      },
    };
  }

  if (!masterResume) {
    return {
      ok: false,
      error: {
        code: "MASTER_RESUME_REQUIRED",
        message: "Save your master resume before tailoring it for a role.",
      },
    };
  }

  const preflight = prepareContactPreflight(masterResume.content, contactReview);

  if (preflight.status === "missing") {
    return { ok: false, missingFields: preflight.fields };
  }

  if (preflight.shouldSave) {
    try {
      await upsertMasterResume(session.user.id, preflight.resume);
    } catch (error) {
      console.error("[resume-generation] Failed to save contact details", {
        name: error instanceof Error ? error.name : "UnknownError",
        message: error instanceof Error ? error.message : String(error),
        userId: session.user.id,
      });
      return {
        ok: false,
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: "Your contact details could not be saved. Please try again.",
        },
      };
    }
  }

  return generateResume({
    resume: preflight.resume,
    jobDescription,
  });
}

export async function submitAccountResume(
  _previousState: AccountGenerationState,
  formData: FormData,
): Promise<AccountGenerationState> {
  const result = await generateAccountResume(
    String(formData.get("jobDescription") ?? ""),
    parseContactReview(formData),
  );

  if (result.ok) return { status: "success", data: result.data };
  if ("missingFields" in result) {
    return {
      status: "missing_contact_info",
      missingFields: result.missingFields,
    };
  }

  return { status: "error", error: result.error };
}
