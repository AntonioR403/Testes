import { ZodSchema } from "zod";
import { errorResponse } from "@/lib/errors";

export async function parseBody<T>(schema: ZodSchema<T>, request: Request) {
  try {
    const json = await request.json();
    const data = schema.parse(json);
    return { data };
  } catch (error) {
    return { error: errorResponse(400, "VALIDATION_ERROR", "Invalid request body", error) };
  }
}
