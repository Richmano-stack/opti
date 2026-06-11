import { TRPCError } from "@trpc/server";
import { count, eq } from "drizzle-orm";
import { z } from "zod";

import { db, resumes } from "@/db";

import { protectedProcedure, router } from "../trpc";

/** Task 3.A context contract — local until trpc.ts exports typed Context. */
type AuthUser = { id: string; email: string; name: string | null };

function getAuthenticatedUser(ctx: unknown): AuthUser {
  const { user } = ctx as { user?: AuthUser | null };

  if (!user?.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  return user;
}

const usageStatsOutputSchema = z.object({
  totalOptimizations: z.number().int().nonnegative(),
});

export type UsageStatsOutput = z.infer<typeof usageStatsOutputSchema>;

export const usageRouter = router({
  getStats: protectedProcedure
    .output(usageStatsOutputSchema)
    .query(async ({ ctx }): Promise<UsageStatsOutput> => {
      const user = getAuthenticatedUser(ctx);

      const [result] = await db
        .select({ total: count() })
        .from(resumes)
        .where(eq(resumes.userId, user.id));

      return {
        totalOptimizations: Number(result?.total ?? 0),
      };
    }),
});
