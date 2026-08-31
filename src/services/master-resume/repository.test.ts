import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the entire @/db module so the db singleton never tries to connect
vi.mock("@/db", () => ({
  db: {},
  masterResumes: { userId: "userId_col", content: "content_col" },
}));

// Import after mocks are set up
import type { MasterResume } from "@/db";
import { MasterResumeError } from "./errors";
import {
  findMasterResumeByUserId,
  MASTER_RESUME_MAX_LENGTH,
  upsertMasterResume,
  type MasterResumeDb,
} from "./repository";

beforeEach(() => vi.clearAllMocks());

const now = new Date("2026-01-01T00:00:00Z");

function makeRow(overrides: Partial<MasterResume> = {}): MasterResume {
  return {
    userId: "user-1",
    content: "My resume text",
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function selectDb(rows: MasterResume[]): MasterResumeDb {
  const chain = {
    from: () => chain,
    where: () => Promise.resolve(rows),
  };
  return { select: () => chain, insert: vi.fn() } as unknown as MasterResumeDb;
}

function insertDb(rows: MasterResume[]): MasterResumeDb {
  const chain = {
    values: () => chain,
    onConflictDoUpdate: () => chain,
    returning: () => Promise.resolve(rows),
  };
  return { select: vi.fn(), insert: () => chain } as unknown as MasterResumeDb;
}

describe("findMasterResumeByUserId", () => {
  it("returns null when no row exists", async () => {
    await expect(findMasterResumeByUserId("user-1", selectDb([]))).resolves.toBeNull();
  });

  it("returns the row when one exists", async () => {
    const row = makeRow();
    await expect(findMasterResumeByUserId("user-1", selectDb([row]))).resolves.toEqual(row);
  });
});

describe("upsertMasterResume", () => {
  it("inserts and returns a new row", async () => {
    const row = makeRow({ content: "Hello resume" });
    await expect(upsertMasterResume("user-1", "Hello resume", insertDb([row]))).resolves.toEqual(row);
  });

  it("updates and returns the updated row", async () => {
    const row = makeRow({ content: "Updated resume" });
    await expect(upsertMasterResume("user-1", "Updated resume", insertDb([row]))).resolves.toEqual(row);
  });

  it("throws CONTENT_EMPTY for whitespace-only content", async () => {
    await expect(upsertMasterResume("user-1", "   ", insertDb([]))).rejects.toMatchObject({
      code: "CONTENT_EMPTY",
    });
  });

  it("throws CONTENT_EMPTY for empty string", async () => {
    await expect(upsertMasterResume("user-1", "", insertDb([]))).rejects.toBeInstanceOf(
      MasterResumeError,
    );
    await expect(upsertMasterResume("user-1", "", insertDb([]))).rejects.toMatchObject({
      code: "CONTENT_EMPTY",
    });
  });

  it("throws CONTENT_TOO_LONG for content over the limit", async () => {
    const oversized = "a".repeat(MASTER_RESUME_MAX_LENGTH + 1);
    await expect(upsertMasterResume("user-1", oversized, insertDb([]))).rejects.toMatchObject({
      code: "CONTENT_TOO_LONG",
    });
  });

  it("accepts content exactly at the limit", async () => {
    const content = "a".repeat(MASTER_RESUME_MAX_LENGTH);
    const row = makeRow({ content });
    await expect(upsertMasterResume("user-1", content, insertDb([row]))).resolves.toEqual(row);
  });
});
