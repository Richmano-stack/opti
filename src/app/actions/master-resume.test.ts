import { beforeEach, describe, expect, it, vi } from "vitest";

const { getServerSession, findMasterResumeByUserId, upsertMasterResume } = vi.hoisted(
  () => ({
    getServerSession: vi.fn(),
    findMasterResumeByUserId: vi.fn(),
    upsertMasterResume: vi.fn(),
  }),
);

vi.mock("@/server/auth/session", () => ({ getServerSession }));
vi.mock("@/services/master-resume", () => {
  class MasterResumeError extends Error {
    constructor(readonly code: string, message: string) {
      super(message);
      this.name = "MasterResumeError";
    }
  }
  return {
    findMasterResumeByUserId,
    upsertMasterResume,
    MasterResumeError,
    MASTER_RESUME_MAX_LENGTH: 50_000,
  };
});

import { getMasterResume, saveMasterResume } from "./master-resume";
import { MasterResumeError } from "@/services/master-resume";

const mockUser = { id: "user-123", email: "test@example.com", name: "Test User" };
const mockResume = {
  userId: "user-123",
  content: "Experienced Full Stack Engineer",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("getMasterResume", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns UNAUTHORIZED when not logged in", async () => {
    getServerSession.mockResolvedValue(null);
    const result = await getMasterResume();

    expect(result).toEqual({
      ok: false,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be signed in to view your master resume.",
      },
    });
    expect(findMasterResumeByUserId).not.toHaveBeenCalled();
  });

  it("returns master resume for logged in user", async () => {
    getServerSession.mockResolvedValue({ user: mockUser });
    findMasterResumeByUserId.mockResolvedValue(mockResume);

    const result = await getMasterResume();
    expect(result).toEqual({ ok: true, data: mockResume });
    expect(findMasterResumeByUserId).toHaveBeenCalledWith("user-123");
  });
});

describe("saveMasterResume", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns UNAUTHORIZED when not logged in", async () => {
    getServerSession.mockResolvedValue(null);
    const result = await saveMasterResume("Sample content");

    expect(result).toEqual({
      ok: false,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be signed in to save your master resume.",
      },
    });
    expect(upsertMasterResume).not.toHaveBeenCalled();
  });

  it("saves master resume successfully", async () => {
    getServerSession.mockResolvedValue({ user: mockUser });
    upsertMasterResume.mockResolvedValue(mockResume);

    const result = await saveMasterResume("Experienced Full Stack Engineer");
    expect(result).toEqual({ ok: true, data: mockResume });
    expect(upsertMasterResume).toHaveBeenCalledWith("user-123", "Experienced Full Stack Engineer");
  });

  it("returns INVALID_INPUT error on validation failure", async () => {
    getServerSession.mockResolvedValue({ user: mockUser });
    upsertMasterResume.mockRejectedValue(
      new MasterResumeError("CONTENT_EMPTY", "Master resume content cannot be empty."),
    );

    const result = await saveMasterResume("   ");
    expect(result).toEqual({
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: "Master resume content cannot be empty.",
      },
    });
  });
});
