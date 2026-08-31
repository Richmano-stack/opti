"use server";

import { getServerSession } from "@/server/auth/session";
import type { OptimizedResume } from "@/services/ai/types";
import { findMasterResumeByUserId } from "@/services/master-resume";

import {
  generateResume,
  type GenerateResumeResult,
} from "./generate-resume";

export type AccountGenerationResult =
  | GenerateResumeResult
  | {
      ok: false;
      error: {
        code: "UNAUTHORIZED" | "MASTER_RESUME_REQUIRED";
        message: string;
      };
    };

export type AccountGenerationState =
  | { status: "idle" }
  | { status: "success"; data: OptimizedResume }
  | {
      status: "error";
      error: Extract<AccountGenerationResult, { ok: false }>["error"];
    };

export async function generateAccountResume(
  jobDescription: string,
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
  } catch {
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

  return generateResume({
    resume: masterResume.content,
    jobDescription,
  });
}

export async function submitAccountResume(
  _previousState: AccountGenerationState,
  formData: FormData,
): Promise<AccountGenerationState> {
  const result = await generateAccountResume(
    String(formData.get("jobDescription") ?? ""),
  );

  if (result.ok) return { status: "success", data: result.data };

  return { status: "error", error: result.error };
}