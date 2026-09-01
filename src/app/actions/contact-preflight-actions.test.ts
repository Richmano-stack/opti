import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  findMasterResumeByUserId,
  generateResume,
  getServerSession,
  optimizeResume,
  upsertMasterResume,
} = vi.hoisted(() => ({
  findMasterResumeByUserId: vi.fn(),
  generateResume: vi.fn(),
  getServerSession: vi.fn(),
  optimizeResume: vi.fn(),
  upsertMasterResume: vi.fn(),
}));

vi.mock("@/server/auth/session", () => ({ getServerSession }));
vi.mock("@/services/master-resume", () => ({
  findMasterResumeByUserId,
  upsertMasterResume,
}));
vi.mock("../../services/ai/optimizeResume", () => ({ optimizeResume }));
vi.mock("./generate-resume", async (importOriginal) => {
  const original = await importOriginal<typeof import("./generate-resume")>();
  return { ...original, generateResume };
});

import { submitAccountResume } from "./generate-account-resume";
import { submitGuestResume } from "./generate-resume";

const user = { id: "user-123", email: "user@example.com", name: "Test User" };
const generatedResume = {
  contact: { name: "Test User" },
  summary: "Software engineer.",
  skills: ["TypeScript"],
  experience: [
    {
      company: "Example Co",
      title: "Engineer",
      dates: "2022-Present",
      bullets: ["Built web applications."],
    },
  ],
  education: [{ institution: "Example University", degree: "BSc" }],
};

describe("contact preflight Server Actions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("does not call OpenRouter before a guest reviews missing information", async () => {
    const formData = new FormData();
    formData.set("resume", "Taylor Doe\ntaylor@example.com\nProduct designer");
    formData.set("jobDescription", "Seeking a product designer.");

    await expect(submitGuestResume({ status: "idle" }, formData)).resolves.toEqual({
      status: "missing_contact_info",
      missingFields: ["phone", "linkedin", "portfolio"],
    });
    expect(optimizeResume).not.toHaveBeenCalled();
  });

  it("calls OpenRouter after a guest explicitly continues", async () => {
    optimizeResume.mockResolvedValue(generatedResume);
    const formData = new FormData();
    formData.set("resume", "Taylor Doe\ntaylor@example.com\nProduct designer");
    formData.set("jobDescription", "Seeking a product designer.");
    formData.set("reviewedContactFields", "phone,linkedin,portfolio");
    formData.set("contactDecision", "continue");

    await expect(submitGuestResume({ status: "idle" }, formData)).resolves.toEqual({
      status: "success",
      data: generatedResume,
    });
    expect(optimizeResume).toHaveBeenCalledOnce();
  });

  it("does not generate from an incomplete saved resume before review", async () => {
    getServerSession.mockResolvedValue({ user });
    findMasterResumeByUserId.mockResolvedValue({
      userId: user.id,
      content: "Test User\nuser@example.com\nSoftware engineer",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const formData = new FormData();
    formData.set("jobDescription", "Target job description");

    await expect(submitAccountResume({ status: "idle" }, formData)).resolves.toEqual({
      status: "missing_contact_info",
      missingFields: ["phone", "linkedin", "portfolio"],
    });
    expect(generateResume).not.toHaveBeenCalled();
  });

  it("saves reviewed account details only when requested, then generates", async () => {
    const masterResume = {
      userId: user.id,
      content: "Test User\nuser@example.com\nSoftware engineer",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    getServerSession.mockResolvedValue({ user });
    findMasterResumeByUserId.mockResolvedValue(masterResume);
    upsertMasterResume.mockResolvedValue(masterResume);
    generateResume.mockResolvedValue({ ok: true, data: generatedResume });
    const formData = new FormData();
    formData.set("jobDescription", "Target job description");
    formData.set("reviewedContactFields", "phone,linkedin,portfolio");
    formData.set("contactDecision", "add");
    formData.set("contact_phone", "+1 415 555 0192");
    formData.set("contact_linkedin", "https://linkedin.com/in/test-user");
    formData.set("contact_portfolio", "https://testuser.dev");
    formData.set("saveContactInfo", "on");

    await expect(submitAccountResume({ status: "idle" }, formData)).resolves.toEqual({
      status: "success",
      data: generatedResume,
    });
    expect(upsertMasterResume).toHaveBeenCalledWith(
      user.id,
      expect.stringContaining("Phone: +1 415 555 0192"),
    );
    expect(generateResume).toHaveBeenCalledWith({
      resume: expect.stringContaining("LinkedIn: https://linkedin.com/in/test-user"),
      jobDescription: "Target job description",
    });
  });
});
