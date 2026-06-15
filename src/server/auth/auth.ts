import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { magicLink, organization } from "better-auth/plugins";

import { db } from "@/db/client";
import * as schema from "@/db/schema";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is not set`);
  }
  return value;
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
      user: schema.users,
      organization: schema.organization,
      member: schema.member,
      invitation: schema.invitation,
    },
  }),
  baseURL: requireEnv("BETTER_AUTH_URL"),
  secret: requireEnv("BETTER_AUTH_SECRET"),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    organization(),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        // Dev transport: log magic link to server console. Replace with Resend/Nodemailer in production.
        console.info(`[auth] Magic link for ${email}:\n${url}`);
      },
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
