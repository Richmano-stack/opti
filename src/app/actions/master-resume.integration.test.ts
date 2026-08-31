import { randomUUID } from "node:crypto";

import postgres from "postgres";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const { getServerSession } = vi.hoisted(() => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/server/auth/session", () => ({ getServerSession }));

import { getMasterResume, saveMasterResume } from "./master-resume";

const connectionString = process.env.DATABASE_URL;
const describeWithDatabase = connectionString ? describe : describe.skip;

describeWithDatabase("master resume action PostgreSQL integration", () => {
  const firstUser = {
    id: `integration-${randomUUID()}`,
    email: `integration-${randomUUID()}@example.test`,
    name: "Integration One",
  };
  const secondUser = {
    id: `integration-${randomUUID()}`,
    email: `integration-${randomUUID()}@example.test`,
    name: "Integration Two",
  };
  let sql: ReturnType<typeof postgres>;

  beforeAll(async () => {
    sql = postgres(connectionString!, { prepare: false });
    await sql`
      insert into users (id, email, name, email_verified)
      values
        (${firstUser.id}, ${firstUser.email}, ${firstUser.name}, true),
        (${secondUser.id}, ${secondUser.email}, ${secondUser.name}, true)
    `;
  });

  beforeEach(async () => {
    vi.clearAllMocks();
    await sql`delete from master_resumes where user_id in (${firstUser.id}, ${secondUser.id})`;
  });

  afterAll(async () => {
    await sql`delete from users where id in (${firstUser.id}, ${secondUser.id})`;
    await sql.end();
  });

  it("creates, reloads, and updates the authenticated user's resume", async () => {
    getServerSession.mockResolvedValue({ user: firstUser });

    await expect(saveMasterResume("First action version")).resolves.toMatchObject({
      ok: true,
      data: { userId: firstUser.id, content: "First action version" },
    });
    await expect(getMasterResume()).resolves.toMatchObject({
      ok: true,
      data: { userId: firstUser.id, content: "First action version" },
    });

    await expect(saveMasterResume("Updated action version")).resolves.toMatchObject({
      ok: true,
      data: { userId: firstUser.id, content: "Updated action version" },
    });

    const rows = await sql`
      select user_id, content from master_resumes where user_id = ${firstUser.id}
    `;
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      user_id: firstUser.id,
      content: "Updated action version",
    });
  });

  it("never reads or overwrites another authenticated user's resume", async () => {
    getServerSession.mockResolvedValue({ user: firstUser });
    await saveMasterResume("First user's private resume");

    getServerSession.mockResolvedValue({ user: secondUser });
    await expect(getMasterResume()).resolves.toEqual({ ok: true, data: null });
    await saveMasterResume("Second user's private resume");

    getServerSession.mockResolvedValue({ user: firstUser });
    await expect(getMasterResume()).resolves.toMatchObject({
      ok: true,
      data: { userId: firstUser.id, content: "First user's private resume" },
    });
  });
});