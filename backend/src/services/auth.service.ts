import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../prisma/db.ts';
import { userFromDBO } from '../types/user.ts';
import { JWT_SECRET } from '../types/auth.ts';
import type { LoginInput, RegisterInput, UserJWT } from '../types/auth.ts';
import type { User } from '../types/user.ts';
import { AuthenticationError, ConflictError } from '../errors/app.error.ts';

const SALT_ROUNDS = 10;

export class AuthService {
  static async register(input: RegisterInput): Promise<User> {
    const existingUser = await db.orm.public.User.where({ email: input.email }).first();
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Volontairement lent : c'est tout l'intérêt de bcrypt.
    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    const userDbo = await db.orm.public.User.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });
    return userFromDBO(userDbo);
  }

  static async login(input: LoginInput): Promise<User> {
    // 1. chercher l'utilisateur par son email
    const userDbo = await db.orm.public.User.where({ email: input.email }).first();

    // 2. pas d'utilisateur : refus
    if (!userDbo) {
      throw new AuthenticationError('Invalid email or password');
    }

    // 3. comparer le mot de passe reçu avec le hash stocké
    const ok = await bcrypt.compare(input.password, userDbo.passwordHash);

    // 4. pas de correspondance : refus, avec LA MÊME phrase qu'en 2
    if (!ok) {
      throw new AuthenticationError('Invalid email or password');
    }

    // 5. renvoyer l'utilisateur, sans son hash
    return userFromDBO(userDbo);
  }

  static verifyToken(token: string): UserJWT {
    try {
      return jwt.verify(token, JWT_SECRET) as UserJWT;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
