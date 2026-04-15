import { prisma } from "@/lib/prisma";
import { parseBody } from "@/lib/validation";
import { transactionSchema } from "@/lib/schemas";
import { requireUserId } from "@/lib/require-user";
import { errorResponse } from "@/lib/errors";

async function ownedTx(id: string, userId: string) {
  return prisma.transaction.findFirst({ where: { id, userId } });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await requireUserId();
  if (!userId) return errorResponse(401, "UNAUTHORIZED", "Not authenticated");
  const { id } = await params;

  if (!(await ownedTx(id, userId))) return errorResponse(404, "NOT_FOUND", "Transaction not found");

  const parsed = await parseBody(transactionSchema, request);
  if (parsed.error) return parsed.error;

  const category = await prisma.category.findFirst({ where: { id: parsed.data.categoryId, userId } });
  if (!category) return errorResponse(404, "CATEGORY_NOT_FOUND", "Category not found");

  const updated = await prisma.transaction.update({
    where: { id },
    data: { ...parsed.data, txDate: new Date(parsed.data.txDate) },
  });

  return Response.json({ data: updated });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await requireUserId();
  if (!userId) return errorResponse(401, "UNAUTHORIZED", "Not authenticated");
  const { id } = await params;

  if (!(await ownedTx(id, userId))) return errorResponse(404, "NOT_FOUND", "Transaction not found");

  await prisma.transaction.delete({ where: { id } });
  return Response.json({ data: { success: true } });
}
