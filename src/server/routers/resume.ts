import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { db, resumes } from "@/db";
import {
  OpenRouterServiceError,
  InvalidInputError,
  ResumeValidationError,
} from "@/services/ai/errors";
import { optimizeResume } from "@/services/ai/optimizeResume";
import { optimizedResumeSchema } from "@/services/ai/types";

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

function mapAiError(error: unknown): never {
  if (error instanceof InvalidInputError) {
    throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
  }

  if (error instanceof ResumeValidationError || error instanceof OpenRouterServiceError) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
  }

  throw error;
}

const optimizeInputSchema = z.object({
  resume: z.string().min(1, "Resume text is required"),
  jobDescription: z.string().min(1, "Job description is required"),
});

const saveInputSchema = z.object({
  data: optimizedResumeSchema,
  title: z.string().min(1).optional(),
});

const getByIdInputSchema = z.object({
  id: z.string().uuid(),
});

const savedResumeOutputSchema = z.object({
  id: z.string().uuid(),
  title: z.string().nullable(),
  createdAt: z.date(),
  data: optimizedResumeSchema,
});

const resumeListItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const resumeDetailSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  title: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  data: optimizedResumeSchema,
});

export type OptimizeInput = z.infer<typeof optimizeInputSchema>;
export type SaveInput = z.infer<typeof saveInputSchema>;
export type SavedResumeOutput = z.infer<typeof savedResumeOutputSchema>;
export type ResumeListItem = z.infer<typeof resumeListItemSchema>;
export type ResumeDetail = z.infer<typeof resumeDetailSchema>;

export const resumeRouter = router({
  optimize: protectedProcedure
    .input(optimizeInputSchema)
    .output(optimizedResumeSchema)
    .mutation(async ({ input }): Promise<z.infer<typeof optimizedResumeSchema>> => {
      try {
        return await optimizeResume(input);
      } catch (error) {
        mapAiError(error);
      }
    }),

  save: protectedProcedure
    .input(saveInputSchema)
    .output(savedResumeOutputSchema)
    .mutation(async ({ ctx, input }): Promise<SavedResumeOutput> => {
      const user = getAuthenticatedUser(ctx);

      const [saved] = await db
        .insert(resumes)
        .values({
          userId: user.id,
          data: input.data,
          title: input.title ?? null,
        })
        .returning({
          id: resumes.id,
          title: resumes.title,
          createdAt: resumes.createdAt,
          data: resumes.data,
        });

      if (!saved) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save resume",
        });
      }

      return saved;
    }),

  list: protectedProcedure
    .output(z.array(resumeListItemSchema))
    .query(async ({ ctx }): Promise<ResumeListItem[]> => {
      const user = getAuthenticatedUser(ctx);

      return db.query.resumes.findMany({
        where: eq(resumes.userId, user.id),
        orderBy: [desc(resumes.createdAt)],
        columns: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }),

  getById: protectedProcedure
    .input(getByIdInputSchema)
    .output(resumeDetailSchema)
    .query(async ({ ctx, input }): Promise<ResumeDetail> => {
      const user = getAuthenticatedUser(ctx);

      const row = await db.query.resumes.findFirst({
        where: and(eq(resumes.id, input.id), eq(resumes.userId, user.id)),
      });

      if (!row) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Resume not found",
        });
      }

      return row;
    }),
});
