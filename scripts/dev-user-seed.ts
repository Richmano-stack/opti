export type SeedUser = {
  email: string;
  name: string;
  password: string;
  masterResume?: string;
};

export type SeedDependencies = {
  findUserByEmail: (email: string) => Promise<{ id: string } | null>;
  createUser: (user: SeedUser) => Promise<{ id: string }>;
  saveMasterResume: (userId: string, content: string) => Promise<void>;
};

export type SeedResult = {
  email: string;
  created: boolean;
  hasMasterResume: boolean;
};

export function assertLocalDatabaseUrl(connectionString: string): void {
  let hostname: string;

  try {
    hostname = new URL(connectionString).hostname;
  } catch {
    throw new Error("DATABASE_URL must be a valid PostgreSQL URL.");
  }

  if (!["localhost", "127.0.0.1", "[::1]", "::1"].includes(hostname)) {
    throw new Error(
      `Refusing to seed non-local database host "${hostname}". Use localhost, 127.0.0.1, or ::1.`,
    );
  }
}

export async function seedUsers(
  seedUsers: readonly SeedUser[],
  dependencies: SeedDependencies,
): Promise<SeedResult[]> {
  const results: SeedResult[] = [];

  for (const seedUser of seedUsers) {
    const existingUser = await dependencies.findUserByEmail(seedUser.email);
    const user = existingUser ?? (await dependencies.createUser(seedUser));

    if (seedUser.masterResume) {
      await dependencies.saveMasterResume(user.id, seedUser.masterResume);
    }

    results.push({
      email: seedUser.email,
      created: existingUser === null,
      hasMasterResume: Boolean(seedUser.masterResume),
    });
  }

  return results;
}
