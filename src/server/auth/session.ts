import { headers } from "next/headers";

import { auth } from "@/server/auth/auth";
import type { AuthUser } from "@/server/auth/types";

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
): Promise<{ user: AuthUser } | null> {
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session?.user) {
    return null;
  }

  return { user: toAuthUser(session.user) };
}

export async function getServerSession(): Promise<{ user: AuthUser } | null> {
  return getSessionFromHeaders(await headers());
}
