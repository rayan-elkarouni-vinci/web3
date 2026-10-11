import type { Expense, ExpenseFilter, NewExpense } from "../types/expense.ts";
import { db } from "../prisma/db.ts";
import { Temporal } from "temporal-polyfill";

export class ExpensesService {
  public static async getExpenses(
    filter: ExpenseFilter = {},
  ): Promise<Expense[]> {
    try {
      const { amount, payerId } = filter;

      const base = db.orm.public.Expense;

      const byAmount =
        amount !== undefined ? base.where((e) => e.amount.gt(amount)) : base;

      const filtered =
        payerId !== undefined ? byAmount.where({ payerId }) : byAmount;

      const rows = await filtered
        .include("participants", (p) => p.include("user"))
        .include("payer")
        .all();

      return rows.map((row) => ({
        id: row.id,
        date: row.date.toString(),
        amount: row.amount,
        description: row.description,
        payerId: row.payerId,
        payer: row.payer,
        participants: row.participants.map((p) => p.user),
      }));
    } catch (error) {
      console.error("Error getting expenses:", error);
      throw error;
    }
  }

  public static async addExpense(newExpense: NewExpense): Promise<Expense> {
    try {
      const created = await db.orm.public.Expense.create({
        description: newExpense.description,
        amount: newExpense.amount,
        date: Temporal.Instant.from(`${newExpense.date}T00:00:00Z`),
        payerId: newExpense.payerId,
        participants: (mutator) =>
          mutator.create(newExpense.participants.map((userId) => ({ userId }))),
      });

      const expense = await db.orm.public.Expense.where({ id: created.id })
        .include("participants", (p) => p.include("user"))
        .include("payer")
        .first();

      if (!expense) {
        throw new Error("Expense not found after creation");
      }

      return {
        id: expense.id,
        date: expense.date.toString(),
        amount: expense.amount,
        description: expense.description,
        payerId: expense.payerId,
        payer: expense.payer,
        participants: expense.participants.map((p) => p.user),
      };
    } catch (error) {
      console.error("Error adding expense:", error);
      throw error;
    }
  }

  /*
  public static async resetExpenses() {
    // Non implémenté pour la base de données
  }
  */
}
