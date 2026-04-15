import { prisma } from "@/lib/prisma";
import { parseBody } from "@/lib/validation";
import { categorySchema } from "@/lib/schemas";
import { requireUserId } from "@/lib/require-user";
import { errorResponse } from "@/lib/errors";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return errorResponse(401, "UNAUTHORIZED", "Not authenticated");

  const categories = await prisma.category.findMany({ where: { userId }, orderBy: { name: "asc" } });
  return Response.json({ data: categories });
}

export async function POST(request: Request) {
  const userId = await requireUserId();
  if (!userId) return errorResponse(401, "UNAUTHORIZED", "Not authenticated");

  const parsed = await parseBody(categorySchema, request);
  if (parsed.error) return parsed.error;

  const category = await prisma.category.create({
    data: { userId, name: parsed.data.name },
  });

  return Response.json({ data: category }, { status: 201 });
}
