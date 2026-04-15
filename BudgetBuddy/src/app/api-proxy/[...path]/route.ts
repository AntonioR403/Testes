import { NextRequest } from "next/server";

const allowedMethods = new Set(["GET", "POST", "PUT", "PATCH", "DELETE"]);

async function proxy(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const baseUrl = process.env.ASPNET_API_BASE_URL;

  if (!baseUrl) {
    return Response.json(
      {
        error: {
          code: "MISSING_ASPNET_API_BASE_URL",
          message: "Set ASPNET_API_BASE_URL in .env to use ASP.NET backend mode.",
        },
      },
      { status: 500 },
    );
  }

  if (!allowedMethods.has(request.method.toUpperCase())) {
    return Response.json({ error: { code: "METHOD_NOT_ALLOWED", message: "Method not allowed" } }, { status: 405 });
  }

  const { path } = await params;
  const incomingUrl = new URL(request.url);
  const targetUrl = `${baseUrl.replace(/\/$/, "")}/${path.join("/")}${incomingUrl.search}`;

  const requestInit: RequestInit = {
    method: request.method,
    headers: {
      "Content-Type": request.headers.get("content-type") ?? "application/json",
      Accept: request.headers.get("accept") ?? "application/json",
      Cookie: request.headers.get("cookie") ?? "",
      Authorization: request.headers.get("authorization") ?? "",
    },
    body: request.method === "GET" ? undefined : await request.text(),
  };

  const upstreamResponse = await fetch(targetUrl, requestInit);
  const responseText = await upstreamResponse.text();

  return new Response(responseText, {
    status: upstreamResponse.status,
    headers: {
      "Content-Type": upstreamResponse.headers.get("content-type") ?? "application/json",
      "Set-Cookie": upstreamResponse.headers.get("set-cookie") ?? "",
    },
  });
}

export async function GET(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(request, ctx);
}

export async function POST(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(request, ctx);
}

export async function PUT(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(request, ctx);
}

export async function PATCH(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(request, ctx);
}

export async function DELETE(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(request, ctx);
}
