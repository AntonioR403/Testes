import { describe, expect, it } from "vitest";
import { normalizeBudgetMonth } from "@/lib/date";

describe("normalizeBudgetMonth", () => {
  it("normalizes any date to first UTC day of month", () => {
    const input = "2026-04-23T15:45:00.000Z";
    const normalized = normalizeBudgetMonth(input);
    expect(normalized.toISOString()).toBe("2026-04-01T00:00:00.000Z");
  });
});
