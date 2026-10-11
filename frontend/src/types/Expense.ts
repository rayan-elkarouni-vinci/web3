import type { User } from "./User";

export interface Expense {
  id: number;
  date: string;
  description: string;
  amount: number;
  payerId: number;
  payer: User;
  participants: User[];
}

export interface NewExpense {
  date: string;
  description: string;
  amount: number;
  payerId: number;
  participants: number[];
}
