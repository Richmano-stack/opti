import { describe, expect, it, vi } from "vitest";

import { assertLocalDatabaseUrl, seedUsers, type SeedUser } from "./dev-user-seed";

describe("assertLocalDatabaseUrl", () => {
  it.each([
    "postgres://opti:opti@localhost:5461/opti",
    "postgres://opti:opti@127.0.0.1:5461/opti",
    "postgres://opti:opti@[::1]:5461/opti",
  ])("accepts loopback database URL %s", (databaseUrl) => {
    expect(() => assertLocalDatabaseUrl(databaseUrl)).not.toThrow();
  });

  it("rejects a remote database URL", () => {
    expect(() => assertLocalDatabaseUrl("postgres://opti:secret@db.example.com/opti"))
      .toThrow('Refusing to seed non-local database host "db.example.com"');
  });
});

describe("seedUsers", () => {
  it("creates only missing users and saves the configured master resume", async () => {
    const users: SeedUser[] = [
      { email: "ready@opti.local", name: "Ready User", password: "password", masterResume: "Resume" },
      { email: "setup@opti.local", name: "Setup User", password: "password" },
    ];
    const createUser = vi.fn(async (user: SeedUser) => ({ id: `created-${user.email}` }));
    const saveMasterResume = vi.fn(async () => undefined);

    const results = await seedUsers(users, {
      findUserByEmail: vi.fn(async (email) =>
        email === "setup@opti.local" ? { id: "existing-setup" } : null,
      ),
      createUser,
      saveMasterResume,
    });

    expect(createUser).toHaveBeenCalledOnce();
    expect(saveMasterResume).toHaveBeenCalledWith("created-ready@opti.local", "Resume");
    expect(results).toEqual([
      { email: "ready@opti.local", created: true, hasMasterResume: true },
      { email: "setup@opti.local", created: false, hasMasterResume: false },
    ]);
  });
});
