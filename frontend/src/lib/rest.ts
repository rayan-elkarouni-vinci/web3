import { clearToken, getToken } from './token';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function apiRequest<T>(path: string): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: token ? { authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    // Même règle que pour GraphQL : le serveur dit que la session ne vaut plus rien.
    if (response.status === 401) {
      clearToken();
      window.location.href = '/login';
    }
    throw new Response(`Request to ${path} failed`, { status: response.status });
  }

  return response.json() as Promise<T>;
}
