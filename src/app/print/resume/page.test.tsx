import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

import PrintResumePage from "@/app/print/resume/page";
import { createPrintJob, deletePrintJob } from "@/features/tailoring/pdf/print-job";
import type { OptimizedResume } from "@/features/tailoring/lib/types";

const resume: OptimizedResume = {
  contact: {
    name: "Ada Lovelace",
    email: "ada@example.com",
    phone: undefined,
    location: undefined,
  },
  summary: "Wrote the first published algorithm.",
  skills: ["Mathematics", "Analysis"],
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

describe("PrintResumePage", () => {
  it("renders the stored template and no studio chrome", async () => {
    const token = createPrintJob(resume, "minimal");

    const html = renderToStaticMarkup(
      await PrintResumePage({ searchParams: Promise.resolve({ token }) }),
    );

    expect(html).toContain("Ada Lovelace");
    expect(html).toContain("Mathematics, Analysis");
    expect(html).not.toContain("Template");
    deletePrintJob(token);
  });

  it("does not render a résumé when the token is missing", async () => {
    await expect(PrintResumePage({ searchParams: Promise.resolve({}) })).rejects.toThrow(
      "NEXT_NOT_FOUND",
    );
  });

  it("does not render a résumé when the token is unknown", async () => {
    await expect(
      PrintResumePage({ searchParams: Promise.resolve({ token: "missing-token" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
