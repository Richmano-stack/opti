import { beforeEach, describe, expect, it, vi } from "vitest";

import { OpenRouterServiceError } from "../../services/ai/errors";

const { optimizeResume } = vi.hoisted(() => ({ optimizeResume: vi.fn() }));

vi.mock("../../services/ai/optimizeResume", () => ({ optimizeResume }));

import { generateResume, submitGuestResume } from "./generate-resume";

const validInput = {
  resume: "Product designer with five years of experience. taylor@example.com +1 415 555 0192 https://linkedin.com/in/taylor-doe https://taylordoe.dev",
  jobDescription: "Seeking a product designer for a SaaS platform.",
};

const generatedResume = {
  contact: { name: "Taylor Doe" },
  summary: "Product designer with SaaS experience.",
  skills: ["Product design"],
  experience: [
    {
      company: "Example Co",
      title: "Product Designer",
      dates: "2021–Present",
      bullets: ["Designed SaaS product experiences."],
    },
  ],
  education: [{ institution: "Example University", degree: "BFA" }],
};

describe("generateResume", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns the validated generated resume", async () => {
    optimizeResume.mockResolvedValue(generatedResume);

    await expect(generateResume(validInput)).resolves.toEqual({
      ok: true,
      data: generatedResume,
    });
    expect(optimizeResume).toHaveBeenCalledWith(validInput);
  });

  it("rejects invalid input without calling the provider", async () => {
    const result = await generateResume({ resume: "", jobDescription: "" });

    expect(result).toEqual({
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: "Add your résumé and the job description to continue.",
      },
    });
    expect(optimizeResume).not.toHaveBeenCalled();
  });

  it("maps provider failures to safe actionable errors", async () => {
    optimizeResume.mockRejectedValue(
      new OpenRouterServiceError(
        "OPENROUTER_RATE_LIMITED",
        "private upstream details",
      ),
    );

    await expect(generateResume(validInput)).resolves.toEqual({
      ok: false,
      error: {
        code: "RATE_LIMITED",
        message: "The résumé service is busy. Please try again shortly.",
      },
    });
  });
  it("maps exhausted provider credits to a safe configuration error", async () => {
    optimizeResume.mockRejectedValue(
      new OpenRouterServiceError(
        "OPENROUTER_CREDITS_EXHAUSTED",
        "private upstream details",
      ),
    );

    await expect(generateResume(validInput)).resolves.toEqual({
      ok: false,
      error: {
        code: "CONFIGURATION_ERROR",
        message: "Résumé generation needs provider credits or a free model.",
      },
    });
  });
});

describe("submitGuestResume", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns a preview-ready resume from form data", async () => {
    optimizeResume.mockResolvedValue(generatedResume);
    const formData = new FormData();
    formData.set("resume", validInput.resume);
    formData.set("jobDescription", validInput.jobDescription);

    await expect(
      submitGuestResume({ status: "idle" }, formData),
    ).resolves.toEqual({ status: "success", data: generatedResume });
  });

  it("returns a retryable validation error without calling the provider", async () => {
    const formData = new FormData();

    await expect(
      submitGuestResume({ status: "idle" }, formData),
    ).resolves.toEqual({
      status: "error",
      error: {
        code: "INVALID_INPUT",
        message: "Add your résumé and the job description to continue.",
      },
    });
    expect(optimizeResume).not.toHaveBeenCalled();
  });
});