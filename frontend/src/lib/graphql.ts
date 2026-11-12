import { clearToken, getToken } from './token';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Seulement s'il y en a un : "Bearer null" est pire que pas d'en-tête.
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  const { data, errors } = await response.json();

  if (errors?.length) {
    // Le jeton est absent, expiré ou faux : c'est le serveur qui le sait.
    if (errors[0]?.extensions?.code === 'UNAUTHENTICATED') {
      clearToken();
      window.location.href = '/login';
    }

    // On reprend le code choisi par le serveur (l'AppError de l'exercice 7) :
    // un 403 voulu ne doit pas arriver déguisé en 500.
    const status = Number(errors[0]?.extensions?.statusCode) || 500;
    throw new Response(errors[0].message, { status });
  }

  return data as T;
}
