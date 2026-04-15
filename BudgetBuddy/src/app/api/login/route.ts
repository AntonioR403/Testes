import { signIn } from "@/auth";
import { errorResponse } from "@/lib/errors";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    await signIn("credentials", { email, password, redirect: false });
    return Response.json({ data: { success: true } });
  } catch {
    return errorResponse(401, "INVALID_CREDENTIALS", "Invalid email/password combination");
  }
}
