import { afterEach, describe, expect, it, vi } from "vitest";
import { optimizeResume } from "./index";

const input = { resume: "Engineer at Acme.", jobDescription: "Build APIs." };

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

function configure() {
  vi.stubEnv("OPENROUTER_API_KEY", "test-key");
  vi.stubEnv("OPENROUTER_MODEL", "test/model");
}

describe("OpenRouter failure mapping", () => {
  it("maps rejected credentials", async () => {
    configure();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 401 })));
    await expect(optimizeResume(input)).rejects.toMatchObject({ code: "OPENROUTER_UNAUTHORIZED" });
  });

  it("maps provider outages", async () => {
    configure();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 503 })));
    await expect(optimizeResume(input)).rejects.toMatchObject({ code: "OPENROUTER_UNAVAILABLE" });
  });

  it("maps request timeouts", async () => {
    configure();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new DOMException("timed out", "TimeoutError")));
    await expect(optimizeResume(input)).rejects.toMatchObject({ code: "OPENROUTER_TIMEOUT" });
  });
});
