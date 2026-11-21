import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { clearGuestDraft, GUEST_DRAFT_KEY, loadGuestDraft, saveGuestDraft } from "./guest-session-storage";

// --- in-memory sessionStorage mock ---
function makeSessionStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => { store.set(key, value); },
    removeItem: (key: string) => { store.delete(key); },
    clear: () => { store.clear(); },
  };
}

const mockStorage = makeSessionStorage();

describe("guest-session-storage", () => {
  beforeEach(() => {
    mockStorage.clear();
    vi.stubGlobal("sessionStorage", mockStorage);
    vi.stubGlobal("window", { sessionStorage: mockStorage });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("saveGuestDraft writes JSON to sessionStorage", () => {
    saveGuestDraft({ masterResume: "my resume", jobDescription: "some job" });
    const raw = mockStorage.getItem(GUEST_DRAFT_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed).toMatchObject({ masterResume: "my resume", jobDescription: "some job" });
  });

  it("loadGuestDraft reads and parses correctly", () => {
    saveGuestDraft({ masterResume: "resume text", jobDescription: "job text" });
    const draft = loadGuestDraft();
    expect(draft).toMatchObject({ masterResume: "resume text", jobDescription: "job text" });
  });

  it("loadGuestDraft includes optional tailoredResume when saved", () => {
    const tailoredResume = {
      contact: { name: "Jane", email: "jane@example.com" },
      summary: "Great dev",
      skills: ["TypeScript"],
      experience: [{ company: "ACME", title: "Dev", dates: "2020–2024", bullets: ["Built things"] }],
      education: [{ institution: "State U", degree: "BS", dates: "2016–2020" }],
    };
    // @ts-expect-error — partial type for test purposes
    saveGuestDraft({ masterResume: "r", jobDescription: "j", tailoredResume });
    const draft = loadGuestDraft();
    expect(draft?.tailoredResume).toMatchObject({ contact: { name: "Jane" } });
  });

  it("loadGuestDraft returns null when key is missing", () => {
    const draft = loadGuestDraft();
    expect(draft).toBeNull();
  });

  it("loadGuestDraft returns null on malformed JSON", () => {
    mockStorage.setItem(GUEST_DRAFT_KEY, "not-valid-json{{{");
    const draft = loadGuestDraft();
    expect(draft).toBeNull();
  });

  it("loadGuestDraft returns null when stored object is missing required fields", () => {
    mockStorage.setItem(GUEST_DRAFT_KEY, JSON.stringify({ masterResume: "only-one-field" }));
    const draft = loadGuestDraft();
    expect(draft).toBeNull();
  });

  it("clearGuestDraft removes the key", () => {
    saveGuestDraft({ masterResume: "r", jobDescription: "j" });
    expect(mockStorage.getItem(GUEST_DRAFT_KEY)).not.toBeNull();
    clearGuestDraft();
    expect(mockStorage.getItem(GUEST_DRAFT_KEY)).toBeNull();
  });

  it("all functions are no-ops when window is undefined", () => {
    vi.stubGlobal("window", undefined);
    expect(() => saveGuestDraft({ masterResume: "r", jobDescription: "j" })).not.toThrow();
    expect(() => loadGuestDraft()).not.toThrow();
    expect(() => clearGuestDraft()).not.toThrow();
    expect(loadGuestDraft()).toBeNull();
  });
});
