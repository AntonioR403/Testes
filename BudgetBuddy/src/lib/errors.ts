import { NextResponse } from "next/server";

export type ErrorShape = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export function errorResponse(status: number, code: string, message: string, details?: unknown) {
  return NextResponse.json<ErrorShape>(
    {
      error: { code, message, details },
    },
    { status },
  );
}
