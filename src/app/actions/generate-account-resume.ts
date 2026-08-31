"use server";

import { getServerSession } from "@/server/auth/session";
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
