import { afterEach, describe, expect, it, vi } from "vitest";

import { OpenRouterServiceError, optimizeResume } from "./index";
import { resetProviderAvailability } from "./optimizeResume";

const input = { resume: "Software engineer at Acme.", jobDescription: "Build APIs." };
const output = {
  contact: { name: "Jane Doe" },
  summary: "Software engineer.",
  skills: ["TypeScript"],
  experience: [{ company: "Acme", title: "Engineer", dates: "2022–Present", bullets: ["Built APIs."] }],
  education: [{ institution: "University", degree: "BSc" }],
};

afterEach(() => {
  resetProviderAvailability();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

function isolateProviders() {
  vi.stubEnv("GEMINI_API_KEY", "");
  vi.stubEnv("GROQ_API_KEY", "");
  vi.stubEnv("OPENROUTER_API_KEY", "");
}

function useOpenRouter() {
  isolateProviders();
  vi.stubEnv("AI_PROVIDER", "openrouter");
  vi.stubEnv("OPENROUTER_API_KEY", "test-key");
  vi.stubEnv("OPENROUTER_MODEL", "test/model");
}

describe("optimizeResume with OpenRouter", () => {
  it("returns validated structured output", async () => {
    useOpenRouter();
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
    isolateProviders();
    vi.stubEnv("AI_PROVIDER", "openrouter");
    vi.stubEnv("OPENROUTER_MODEL", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(optimizeResume(input)).rejects.toBeInstanceOf(OpenRouterServiceError);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("maps rate limits without exposing provider details", async () => {
    useOpenRouter();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("private upstream detail", { status: 429 })));

    await expect(optimizeResume(input)).rejects.toMatchObject({ code: "OPENROUTER_RATE_LIMITED" });
  });

  it("maps insufficient credits without exposing provider details", async () => {
    useOpenRouter();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("private upstream detail", { status: 402 })));

    await expect(optimizeResume(input)).rejects.toMatchObject({ code: "OPENROUTER_CREDITS_EXHAUSTED" });
  });
  it("rejects malformed model content", async () => {
    useOpenRouter();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      choices: [{ message: { content: "not-json" } }],
    }), { status: 200 })));

    await expect(optimizeResume(input)).rejects.toMatchObject({ code: "RESUME_VALIDATION_ERROR" });
  });
});

describe("optimizeResume with Gemini", () => {
  it("calls the Gemini endpoint with the default model and a compatible schema", async () => {
    isolateProviders();
    vi.stubEnv("AI_PROVIDER", "gemini");
    vi.stubEnv("GEMINI_API_KEY", "gemini-key");
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      choices: [{ message: { content: JSON.stringify(output) } }],
    }), { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(optimizeResume(input)).resolves.toEqual(output);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer gemini-key" }),
      }),
    );

    const request = fetchMock.mock.calls[0]?.[1] as { body?: string } | undefined;
    const body = JSON.parse(request?.body ?? "{}") as {
      model: string;
      response_format: {
        json_schema: { schema: { properties: { contact: { required: string[] } } } };
      };
    };
    expect(body.model).toBe("gemini-3.5-flash");
    expect(JSON.stringify(body.response_format)).not.toContain("additionalProperties");
    expect(body.response_format.json_schema.schema.properties.contact.required).toEqual(["name"]);
    const schema = body.response_format.json_schema.schema as unknown as {
      required: string[];
      properties: { certifications: { items: { required: string[] } } };
    };
    expect(schema.required).toEqual([
      "contact",
      "headline",
      "summary",
      "skills",
      "experience",
      "education",
      "certifications",
      "projects",
      "matchNote",
    ]);
    expect(schema.properties.certifications.items.required).toEqual(["name"]);
  });
});
