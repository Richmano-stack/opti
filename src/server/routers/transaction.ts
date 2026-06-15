import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { categories, db, transactions, users } from "@/db";

import { organizationProcedure, router } from "../trpc";

const createInputSchema = z.object({
  amount: z.string().regex(/^-?\d+(\.\d{1,2})?$/, "Amount must be a valid decimal"),
  description: z.string().trim().min(1).optional(),
  categoryId: z.string().uuid().optional(),
});

const transactionListItemSchema = z.object({
  id: z.string().uuid(),
  amount: z.string(),
  description: z.string().nullable(),
  categoryId: z.string().uuid().nullable(),
  categoryName: z.string().nullable(),
  createdAt: z.date(),
  createdByUserId: z.string(),
  createdByName: z.string().nullable(),
  createdByEmail: z.string(),
});

const categoryListItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.date(),
});

export type TransactionListItem = z.infer<typeof transactionListItemSchema>;
export type CategoryListItem = z.infer<typeof categoryListItemSchema>;

export const transactionRouter = router({
  list: organizationProcedure
    .output(z.array(transactionListItemSchema))
    .query(async ({ ctx }): Promise<TransactionListItem[]> => {
      const rows = await db
        .select({
          id: transactions.id,
          amount: transactions.amount,
          description: transactions.description,
          categoryId: transactions.categoryId,
          categoryName: categories.name,
          createdAt: transactions.createdAt,
          createdByUserId: transactions.createdByUserId,
          createdByName: users.name,
          createdByEmail: users.email,
        })
        .from(transactions)
        .innerJoin(users, eq(transactions.createdByUserId, users.id))
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(eq(transactions.organizationId, ctx.organizationId))
        .orderBy(desc(transactions.createdAt));

      return rows.map((row) => ({
        ...row,
        amount: row.amount,
      }));
    }),

  create: organizationProcedure
    .input(createInputSchema)
    .output(transactionListItemSchema)
    .mutation(async ({ ctx, input }): Promise<TransactionListItem> => {
      if (input.categoryId) {
        const category = await db.query.categories.findFirst({
          where: and(
            eq(categories.id, input.categoryId),
            eq(categories.organizationId, ctx.organizationId)
          ),
          columns: { id: true, name: true },
        });

        if (!category) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Category not found in the active organization",
          });
        }
      }

      const [created] = await db
        .insert(transactions)
        .values({
          organizationId: ctx.organizationId,
          categoryId: input.categoryId ?? null,
          amount: input.amount,
          description: input.description ?? null,
          createdByUserId: ctx.user.id,
        })
        .returning({
          id: transactions.id,
          amount: transactions.amount,
          description: transactions.description,
          categoryId: transactions.categoryId,
          createdAt: transactions.createdAt,
          createdByUserId: transactions.createdByUserId,
        });

      if (!created) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create transaction",
        });
      }

      let categoryName: string | null = null;
      if (created.categoryId) {
        const category = await db.query.categories.findFirst({
          where: eq(categories.id, created.categoryId),
          columns: { name: true },
        });
        categoryName = category?.name ?? null;
      }

      return {
        ...created,
        categoryName,
        createdByName: ctx.user.name,
        createdByEmail: ctx.user.email,
      };
    }),

  listCategories: organizationProcedure
    .output(z.array(categoryListItemSchema))
    .query(async ({ ctx }): Promise<CategoryListItem[]> => {
      return db.query.categories.findMany({
        where: eq(categories.organizationId, ctx.organizationId),
        orderBy: [desc(categories.createdAt)],
        columns: {
          id: true,
          name: true,
          createdAt: true,
        },
      });
    }),

  createCategory: organizationProcedure
    .input(z.object({ name: z.string().trim().min(1) }))
    .output(categoryListItemSchema)
    .mutation(async ({ ctx, input }): Promise<CategoryListItem> => {
      const [created] = await db
        .insert(categories)
        .values({
          organizationId: ctx.organizationId,
          name: input.name,
          createdByUserId: ctx.user.id,
        })
        .returning({
          id: categories.id,
          name: categories.name,
          createdAt: categories.createdAt,
        });

      if (!created) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create category",
        });
      }

      return created;
    }),
});
