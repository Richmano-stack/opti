import { eq } from "drizzle-orm";

import { db, session, users } from "@/db";
import { auth } from "@/server/auth/auth";
import { upsertMasterResume } from "@/services/master-resume/repository";

import { assertLocalDatabaseUrl, seedUsers, type SeedUser } from "./dev-user-seed";

const READY_PASSWORD = "OptiDemo123!";
const SETUP_PASSWORD = "OptiSetup123!";

const MASTER_RESUME = `Jordan Lee
jordan.lee@example.com | Nairobi, Kenya

PROFESSIONAL SUMMARY
Software engineer with four years of experience building accessible web applications and internal tools using TypeScript, React, Node.js, and PostgreSQL.

SKILLS
TypeScript, JavaScript, React, Next.js, Node.js, REST APIs, PostgreSQL, Git, Vitest, Playwright, Agile/Scrum

EXPERIENCE
Software Engineer | Northstar Labs | March 2022 - Present
- Built and maintained customer-facing React and TypeScript features used by more than 10,000 monthly users.
- Reduced a reporting workflow from 12 minutes to 4 minutes by redesigning the interface and optimizing API requests.
- Created reusable accessible components and added automated tests with Vitest and Playwright.
- Collaborated with product, design, and backend engineers through code reviews and two-week sprints.

Junior Web Developer | Brightworks Studio | June 2020 - February 2022
- Developed responsive websites and internal dashboards with JavaScript, React, HTML, and CSS.
- Integrated REST APIs and PostgreSQL-backed services with senior engineers.
- Improved release reliability by documenting manual checks and adding regression tests.

EDUCATION
Bachelor of Science in Computer Science | Example University | 2020`;

const DEV_USERS: readonly SeedUser[] = [
  {
    email: "demo@opti.local",
    name: "Opti Demo",
    password: READY_PASSWORD,
    masterResume: MASTER_RESUME,
  },
  {
    email: "setup@opti.local",
    name: "Opti Setup",
    password: SETUP_PASSWORD,
  },
];

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL environment variable is not set.");
  assertLocalDatabaseUrl(databaseUrl);

  const results = await seedUsers(DEV_USERS, {
    findUserByEmail: async (email) => {
      const rows = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
      return rows[0] ?? null;
    },
    createUser: async (seedUser) => {
      const result = await auth.api.signUpEmail({
        body: {
          email: seedUser.email,
          name: seedUser.name,
          password: seedUser.password,
          rememberMe: false,
        },
      });

      await db.delete(session).where(eq(session.userId, result.user.id));
      return { id: result.user.id };
    },
    saveMasterResume: async (userId, content) => {
      await upsertMasterResume(userId, content);
    },
  });

  console.info("\nLocal users are ready:\n");
  for (const result of results) {
    const password = result.email === "demo@opti.local" ? READY_PASSWORD : SETUP_PASSWORD;
    const state = result.created ? "created" : "already existed";
    const resume = result.hasMasterResume ? "saved resume" : "empty setup state";
    console.info(`- ${result.email} / ${password} (${state}, ${resume})`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error("Failed to seed local users:", error instanceof Error ? error.message : error);
    process.exit(1);
  });
