import { renderToBuffer } from "@react-pdf/renderer";
import { describe, expect, it } from "vitest";

import { buildResumePdfFilename } from "./build-resume-filename";
import { createResumePdfDocument } from "./resume-pdf-document";
import type { OptimizedResume } from "@/features/tailoring/lib/types";

const sparseResume: OptimizedResume = {
  contact: { name: "Alex Example", email: undefined, phone: undefined, location: undefined },
  summary: "Frontend engineer focused on accessible product interfaces.",
  skills: ["TypeScript", "React"],
  experience: [
    {
      company: "Example Company",
      title: "Frontend Engineer",
      dates: "2022 - Present",
      bullets: ["Built accessible interfaces with React and TypeScript."],
    },
  ],
  education: [{ institution: "Example University", degree: "BSc Computer Science", dates: undefined }],
};

const longResume: OptimizedResume = {
  ...sparseResume,
  summary: "Product engineer delivering reliable customer experiences. ".repeat(18).trim(),
  skills: Array.from({ length: 30 }, (_, index) => `Skill ${index + 1}`),
  experience: Array.from({ length: 12 }, (_, index) => ({
    company: `Example Company ${index + 1}`,
    title: "Senior Product Engineer",
    dates: `${2010 + index} - ${2011 + index}`,
    bullets: Array.from(
      { length: 6 },
      (_, bulletIndex) =>
        `Delivered measurable product improvement ${bulletIndex + 1} through accessible implementation, automated testing, and cross-functional collaboration.`,
    ),
  })),
};

const documentedResume: OptimizedResume = {
  ...sparseResume,
  headline: "Customer Operations Leader",
  matchNote: { strengths: "Supervision.", gaps: "No right to work stated." },
  certifications: [{ name: "AWS Cloud Practitioner", issuer: "Amazon", dates: "2024" }],
  projects: [{ name: "Billing API", dates: "2023", bullets: ["Shipped invoice exports."] }],
};

describe("resume PDF", () => {
  it.each([
    ["sparse", sparseResume],
    ["long", longResume],
    ["documented", documentedResume],
  ])("renders a valid %s resume PDF", async (_name, resume) => {
    const buffer = await renderToBuffer(createResumePdfDocument(resume));

    expect(buffer.subarray(0, 5).toString()).toBe("%PDF-");
    expect(buffer.byteLength).toBeGreaterThan(2_000);
  }, 15_000);

  it("builds a safe download filename", () => {
    expect(
      buildResumePdfFilename({
        ...sparseResume,
        contact: { name: "../../Alex <Example>", email: undefined, phone: undefined, location: undefined },
      }),
    ).toBe("Alex_Example_Resume.pdf");
  });
});
