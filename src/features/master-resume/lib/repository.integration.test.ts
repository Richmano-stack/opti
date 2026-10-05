import { randomUUID } from "node:crypto";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import * as schema from "@/db/schema";

import {
  findMasterResumeByUserId,
  upsertMasterResume,
  type MasterResumeDb,
} from "./repository";

const connectionString = process.env.DATABASE_URL;
const describeWithDatabase = connectionString ? describe : describe.skip;

describeWithDatabase("master resume PostgreSQL integration", () => {
  const firstUserId = `integration-${randomUUID()}`;
  const secondUserId = `integration-${randomUUID()}`;
  let sql: ReturnType<typeof postgres>;
  let database: MasterResumeDb;

  beforeAll(async () => {
    sql = postgres(connectionString!, { prepare: false });
    database = drizzle(sql, { schema }) as unknown as MasterResumeDb;
    await sql`
      insert into users (id, email, name, email_verified)
      values
        (${firstUserId}, ${`${firstUserId}@example.test`}, 'Integration One', true),
        (${secondUserId}, ${`${secondUserId}@example.test`}, 'Integration Two', true)
    `;
  });

  beforeEach(async () => {
    await sql`delete from master_resumes where user_id in (${firstUserId}, ${secondUserId})`;
  });

  afterAll(async () => {
    await sql`delete from users where id in (${firstUserId}, ${secondUserId})`;
    await sql.end();
  });

  it("creates, reloads, and updates one resume for a user", async () => {
    const created = await upsertMasterResume(firstUserId, "First version", database);

    expect(created).toMatchObject({ userId: firstUserId, content: "First version" });
    await expect(findMasterResumeByUserId(firstUserId, database)).resolves.toMatchObject({
      userId: firstUserId,
      content: "First version",
    });

    const updated = await upsertMasterResume(firstUserId, "Second version", database);
    const rows = await sql`
      select user_id, content from master_resumes where user_id = ${firstUserId}
    `;

    expect(updated).toMatchObject({ userId: firstUserId, content: "Second version" });
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ user_id: firstUserId, content: "Second version" });
  });

  it("keeps each user's resume isolated", async () => {
    await upsertMasterResume(firstUserId, "First user's private resume", database);
    await upsertMasterResume(secondUserId, "Second user's private resume", database);

    await expect(findMasterResumeByUserId(firstUserId, database)).resolves.toMatchObject({
      userId: firstUserId,
      content: "First user's private resume",
    });
    await expect(findMasterResumeByUserId(secondUserId, database)).resolves.toMatchObject({
      userId: secondUserId,
      content: "Second user's private resume",
    });

    await upsertMasterResume(firstUserId, "First user's updated resume", database);

    await expect(findMasterResumeByUserId(secondUserId, database)).resolves.toMatchObject({
      userId: secondUserId,
      content: "Second user's private resume",
    });
  });
});
