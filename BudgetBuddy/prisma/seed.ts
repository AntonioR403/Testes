import { PrismaClient, TxType } from "@prisma/client";
import { hash } from "bcryptjs";
import { normalizeBudgetMonth } from "../src/lib/date";

const prisma = new PrismaClient();

async function main() {
  const email = "demo@budgetbuddy.dev";
  const passwordHash = await hash("Password123!", 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Demo User",
      passwordHash,
    },
  });

  const categoryNames = ["Salary", "Freelance", "Groceries", "Rent", "Utilities", "Entertainment"];

  const categories = await Promise.all(
    categoryNames.map((name) =>
      prisma.category.upsert({
        where: { userId_name: { userId: user.id, name } },
        update: {},
        create: { userId: user.id, name },
      }),
    ),
  );

  const currentMonth = normalizeBudgetMonth(new Date());
  const prevMonth = normalizeBudgetMonth(new Date(Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth() - 1, 1)));

  const getCategoryId = (name: string) => categories.find((c) => c.name === name)?.id as string;

  const transactions = [
    { amount: 4500, txType: TxType.income, description: "Monthly salary", categoryId: getCategoryId("Salary"), txDate: currentMonth },
    { amount: 350, txType: TxType.expense, description: "Groceries", categoryId: getCategoryId("Groceries"), txDate: new Date(Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth(), 4)) },
    { amount: 1500, txType: TxType.expense, description: "Rent", categoryId: getCategoryId("Rent"), txDate: new Date(Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth(), 1)) },
    { amount: 4200, txType: TxType.income, description: "Salary last month", categoryId: getCategoryId("Salary"), txDate: prevMonth },
    { amount: 275, txType: TxType.expense, description: "Utilities", categoryId: getCategoryId("Utilities"), txDate: new Date(Date.UTC(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth(), 10)) },
    { amount: 180, txType: TxType.expense, description: "Movies", categoryId: getCategoryId("Entertainment"), txDate: new Date(Date.UTC(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth(), 18)) },
  ];

  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  await prisma.transaction.createMany({
    data: transactions.map((tx) => ({ ...tx, userId: user.id })),
  });

  const budgets = [
    { categoryId: getCategoryId("Groceries"), amount: 600 },
    { categoryId: getCategoryId("Rent"), amount: 1600 },
    { categoryId: getCategoryId("Utilities"), amount: 300 },
    { categoryId: getCategoryId("Entertainment"), amount: 250 },
  ];

  for (const month of [currentMonth, prevMonth]) {
    for (const budget of budgets) {
      await prisma.budget.upsert({
        where: {
          userId_categoryId_month: {
            userId: user.id,
            categoryId: budget.categoryId,
            month,
          },
        },
        update: { amount: budget.amount },
        create: {
          userId: user.id,
          categoryId: budget.categoryId,
          month,
          amount: budget.amount,
        },
      });
    }
  }

  console.log("Seed completed for", email);
}

main().finally(() => prisma.$disconnect());
