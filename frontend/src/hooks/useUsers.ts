import { useEffect, useState } from 'react';
import type { User } from '../types/User';

const host = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_BASE_URL = `${host}/api`;

interface UseUsersResult {
  users: User[];
  loading: boolean;
  error: string | null;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

function useUsers(): UseUsersResult {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) {
          throw new Error(`Failed to fetch users (${response.status})`);
        }
        setUsers((await response.json()) as User[]);
      } catch (err) {
        setError(errorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return { users, loading, error };
}

export default useUsers;
