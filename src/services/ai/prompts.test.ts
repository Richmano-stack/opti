import { describe, expect, it } from "vitest";

import { buildSystemPrompt, buildUserPrompt } from "./prompts";

describe("resume tailoring prompts", () => {
  it("forbids unsupported outcomes, measurements, and boilerplate", () => {
    const prompt = buildSystemPrompt();

    expect(prompt).toContain("Do not infer outcomes, impact, or measurements");
    expect(prompt).toContain("Never write filler such as \"as measured by\"");
    expect(prompt).toContain("Do not add a metric unless that exact metric appears");
  });

  it("asks for concise, non-duplicative bullets grounded in the source", () => {
    const prompt = buildUserPrompt({
      resume: "Built and maintained a React dashboard.",
      jobDescription: "Build accessible React interfaces.",
    });

    expect(prompt).toContain("Every claim must be directly supported by the source resume");
    expect(prompt).toContain("Remove duplicate or substantially overlapping bullets");
  });
});