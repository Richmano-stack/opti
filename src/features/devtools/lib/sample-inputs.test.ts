import { describe, expect, it } from "vitest";

import { loadDevSampleInputs } from "./load-sample-inputs";
import { isDevelopmentRuntime } from "./sample-inputs";

describe("development sample inputs", () => {
  it("is available only in development", () => {
    expect(isDevelopmentRuntime("development")).toBe(true);
    expect(isDevelopmentRuntime("production")).toBe(false);
    expect(isDevelopmentRuntime("test")).toBe(false);
  });

  it("loads the résumé and job-description fixtures", async () => {
    const sample = await loadDevSampleInputs();

    expect(sample.resume).toContain("RICHMANO NASY");
    expect(sample.jobDescription).toContain("Contact Centre Supervisor");
  });
});
