import { TxType } from "@prisma/client";
import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
});

export const categorySchema = z.object({
  name: z.string().min(1).max(64),
});

export const transactionSchema = z.object({
  amount: z.number().positive(),
  txType: z.nativeEnum(TxType),
  description: z.string().max(255).optional(),
  txDate: z.string().datetime(),
  categoryId: z.string().cuid(),
});

export const budgetSchema = z.object({
  amount: z.number().nonnegative(),
  categoryId: z.string().cuid(),
  month: z.string().datetime(),
});
