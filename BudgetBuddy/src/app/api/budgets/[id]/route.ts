import { prisma } from "@/lib/prisma";
import { parseBody } from "@/lib/validation";
import { budgetSchema } from "@/lib/schemas";
import { requireUserId } from "@/lib/require-user";
import { errorResponse } from "@/lib/errors";
import { normalizeBudgetMonth } from "@/lib/date";

async function ownedBudget(id: string, userId: string) {
  return prisma.budget.findFirst({ where: { id, userId } });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await requireUserId();
  if (!userId) return errorResponse(401, "UNAUTHORIZED", "Not authenticated");
  const { id } = await params;

  if (!(await ownedBudget(id, userId))) return errorResponse(404, "NOT_FOUND", "Budget not found");

  const parsed = await parseBody(budgetSchema, request);
  if (parsed.error) return parsed.error;

  const updated = await prisma.budget.update({
    where: { id },
    data: {
      amount: parsed.data.amount,
      categoryId: parsed.data.categoryId,
      month: normalizeBudgetMonth(parsed.data.month),
    },
  });

  return Response.json({ data: updated });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await requireUserId();
  if (!userId) return errorResponse(401, "UNAUTHORIZED", "Not authenticated");
  const { id } = await params;

  if (!(await ownedBudget(id, userId))) return errorResponse(404, "NOT_FOUND", "Budget not found");

  await prisma.budget.delete({ where: { id } });
  return Response.json({ data: { success: true } });
}
