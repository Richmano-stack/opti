import { afterEach, describe, expect, it, vi } from "vitest";

import { optimizeResume } from "./index";
import { resetProviderAvailability } from "./optimizeResume";

const GEMINI = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const GROQ = "https://api.groq.com/openai/v1/chat/completions";
const OPENROUTER = "https://openrouter.ai/api/v1/chat/completions";

const input = { resume: "Software engineer at Acme.", jobDescription: "Build APIs." };
const output = {
  contact: { name: "Jane Doe" },
  summary: "Software engineer.",
  skills: ["TypeScript"],
  experience: [{ company: "Acme", title: "Engineer", dates: "2022–Present", bullets: ["Built APIs."] }],
  education: [],
  certifications: [],
  projects: [],
};

afterEach(() => {
  resetProviderAvailability();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.useRealTimers();
});

function clearProviderKeys() {
  vi.stubEnv("AI_PROVIDER", "");
  vi.stubEnv("GEMINI_API_KEY", "");
  vi.stubEnv("GROQ_API_KEY", "");
  vi.stubEnv("OPENROUTER_API_KEY", "");
  vi.stubEnv("OPENROUTER_MODEL", "");
}

function jsonResponse(body: unknown, status = 200, retryAfter?: string) {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (retryAfter) headers.set("retry-after", retryAfter);
  return new Response(JSON.stringify(body), { status, headers });
}

function resumeResponse() {
  return jsonResponse({ choices: [{ message: { content: JSON.stringify(output) } }] });
}

function rateLimited(retryAfter: string) {
  return jsonResponse({
    error: { message: "Rate limit reached.", type: "requests", code: "rate_limit_exceeded" },
  }, 429, retryAfter);
}

function calledUrls(fetchMock: ReturnType<typeof vi.fn>): string[] {
  return fetchMock.mock.calls.map((call) => String(call[0]));
}

describe("provider fallback", () => {
  it("returns the next provider's résumé when the first is rate limited", async () => {
    clearProviderKeys();
    vi.stubEnv("AI_PROVIDER", "groq");
    vi.stubEnv("GROQ_API_KEY", "groq-key");
    vi.stubEnv("GEMINI_API_KEY", "gemini-key");
    const fetchMock = vi.fn().mockImplementation((url: string) => Promise.resolve(
      url === GROQ ? rateLimited("8") : resumeResponse(),
    ));
    vi.stubGlobal("fetch", fetchMock);

    await expect(optimizeResume(input)).resolves.toEqual(output);
    expect(calledUrls(fetchMock)).toEqual([GROQ, GEMINI]);
  });

  it("continues after malformed JSON", async () => {
    clearProviderKeys();
    vi.stubEnv("GROQ_API_KEY", "groq-key");
    vi.stubEnv("OPENROUTER_API_KEY", "openrouter-key");
    vi.stubEnv("OPENROUTER_MODEL", "test/model");
    const fetchMock = vi.fn().mockImplementation((url: string) => Promise.resolve(
      url === GROQ
        ? jsonResponse({ choices: [{ message: { content: "not-json" } }] })
        : resumeResponse(),
    ));
    vi.stubGlobal("fetch", fetchMock);

    await expect(optimizeResume(input)).resolves.toEqual(output);
    expect(calledUrls(fetchMock)).toEqual([GROQ, OPENROUTER]);
  });

  it("reports the shortest wait when every provider is rate limited", async () => {
    clearProviderKeys();
    vi.stubEnv("GEMINI_API_KEY", "gemini-key");
    vi.stubEnv("GROQ_API_KEY", "groq-key");
    vi.stubEnv("OPENROUTER_API_KEY", "openrouter-key");
    vi.stubEnv("OPENROUTER_MODEL", "test/model");
    const waits: Record<string, string> = { [GEMINI]: "30", [GROQ]: "8", [OPENROUTER]: "90" };
    vi.stubGlobal("fetch", vi.fn().mockImplementation((url: string) => Promise.resolve(rateLimited(waits[url] ?? "60"))));

    await expect(optimizeResume(input)).rejects.toMatchObject({
      code: "OPENROUTER_RATE_LIMITED",
      rateLimit: { retryAfterSeconds: 8 },
    });
  });

  it("skips a provider that is still inside its retry window", async () => {
    clearProviderKeys();
    vi.stubEnv("GROQ_API_KEY", "groq-key");
    vi.stubEnv("GEMINI_API_KEY", "gemini-key");
    let geminiCalls = 0;
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url === GEMINI && geminiCalls === 0) {
        geminiCalls += 1;
        return Promise.resolve(rateLimited("90"));
      }
      return Promise.resolve(resumeResponse());
    });
    vi.stubGlobal("fetch", fetchMock);

    await optimizeResume(input);
    await optimizeResume(input);

    expect(calledUrls(fetchMock)).toEqual([GEMINI, GROQ, GROQ]);
  });

  it("does not call a provider for invalid input", async () => {
    clearProviderKeys();
    vi.stubEnv("GEMINI_API_KEY", "gemini-key");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(optimizeResume({ resume: "   ", jobDescription: "Build APIs." })).rejects.toMatchObject({
      code: "INVALID_INPUT",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("stops when the request budget can no longer fit an attempt", async () => {
    clearProviderKeys();
    vi.stubEnv("GROQ_API_KEY", "groq-key");
    vi.stubEnv("GEMINI_API_KEY", "gemini-key");
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-10-02T00:00:00Z"));
    const fetchMock = vi.fn().mockImplementation(() => {
      vi.setSystemTime(new Date("2026-10-02T00:01:10Z"));
      return Promise.resolve(new Response(null, { status: 503 }));
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(optimizeResume(input)).rejects.toMatchObject({ code: "OPENROUTER_UNAVAILABLE" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
