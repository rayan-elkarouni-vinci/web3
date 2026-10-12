import { z } from "zod";
import type { User } from "./user.ts";
import type { Category } from "./category.ts";

export interface Expense {
  id: number;
  date: string;
  description: string;
  amount: number;
  payerId: number;
  payer: User;
  participants: User[];
  categoryId: number | null;
  category: Category | null;
}

export interface NewExpense {
  date: string;
  description: string;
  amount: number;
  payerId: number;
  participants: number[];
  categoryId: number;
}

const expenseFilterSchema = z.object({
  amount: z.coerce.number().nonnegative().optional(),
  payerId: z.coerce.number().int().positive().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
});

export type ExpenseFilter = z.infer<typeof expenseFilterSchema>;

export function parseExpenseFilter(data: unknown): ExpenseFilter | false {
  const result = expenseFilterSchema.safeParse(data);
  return result.success ? result.data : false;
}