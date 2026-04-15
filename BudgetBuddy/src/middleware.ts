import { auth } from "@/auth";
import { NextResponse } from "next/server";

const publicApiRoutes = new Set([
  "/api/auth",
  "/api/login",
  "/api/logout",
  "/api/signup",
  "/api/me",
]);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api") && !Array.from(publicApiRoutes).some((p) => pathname.startsWith(p))) {
    if (!req.auth?.user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 },
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/api/:path*"],
};
