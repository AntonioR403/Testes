import { prisma } from "@/lib/prisma";
import { parseBody } from "@/lib/validation";
import { categorySchema } from "@/lib/schemas";
import { requireUserId } from "@/lib/require-user";
import { errorResponse } from "@/lib/errors";

async function checkOwnership(id: string, userId: string) {
  return prisma.category.findFirst({ where: { id, userId } });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await requireUserId();
  if (!userId) return errorResponse(401, "UNAUTHORIZED", "Not authenticated");
  const { id } = await params;

  const existing = await checkOwnership(id, userId);
  if (!existing) return errorResponse(404, "NOT_FOUND", "Category not found");

  const parsed = await parseBody(categorySchema, request);
  if (parsed.error) return parsed.error;

  const category = await prisma.category.update({ where: { id }, data: { name: parsed.data.name } });
  return Response.json({ data: category });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await requireUserId();
  if (!userId) return errorResponse(401, "UNAUTHORIZED", "Not authenticated");
  const { id } = await params;

  const existing = await checkOwnership(id, userId);
  if (!existing) return errorResponse(404, "NOT_FOUND", "Category not found");

  await prisma.category.delete({ where: { id } });
  return Response.json({ data: { success: true } });
}
