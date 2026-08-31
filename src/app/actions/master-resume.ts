"use server";

import { getServerSession } from "@/server/auth/session";
import {
  findMasterResumeByUserId,
  MasterResumeError,
  upsertMasterResume,
} from "@/services/master-resume";
import type { MasterResume } from "@/db";

export type MasterResumeActionError = {
  code: "UNAUTHORIZED" | "INVALID_INPUT" | "SAVE_FAILED";
  message: string;
};

export type MasterResumeActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: MasterResumeActionError };

export async function getMasterResume(): Promise<
  MasterResumeActionResult<MasterResume | null>
> {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return {
      ok: false,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be signed in to view your master resume.",
      },
    };
  }

  try {
    const resume = await findMasterResumeByUserId(session.user.id);
    return { ok: true, data: resume };
  } catch {
    return {
      ok: false,
      error: {
        code: "SAVE_FAILED",
        message: "Failed to load your master resume. Please try again.",
      },
    };
  }
}

export async function saveMasterResume(
  content: string,
): Promise<MasterResumeActionResult<MasterResume>> {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return {
      ok: false,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be signed in to save your master resume.",
      },
    };
  }

  try {
    const resume = await upsertMasterResume(session.user.id, content);
    return { ok: true, data: resume };
  } catch (error) {
    if (error instanceof MasterResumeError) {
      return {
        ok: false,
        error: {
          code: "INVALID_INPUT",
          message: error.message,
        },
      };
    }

    return {
      ok: false,
      error: {
        code: "SAVE_FAILED",
        message: "Failed to save your master resume. Please try again.",
      },
    };
  }
}
