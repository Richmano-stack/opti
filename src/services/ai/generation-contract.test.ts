import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  MAX_JOB_DESCRIPTION_LENGTH,
  MAX_RESUME_LENGTH,
  generationInputSchema,
  optimizedResumeSchema,
} from "./types";

const validResume = {
  contact: {
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "+1 555 0100",
    location: "Nairobi, Kenya",
  },
  summary: "Backend engineer focused on reliable distributed systems.",
  skills: ["TypeScript", "PostgreSQL"],
  experience: [
    {
      company: "Example Co",
      title: "Software Engineer",
      dates: "2022–Present",
      bullets: ["Reduced API latency by 35% using measured query improvements."],
    },
  ],
  education: [
    {
      institution: "Example University",
      degree: "BSc Computer Science",
      dates: "2018–2022",
    },
  ],
};

describe("generationInputSchema", () => {
  it("trims valid pasted text", () => {
    const result = generationInputSchema.parse({
      resume: "  Senior engineer with five years of experience.  ",
      jobDescription: "  Build and maintain TypeScript services.  ",
    });

    assert.deepEqual(result, {
      resume: "Senior engineer with five years of experience.",
      jobDescription: "Build and maintain TypeScript services.",
    });
  });

  it("rejects blank resume text", () => {
    assert.equal(
      generationInputSchema.safeParse({
        resume: "   ",
        jobDescription: "Build TypeScript services.",
      }).success,
      false,
    );
  });

  it("rejects blank job-description text", () => {
    assert.equal(
      generationInputSchema.safeParse({
        resume: "Senior engineer.",
        jobDescription: "\n\t",
      }).success,
      false,
    );
  });

  it("rejects input beyond the documented limits", () => {
    assert.equal(
      generationInputSchema.safeParse({
        resume: "r".repeat(MAX_RESUME_LENGTH + 1),
        jobDescription: "Valid job description",
      }).success,
      false,
    );
    assert.equal(
      generationInputSchema.safeParse({
        resume: "Valid resume",
        jobDescription: "j".repeat(MAX_JOB_DESCRIPTION_LENGTH + 1),
      }).success,
      false,
    );
  });
});

describe("optimizedResumeSchema", () => {
  it("accepts the complete renderer contract", () => {
    assert.deepEqual(optimizedResumeSchema.parse(validResume), validResume);
  });

  it("normalizes nullable optional fields to undefined", () => {
    const result = optimizedResumeSchema.parse({
      ...validResume,
      contact: {
        name: "Jane Doe",
        email: null,
        phone: null,
        location: null,
      },
      education: [
        {
          institution: "Example University",
          degree: "BSc Computer Science",
          dates: null,
        },
      ],
    });

    assert.equal(result.contact.email, undefined);
    assert.equal(result.contact.phone, undefined);
    assert.equal(result.contact.location, undefined);
    assert.equal(result.education[0]?.dates, undefined);
  });

  it("rejects structurally incomplete model output", () => {
    assert.equal(
      optimizedResumeSchema.safeParse({
        contact: { name: "Jane Doe" },
        summary: "Experienced engineer.",
        skills: ["TypeScript"],
        experience: [],
        education: validResume.education,
      }).success,
      false,
    );
  });

  it("rejects empty nested values and unsupported fields", () => {
    assert.equal(
      optimizedResumeSchema.safeParse({
        ...validResume,
        skills: [""],
      }).success,
      false,
    );
    assert.equal(
      optimizedResumeSchema.safeParse({
        ...validResume,
        rankingScore: 98,
      }).success,
      false,
    );
  });
});
