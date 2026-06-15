import { TRPCError, initTRPC } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { and, eq } from "drizzle-orm";
import superjson from "superjson";

import { db, member } from "@/db";
import { getSessionFromHeaders } from "@/server/auth/session";
import type { AuthUser } from "@/server/auth/types";

export type Context = {
  user: AuthUser | null;
  activeOrganizationId: string | null;
};

export async function createContext({
  req,
}: FetchCreateContextFnOptions): Promise<Context> {
  const session = await getSessionFromHeaders(req.headers);
  return {
    user: session?.user ?? null,
    activeOrganizationId: session?.activeOrganizationId ?? null,
  };
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const organizationProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const organizationId = ctx.activeOrganizationId;

  if (!organizationId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "No active organization selected",
    });
  }

  const membership = await db.query.member.findFirst({
    where: and(eq(member.userId, ctx.user.id), eq(member.organizationId, organizationId)),
    columns: { id: true },
  });

  if (!membership) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You are not a member of the active organization",
    });
  }

  return next({
    ctx: {
      ...ctx,
      organizationId,
    },
  });
});
