import { afterEach, describe, expect, it, vi } from "vitest";

import { OpenRouterServiceError, optimizeResume } from "./index";

const input = { resume: "Software engineer at Acme.", jobDescription: "Build APIs." };
const output = {
  contact: { name: "Jane Doe" },
  summary: "Software engineer.",
  skills: ["TypeScript"],
  experience: [{ company: "Acme", title: "Engineer", dates: "2022–Present", bullets: ["Built APIs."] }],
  education: [{ institution: "University", degree: "BSc" }],
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("optimizeResume with OpenRouter", () => {
  it("returns validated structured output", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "test-key");
    vi.stubEnv("OPENROUTER_MODEL", "test/model");
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      choices: [{ message: { content: JSON.stringify(output) } }],
    }), { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(optimizeResume(input)).resolves.toEqual(output);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://openrouter.ai/api/v1/chat/completions",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("fails before fetch when configuration is missing", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "");
    vi.stubEnv("OPENROUTER_MODEL", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(optimizeResume(input)).rejects.toBeInstanceOf(OpenRouterServiceError);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("maps rate limits without exposing provider details", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "test-key");
    vi.stubEnv("OPENROUTER_MODEL", "test/model");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("private upstream detail", { status: 429 })));

    await expect(optimizeResume(input)).rejects.toMatchObject({ code: "OPENROUTER_RATE_LIMITED" });
  });

  it("maps insufficient credits without exposing provider details", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "test-key");
    vi.stubEnv("OPENROUTER_MODEL", "test/model");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("private upstream detail", { status: 402 })));

    await expect(optimizeResume(input)).rejects.toMatchObject({ code: "OPENROUTER_CREDITS_EXHAUSTED" });
  });
  it("rejects malformed model content", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "test-key");
    vi.stubEnv("OPENROUTER_MODEL", "test/model");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      choices: [{ message: { content: "not-json" } }],
    }), { status: 200 })));

    await expect(optimizeResume(input)).rejects.toMatchObject({ code: "RESUME_VALIDATION_ERROR" });
  });
});
