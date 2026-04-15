import { auth } from "@/auth";
import { errorResponse } from "@/lib/errors";

export async function GET() {
  const session = await auth();
  if (!session?.user) return errorResponse(401, "UNAUTHORIZED", "Not authenticated");

  return Response.json({ data: session.user });
}
