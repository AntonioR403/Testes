import { TxType } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { parseBody } from "@/lib/validation";
import { transactionSchema } from "@/lib/schemas";
import { requireUserId } from "@/lib/require-user";
import { errorResponse } from "@/lib/errors";

const querySchema = z.object({
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  categoryId: z.string().cuid().optional(),
  txType: z.nativeEnum(TxType).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(request: Request) {
  const userId = await requireUserId();
  if (!userId) return errorResponse(401, "UNAUTHORIZED", "Not authenticated");

  const url = new URL(request.url);
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  if (!parsed.success) return errorResponse(400, "VALIDATION_ERROR", "Invalid query", parsed.error.flatten());

  const { page, pageSize, dateFrom, dateTo, categoryId, txType, search } = parsed.data;

  const where = {
    userId,
    ...(dateFrom || dateTo
      ? { txDate: { ...(dateFrom ? { gte: new Date(dateFrom) } : {}), ...(dateTo ? { lte: new Date(dateTo) } : {}) } }
      : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(txType ? { txType } : {}),
    ...(search ? { description: { contains: search, mode: "insensitive" as const } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { txDate: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.transaction.count({ where }),
  ]);

  return Response.json({ data: items, meta: { total, page, pageSize } });
}

export async function POST(request: Request) {
  const userId = await requireUserId();
  if (!userId) return errorResponse(401, "UNAUTHORIZED", "Not authenticated");

  const parsed = await parseBody(transactionSchema, request);
  if (parsed.error) return parsed.error;

  const category = await prisma.category.findFirst({ where: { id: parsed.data.categoryId, userId } });
  if (!category) return errorResponse(404, "CATEGORY_NOT_FOUND", "Category not found");

  const transaction = await prisma.transaction.create({
    data: {
      ...parsed.data,
      txDate: new Date(parsed.data.txDate),
      userId,
    },
  });

  return Response.json({ data: transaction }, { status: 201 });
}
