import { AuthenticationError } from '../errors/app.error.ts';
import type { UserJWT } from '../types/auth.ts';
import type { GraphQLContext } from '../types/GraphQLContext.ts';

export function requireAuth(context: GraphQLContext): UserJWT {
  if (!context.userJWT) {
    throw new AuthenticationError('You must be logged in to perform this action');
  }
  return context.userJWT;
}
