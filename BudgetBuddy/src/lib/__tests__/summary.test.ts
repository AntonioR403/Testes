import { describe, expect, it } from "vitest";
import { TxType } from "@prisma/client";
import { calculateMonthlyTotals } from "@/lib/summary";

describe("calculateMonthlyTotals", () => {
  it("computes income, expense and net", () => {
    const totals = calculateMonthlyTotals([
      { amount: 1000, txType: TxType.income },
      { amount: 500, txType: TxType.expense },
      { amount: 120, txType: TxType.expense },
    ]);

    expect(totals).toEqual({ income: 1000, expense: 620, net: 380 });
  });
});
