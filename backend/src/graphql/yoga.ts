import { createYoga } from 'graphql-yoga';

import { schema } from './schema.ts';
import { AuthService } from '../services/auth.service.ts';
import type { GraphQLContext } from '../types/GraphQLContext.ts';
import { maskError } from './errorFormatter.ts';

function graphQLContextFromRequest(request: Request): GraphQLContext {
  // Yoga utilise l'API Request du web : request.headers.get(...),
  // pas req.headers d'Express.
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '';

  if (!token) {
    return {};
  }

  try {
    const jwt = AuthService.verifyToken(token);
    return { userJWT: jwt };
  } catch {
    // Un jeton faux ou expiré ne fait pas planter le serveur :
    // la requête continue en anonyme, et les resolvers la refuseront.
    return {};
  }
}

export const yoga = createYoga({
  schema,
  graphqlEndpoint: '/graphql',
  cors: false,
  maskedErrors: {
    maskError,
    isDev: process.env.NODE_ENV !== 'production',
  },
  context: ({ request }): GraphQLContext => graphQLContextFromRequest(request),
});
