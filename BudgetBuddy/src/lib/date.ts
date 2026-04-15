export function normalizeBudgetMonth(input: Date | string): Date {
  const date = new Date(input);
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}
