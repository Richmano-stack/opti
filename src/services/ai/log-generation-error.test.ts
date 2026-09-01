import { describe, expect, it, vi } from "vitest";

import { OpenRouterServiceError } from "./errors";
import { describeGenerationError, logGenerationError } from "./log-generation-error";

describe("generation error logging", () => {
  it("includes provider diagnostics without input or secret data", () => {
    const error = new OpenRouterServiceError(
      "OPENROUTER_UNAVAILABLE",
      "OpenRouter request failed with HTTP 503.",
      { status: 503, requestId: "request-123" },
    );

    expect(describeGenerationError(error)).toEqual({
      name: "OpenRouterServiceError",
      code: "OPENROUTER_UNAVAILABLE",
      message: "OpenRouter request failed with HTTP 503.",
      cause: { status: 503, requestId: "request-123" },
    });
  });

  it("writes a clearly labelled server console error", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const error = new Error("Unexpected failure");

    logGenerationError(error);

    expect(consoleError).toHaveBeenCalledWith(
      '[resume-generation] Generation failed {"name":"Error","message":"Unexpected failure"}',
    );
    consoleError.mockRestore();
  });
});
