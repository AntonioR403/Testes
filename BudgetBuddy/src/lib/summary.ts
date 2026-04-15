import { TxType } from "@prisma/client";

export function calculateMonthlyTotals(
  transactions: Array<{ amount: number; txType: TxType }>,
): { income: number; expense: number; net: number } {
  const income = transactions
    .filter((tx) => tx.txType === TxType.income)
    .reduce((sum, tx) => sum + tx.amount, 0);
  const expense = transactions
    .filter((tx) => tx.txType === TxType.expense)
    .reduce((sum, tx) => sum + tx.amount, 0);
  return { income, expense, net: income - expense };
}
