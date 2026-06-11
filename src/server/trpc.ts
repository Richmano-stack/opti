import { initTRPC, TRPCError } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import superjson from "superjson";

import { getSessionFromHeaders } from "@/server/auth/session";
import type { AuthUser } from "@/server/auth/types";

export type Context = {
  user: AuthUser | null;
};

export async function createContext({
  req,
}: FetchCreateContextFnOptions): Promise<Context> {
  const session = await getSessionFromHeaders(req.headers);
  return { user: session?.user ?? null };
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
