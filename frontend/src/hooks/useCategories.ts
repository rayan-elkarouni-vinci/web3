import { useEffect, useState } from 'react';
import type { Category } from '../types/Category';

const host = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_BASE_URL = `${host}/api`;

interface UseCategoriesResult {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) {
          throw new Error(`Failed to fetch categories (${response.status})`);
        }
        setCategories((await response.json()) as Category[]);
      } catch (err) {
        setError(errorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return { categories, loading, error };
}

export default useCategories;
