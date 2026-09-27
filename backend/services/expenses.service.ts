import { db } from '../src/prisma/db.ts';
import type { Expense, NewExpense } from "../types/expense.ts";

export class ExpensesService {
  
  public static async getExpenses() {
    try {
      return await db.orm.public.Expense.all();
    } catch (error) {
      console.error("Erreur lors de la lecture des dépenses :", error);
      throw error;
    }
  }
  
  public static async addExpense(newExpense: NewExpense) {
    try {
      const createdExpense = await db.orm.public.Expense.create(newExpense);
      return createdExpense; 
    } catch (error) {
      console.error("Erreur lors de l'ajout de la dépense :", error);
      throw error;
    }
  }
  
  /*
  public static async resetExpenses() {
    // Non implémenté pour la base de données
  }
  */
}
