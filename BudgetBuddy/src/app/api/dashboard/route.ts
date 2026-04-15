import { z } from "zod";
import { TxType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/require-user";
import { errorResponse } from "@/lib/errors";
import { normalizeBudgetMonth } from "@/lib/date";
import { calculateMonthlyTotals } from "@/lib/summary";

const querySchema = z.object({
  month: z.string().datetime(),
});

export async function GET(request: Request) {
  const userId = await requireUserId();
  if (!userId) return errorResponse(401, "UNAUTHORIZED", "Not authenticated");

  const url = new URL(request.url);
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  if (!parsed.success) return errorResponse(400, "VALIDATION_ERROR", "Invalid query", parsed.error.flatten());

  const month = normalizeBudgetMonth(parsed.data.month);
  const nextMonth = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 1));

  const [transactions, budgets] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        userId,
        txDate: {
          gte: month,
          lt: nextMonth,
        },
      },
      include: { category: true },
    }),
    prisma.budget.findMany({ where: { userId, month }, include: { category: true } }),
  ]);

  const totals = calculateMonthlyTotals(transactions);

  const byCategory = Object.values(
    transactions.reduce<Record<string, { categoryId: string; categoryName: string; amount: number }>>((acc, tx) => {
      const current = acc[tx.categoryId] ?? {
        categoryId: tx.categoryId,
        categoryName: tx.category.name,
        amount: 0,
      };
      if (tx.txType === TxType.expense) current.amount += tx.amount;
      acc[tx.categoryId] = current;
      return acc;
    }, {}),
  );

  const budgetUsage = budgets.map((budget) => {
    const spent = byCategory.find((c) => c.categoryId === budget.categoryId)?.amount ?? 0;
    return {
      budgetId: budget.id,
      categoryId: budget.categoryId,
      categoryName: budget.category.name,
      budgetAmount: budget.amount,
      spent,
      usagePercent: budget.amount === 0 ? 0 : Math.round((spent / budget.amount) * 100),
    };
  });

  return Response.json({
    data: {
      month,
      totals,
      byCategory,
      budgetUsage,
    },
  });
}
