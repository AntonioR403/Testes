import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { parseBody } from "@/lib/validation";
import { budgetSchema } from "@/lib/schemas";
import { requireUserId } from "@/lib/require-user";
import { errorResponse } from "@/lib/errors";
import { normalizeBudgetMonth } from "@/lib/date";

const querySchema = z.object({
  month: z.string().datetime().optional(),
});

export async function GET(request: Request) {
  const userId = await requireUserId();
  if (!userId) return errorResponse(401, "UNAUTHORIZED", "Not authenticated");

  const url = new URL(request.url);
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  if (!parsed.success) return errorResponse(400, "VALIDATION_ERROR", "Invalid query", parsed.error.flatten());

  const where = {
    userId,
    ...(parsed.data.month ? { month: normalizeBudgetMonth(parsed.data.month) } : {}),
  };

  const budgets = await prisma.budget.findMany({ where, include: { category: true } });
  return Response.json({ data: budgets });
}

export async function POST(request: Request) {
  const userId = await requireUserId();
  if (!userId) return errorResponse(401, "UNAUTHORIZED", "Not authenticated");

  const parsed = await parseBody(budgetSchema, request);
  if (parsed.error) return parsed.error;

  const month = normalizeBudgetMonth(parsed.data.month);
  const category = await prisma.category.findFirst({ where: { id: parsed.data.categoryId, userId } });
  if (!category) return errorResponse(404, "CATEGORY_NOT_FOUND", "Category not found");

  const budget = await prisma.budget.create({
    data: {
      userId,
      categoryId: parsed.data.categoryId,
      amount: parsed.data.amount,
      month,
    },
  });

  return Response.json({ data: budget }, { status: 201 });
}
