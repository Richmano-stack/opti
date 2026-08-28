import { headers } from "next/headers";

import { auth } from "@/server/auth/auth";
import type { AuthSession, AuthUser } from "@/server/auth/types";

export function toAuthUser(user: {
  id: string;
  email: string;
  name?: string | null;
}): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? null,
  };
}

export async function getSessionFromHeaders(
  requestHeaders: Headers
): Promise<AuthSession | null> {
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session?.user) {
    return null;
  }

  return { user: toAuthUser(session.user) };
}

export async function getServerSession(): Promise<AuthSession | null> {
  return getSessionFromHeaders(await headers());
}