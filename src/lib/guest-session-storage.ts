import type { OptimizedResume } from "@/services/ai/types";

export const GUEST_DRAFT_KEY = "opti:guest-draft";

export interface GuestDraft {
  masterResume: string;
  jobDescription: string;
  tailoredResume?: OptimizedResume;
}

function isGuestDraft(value: unknown): value is GuestDraft {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return typeof obj["masterResume"] === "string" && typeof obj["jobDescription"] === "string";
}

export function saveGuestDraft(draft: GuestDraft): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(GUEST_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // sessionStorage may be disabled or quota exceeded — degrade silently
  }
}

export function loadGuestDraft(): GuestDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(GUEST_DRAFT_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isGuestDraft(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearGuestDraft(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(GUEST_DRAFT_KEY);
  } catch {
    // degrade silently
  }
}
