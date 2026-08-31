import { mkdir } from "node:fs/promises";
import path from "node:path";

import { renderToFile } from "@react-pdf/renderer";

import { createResumePdfDocument } from "../src/components/pdf/resume-pdf-document";
import type { OptimizedResume } from "../src/services/ai/types";

const sparseResume: OptimizedResume = {
  contact: {
    name: "Alex Example",
    email: undefined,
    phone: undefined,
    location: undefined,
  },
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
  education: [
    {
      institution: "Example University",
      degree: "BSc Computer Science",
      dates: undefined,
    },
  ],
};

const longResume: OptimizedResume = {
  ...sparseResume,
  contact: {
    name: "Morgan Example",
    email: "morgan@example.invalid",
    phone: "+1 555 0100",
    location: "Example City",
  },
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

async function main() {
  const outputDirectory = path.join(process.cwd(), "output", "pdf");
  await mkdir(outputDirectory, { recursive: true });

  await Promise.all([
    renderToFile(
      createResumePdfDocument(sparseResume),
      path.join(outputDirectory, "opti-resume-sparse.pdf"),
    ),
    renderToFile(
      createResumePdfDocument(longResume),
      path.join(outputDirectory, "opti-resume-long.pdf"),
    ),
  ]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
