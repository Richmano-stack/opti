import assert from "node:assert/strict";
import { describe, it } from "vitest";

import { optimizedResumeSchema } from "./types";

const minimalValidResume = {
  contact: { name: "Jane Doe" },
  summary: "Experienced software engineer.",
  skills: ["TypeScript"],
  experience: [
    {
      company: "Example Co",
      title: "Software Engineer",
      dates: "2022–Present",
      bullets: ["Built reliable services."],
    },
  ],
  education: [
    {
      institution: "Example University",
      degree: "BSc Computer Science",
    },
  ],
};

describe("optimizedResumeSchema limits", () => {
  it("rejects non-object model output", () => {
    assert.equal(optimizedResumeSchema.safeParse("not structured JSON").success, false);
    assert.equal(optimizedResumeSchema.safeParse(null).success, false);
  });

  it("rejects text and collection values beyond the renderer limits", () => {
    assert.equal(
      optimizedResumeSchema.safeParse({
        ...minimalValidResume,
        summary: "s".repeat(2_001),
      }).success,
      false,
    );

    assert.equal(
      optimizedResumeSchema.safeParse({
        ...minimalValidResume,
        skills: Array.from({ length: 51 }, (_, index) => `Skill ${index}`),
      }).success,
      false,
    );

    assert.equal(
      optimizedResumeSchema.safeParse({
        ...minimalValidResume,
        experience: [
          {
            ...minimalValidResume.experience[0],
            bullets: ["b".repeat(501)],
          },
        ],
      }).success,
      false,
    );
  });
});
