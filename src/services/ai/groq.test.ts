import { afterEach, describe, expect, it, vi } from "vitest";

import { configuredProviders, optimizeResume } from "./index";
import { resetProviderAvailability } from "./optimizeResume";

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

type GroqRequest = {
  model: string;
  stream: boolean;
  temperature: number;
  max_completion_tokens: number;
  reasoning_effort?: string;
  response_format: { type: string };
  messages: Array<{ role: string; content: string }>;
};

afterEach(() => {
  resetProviderAvailability();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

function clearProviderKeys() {
  vi.stubEnv("AI_PROVIDER", "");
  vi.stubEnv("GEMINI_API_KEY", "");
  vi.stubEnv("GROQ_API_KEY", "");
  vi.stubEnv("OPENROUTER_API_KEY", "");
  vi.stubEnv("GROQ_MODEL", "");
}

function successfulFetch() {
  return vi.fn().mockResolvedValue(new Response(JSON.stringify({
    choices: [{ message: { content: JSON.stringify(output) } }],
  }), { status: 200, headers: { "Content-Type": "application/json" } }));
}

function requestBody(fetchMock: ReturnType<typeof vi.fn>): GroqRequest {
  const request = fetchMock.mock.calls[0]?.[1] as { body?: string } | undefined;
  return JSON.parse(request?.body ?? "{}") as GroqRequest;
}

describe("optimizeResume with Groq", () => {
  it("calls Groq with the default model, JSON mode, and the résumé schema in the prompt", async () => {
    clearProviderKeys();
    vi.stubEnv("AI_PROVIDER", "groq");
    vi.stubEnv("GROQ_API_KEY", "groq-key");
    const fetchMock = successfulFetch();
    vi.stubGlobal("fetch", fetchMock);

    await expect(optimizeResume(input)).resolves.toEqual(output);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.groq.com/openai/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer groq-key" }),
      }),
    );

    const body = requestBody(fetchMock);
    expect(body.model).toBe("openai/gpt-oss-120b");
    expect(body.reasoning_effort).toBe("medium");
    expect(body.stream).toBe(false);
    expect(body.temperature).toBe(0.3);
    expect(body.max_completion_tokens).toBe(4_000);
    expect(body.response_format).toEqual({ type: "json_object" });
    expect(body.messages[0]?.content).toContain('"certifications"');
  });

  it("accepts the configured Groq model", async () => {
    clearProviderKeys();
    vi.stubEnv("AI_PROVIDER", "groq");
    vi.stubEnv("GROQ_API_KEY", "groq-key");
    vi.stubEnv("GROQ_MODEL", "openai/gpt-oss-120b");
    const fetchMock = successfulFetch();
    vi.stubGlobal("fetch", fetchMock);

    await optimizeResume(input);
    expect(requestBody(fetchMock).model).toBe("openai/gpt-oss-120b");
  });

  it("rejects an unsupported model before fetch", async () => {
    clearProviderKeys();
    vi.stubEnv("AI_PROVIDER", "groq");
    vi.stubEnv("GROQ_API_KEY", "groq-key");
    vi.stubEnv("GROQ_MODEL", "mixtral-8x7b-32768");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(optimizeResume(input)).rejects.toMatchObject({ code: "OPENROUTER_CONFIGURATION_ERROR" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("selects Groq when it is the only configured key", async () => {
    clearProviderKeys();
    vi.stubEnv("GROQ_API_KEY", "groq-key");
    const fetchMock = successfulFetch();
    vi.stubGlobal("fetch", fetchMock);

    expect(configuredProviders()).toEqual(["groq"]);
    await optimizeResume(input);
    expect(fetchMock.mock.calls[0]?.[0]).toBe("https://api.groq.com/openai/v1/chat/completions");
  });

  it("parses a tokens-per-minute 429 with retry-after", async () => {
    clearProviderKeys();
    vi.stubEnv("AI_PROVIDER", "groq");
    vi.stubEnv("GROQ_API_KEY", "groq-key");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      error: {
        message: "Rate limit reached for model `llama-3.3-70b-versatile` on tokens per minute (TPM): Limit 12000, Used 11800, Requested 900. Please try again in 7.66s.",
        type: "tokens",
        code: "rate_limit_exceeded",
      },
    }), { status: 429, headers: { "retry-after": "8" } })));

    await expect(optimizeResume(input)).rejects.toMatchObject({
      code: "OPENROUTER_RATE_LIMITED",
      rateLimit: { limit: "tokens", retryAfterSeconds: 8 },
    });
  });

  it("reads the wait time from the message when retry-after is missing", async () => {
    clearProviderKeys();
    vi.stubEnv("AI_PROVIDER", "groq");
    vi.stubEnv("GROQ_API_KEY", "groq-key");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      error: {
        message: "Rate limit reached for model `llama-3.1-8b-instant` on requests per day (RPD): Limit 14400. Please try again in 1m30.5s.",
        type: "requests",
        code: "rate_limit_exceeded",
      },
    }), { status: 429 })));

    await expect(optimizeResume(input)).rejects.toMatchObject({
      code: "OPENROUTER_RATE_LIMITED",
      rateLimit: { limit: "requests", retryAfterSeconds: 91 },
    });
  });

  it("treats a request too large for the token limit as rate limited", async () => {
    clearProviderKeys();
    vi.stubEnv("AI_PROVIDER", "groq");
    vi.stubEnv("GROQ_API_KEY", "groq-key");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      error: {
        message: "Request too large for model `llama-3.1-8b-instant` on tokens per minute (TPM): Limit 6000, Requested 9200.",
        type: "tokens",
        code: "rate_limit_exceeded",
      },
    }), { status: 413 })));

    await expect(optimizeResume(input)).rejects.toMatchObject({
      code: "OPENROUTER_RATE_LIMITED",
      rateLimit: { limit: "tokens" },
    });
  });
});
