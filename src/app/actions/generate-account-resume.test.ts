import { beforeEach, describe, expect, it, vi } from "vitest";

const { findMasterResumeByUserId, generateResume, getServerSession } = vi.hoisted(() => ({
  findMasterResumeByUserId: vi.fn(),
  generateResume: vi.fn(),
  getServerSession: vi.fn(),
}));

vi.mock("@/server/auth/session", () => ({ getServerSession }));
vi.mock("@/services/master-resume", () => ({ findMasterResumeByUserId }));
vi.mock("./generate-resume", () => ({ generateResume }));

import {
  generateAccountResume,
  submitAccountResume,
} from "./generate-account-resume";

const user = { id: "user-123", email: "user@example.com", name: "Test User" };
const masterResume = {
  userId: user.id,
  content: "Saved master resume content user@example.com +1 415 555 0192 https://linkedin.com/in/test-user https://testuser.dev",
  createdAt: new Date("2026-01-01T00:00:00Z"),
  updatedAt: new Date("2026-01-01T00:00:00Z"),
};

describe("generateAccountResume", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects unauthenticated generation before loading a resume", async () => {
    getServerSession.mockResolvedValue(null);

    await expect(generateAccountResume("Job description")).resolves.toEqual({
      ok: false,
      error: { code: "UNAUTHORIZED", message: "Sign in to tailor your saved resume." },
    });
    expect(findMasterResumeByUserId).not.toHaveBeenCalled();
    expect(generateResume).not.toHaveBeenCalled();
  });

  it("requires the authenticated user to have a saved master resume", async () => {
    getServerSession.mockResolvedValue({ user });
    findMasterResumeByUserId.mockResolvedValue(null);

    await expect(generateAccountResume("Job description")).resolves.toEqual({
      ok: false,
      error: {
        code: "MASTER_RESUME_REQUIRED",
        message: "Save your master resume before tailoring it for a role.",
      },
    });
    expect(findMasterResumeByUserId).toHaveBeenCalledWith(user.id);
    expect(generateResume).not.toHaveBeenCalled();
  });

  it("generates only from the authenticated user's saved resume", async () => {
    const result = { ok: true, data: { contact: { name: "Test User" } } };
    getServerSession.mockResolvedValue({ user });
    findMasterResumeByUserId.mockResolvedValue(masterResume);
    generateResume.mockResolvedValue(result);

    await expect(generateAccountResume("Target job description")).resolves.toBe(result);
    expect(findMasterResumeByUserId).toHaveBeenCalledWith(user.id);
    expect(generateResume).toHaveBeenCalledWith({
      resume: masterResume.content,
      jobDescription: "Target job description",
    });
  });

  it("returns a safe error when the saved resume cannot be loaded", async () => {
    getServerSession.mockResolvedValue({ user });
    findMasterResumeByUserId.mockRejectedValue(new Error("database details"));

    await expect(generateAccountResume("Job description")).resolves.toEqual({
      ok: false,
      error: {
        code: "SERVICE_UNAVAILABLE",
        message: "Your saved resume could not be loaded. Please try again.",
      },
    });
  });
});
describe("submitAccountResume", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns the generated resume as account form state", async () => {
    const generated = { contact: { name: "Test User" } };
    getServerSession.mockResolvedValue({ user });
    findMasterResumeByUserId.mockResolvedValue(masterResume);
    generateResume.mockResolvedValue({ ok: true, data: generated });
    const formData = new FormData();
    formData.set("jobDescription", "Target job description");

    await expect(
      submitAccountResume({ status: "idle" }, formData),
    ).resolves.toEqual({ status: "success", data: generated });
  });

  it("returns generation failures as account form state", async () => {
    getServerSession.mockResolvedValue({ user });
    findMasterResumeByUserId.mockResolvedValue(null);
    const formData = new FormData();
    formData.set("jobDescription", "Target job description");

    await expect(
      submitAccountResume({ status: "idle" }, formData),
    ).resolves.toEqual({
      status: "error",
      error: {
        code: "MASTER_RESUME_REQUIRED",
        message: "Save your master resume before tailoring it for a role.",
      },
    });
  });
});