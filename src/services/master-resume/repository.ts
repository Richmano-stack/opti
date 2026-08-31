import { eq } from "drizzle-orm";

import { db as defaultDb, masterResumes, type MasterResume } from "@/db";

import { MasterResumeError } from "./errors";

export const MASTER_RESUME_MAX_LENGTH = 50_000;

// Minimal DB interface  allows injection in tests without coupling to Drizzle internals
export type MasterResumeDb = {
  select: () => {
    from: (table: unknown) => {
      where: (condition: unknown) => Promise<MasterResume[]>;
    };
  };
  insert: (table: unknown) => {
    values: (values: unknown) => {
      onConflictDoUpdate: (opts: unknown) => {
        returning: () => Promise<MasterResume[]>;
      };
    };
  };
};

function validateContent(content: string): string {
  if (content.length > MASTER_RESUME_MAX_LENGTH) {
    throw new MasterResumeError(
      "CONTENT_TOO_LONG",
      `Master resume must be ${MASTER_RESUME_MAX_LENGTH.toLocaleString()} characters or fewer.`,
    );
  }
  const trimmed = content.trim();
  if (trimmed.length === 0) {
    throw new MasterResumeError("CONTENT_EMPTY", "Master resume content cannot be empty.");
  }
  return trimmed;
}

export async function findMasterResumeByUserId(
  userId: string,
  db: MasterResumeDb = defaultDb as unknown as MasterResumeDb,
): Promise<MasterResume | null> {
  const rows = await db
    .select()
    .from(masterResumes)
    .where(eq(masterResumes.userId, userId));
  return rows[0] ?? null;
}

export async function upsertMasterResume(
  userId: string,
  content: string,
  db: MasterResumeDb = defaultDb as unknown as MasterResumeDb,
): Promise<MasterResume> {
  const validated = validateContent(content);

  const rows = await db
    .insert(masterResumes)
    .values({ userId, content: validated })
    .onConflictDoUpdate({
      target: masterResumes.userId,
      set: { content: validated, updatedAt: new Date() },
    })
    .returning();

  return rows[0]!;
}
