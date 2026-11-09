import type { Category } from "./Category";
import type { User } from "./User";

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

export interface ExpenseFilter {
  amount?: number;
  payerId?: number;
  categoryId?: number;
}

// Ce que la page liste reçoit : seulement les champs affichés
export interface ExpenseListItem {
  id: number;
  description: string;
  amount: number;
  date: string;
  payer: { id: number; name: string };
  category: Category | null;
}
