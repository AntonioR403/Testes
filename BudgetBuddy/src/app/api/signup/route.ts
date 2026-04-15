import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { parseBody } from "@/lib/validation";
import { signupSchema } from "@/lib/schemas";
import { errorResponse } from "@/lib/errors";

export async function POST(request: Request) {
  const parsed = await parseBody(signupSchema, request);
  if (parsed.error) return parsed.error;

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return errorResponse(409, "EMAIL_TAKEN", "Email is already registered");

  const passwordHash = await hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      passwordHash,
    },
    select: { id: true, email: true, name: true },
  });

  return NextResponse.json({ data: user }, { status: 201 });
}
