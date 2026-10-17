import { useCallback, useEffect, useState } from 'react';
import type { Expense, ExpenseFilter, NewExpense } from '../types/Expense';

const host = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_BASE_URL = `${host}/api`;

interface UseExpensesResult {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  addExpense: (expense: NewExpense) => Promise<void>;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

function useExpenses(filter: ExpenseFilter = {}): UseExpensesResult {
  const { amount, payerId, categoryId } = filter;
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (amount !== undefined) {
        params.set('amount', String(amount));
      }
      if (payerId !== undefined) params.set('payerId', String(payerId));
      if (categoryId !== undefined) params.set('categoryId', String(categoryId));
      
      const query = params.toString();
      const url = query
        ? `${API_BASE_URL}/expenses?${query}`
        : `${API_BASE_URL}/expenses`;
    
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch expenses (${response.status})`);
      }
      const data = (await response.json()) as Expense[];
      setExpenses(data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [amount, payerId, categoryId]);

  // Runs once on mount to load the initial expense list.
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = useCallback(
    async (expense: NewExpense) => {
      try {
        setError(null);
        const response = await fetch(`${API_BASE_URL}/expenses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expense),
        });
        if (!response.ok) {
          throw new Error(`Failed to add expense (${response.status})`);
        }
        await fetchExpenses();
      } catch (err) {
        setError(errorMessage(err));
      }
    },
    [fetchExpenses],
  );

  return { expenses, loading, error, addExpense };
}

export default useExpenses;