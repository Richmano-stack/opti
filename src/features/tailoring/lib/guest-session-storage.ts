import { optimizedResumeSchema, type OptimizedResume } from "@/features/tailoring/lib/types";

export const GUEST_DRAFT_KEY = "opti:guest-draft";

export interface GuestDraft {
  masterResume: string;
  jobDescription: string;
  tailoredResume?: OptimizedResume;
}

function isGuestDraft(value: unknown): value is GuestDraft {
  if (typeof value !== "object" || value === null) return false;
  const draft = value as Record<string, unknown>;
  if (typeof draft.masterResume !== "string" || typeof draft.jobDescription !== "string") return false;
  if (draft.tailoredResume === undefined) return true;
  return optimizedResumeSchema.safeParse(draft.tailoredResume).success;
}

export function saveGuestDraft(draft: GuestDraft): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(GUEST_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Storage can be disabled or full; the guest workflow remains usable in memory.
  }
}

export function loadGuestDraft(): GuestDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(GUEST_DRAFT_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isGuestDraft(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearGuestDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(GUEST_DRAFT_KEY);
  } catch {
    // Ignore unavailable storage.
  }
}
