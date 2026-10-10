import { afterEach, describe, expect, it, vi } from "vitest";

import { createPrintJob, deletePrintJob, readPrintJob } from "@/features/tailoring/pdf/print-job";
import type { OptimizedResume } from "@/features/tailoring/lib/types";

const resume: OptimizedResume = {
  contact: {
    name: "Ada Lovelace",
    email: "ada@example.com",
    phone: undefined,
    location: undefined,
  },
  summary: "Wrote the first published algorithm.",
  skills: ["Mathematics"],
  experience: [
    {
      company: "Analytical Engines",
      title: "Programmer",
      dates: "1842–Present",
      bullets: ["Published a method for calculating Bernoulli numbers."],
    },
  ],
  education: [],
};

describe("print jobs", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("keeps the job where every server module in this process can read it", () => {
    const token = createPrintJob(resume, "modern");
    const store = (globalThis as typeof globalThis & { __optiPrintJobs?: Map<string, { templateId: string }> })
      .__optiPrintJobs;

    expect(store?.get(token)?.templateId).toBe("modern");
    expect(readPrintJob(token)).toEqual({ resume, templateId: "modern" });
    deletePrintJob(token);
  });

  it("forgets a token after it is deleted", () => {
    const token = createPrintJob(resume, "minimal");
    deletePrintJob(token);

    expect(readPrintJob(token)).toBeUndefined();
  });

  it("forgets a token after 30 seconds", () => {
    vi.useFakeTimers();
    const token = createPrintJob(resume, "minimal");
    vi.advanceTimersByTime(30_001);

    expect(readPrintJob(token)).toBeUndefined();
  });
});
