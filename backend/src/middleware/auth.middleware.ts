// Authentication middleware
import { Elysia, type Context } from 'elysia';
import { auth, type Session, type User } from '../config/auth';
import { UnauthorizedError } from '../utils/errors';

export interface AuthContext {
  user: User;
  session: Session;
}

export type AuthenticatedContext = Context & AuthContext;

// Derive plugin to add auth context
export const authMiddleware = new Elysia({ name: 'auth' })
  .derive(async ({ headers, set, request }) => {
    try {
      // Get session from Better Auth
      const authHeader = headers.authorization;
      const cookieHeader = headers.cookie || '';
      const sessionToken = authHeader?.replace('Bearer ', '') ||
        cookieHeader.split(';').find((c: string) => c.trim().startsWith('better-auth.session_token='))?.split('=')[1];

      if (!sessionToken) {
        set.status = 401;
        throw new UnauthorizedError('No session token provided');
      }

      // Verify session with Better Auth
      const session = await auth.api.getSession({
        headers: new Headers({
          cookie: `better-auth.session_token=${sessionToken}`,
        }),
      });

      if (!session || !session.user) {
        set.status = 401;
        throw new UnauthorizedError('Invalid or expired session');
      }

      return {
        user: session.user,
        session: session.session,
      };
    } catch (error) {
      set.status = 401;
      throw new UnauthorizedError('Authentication required');
    }
  });

// Optional auth - doesn't throw error if not authenticated
export const optionalAuth = new Elysia({ name: 'optional-auth' })
  .derive(async ({ headers }) => {
    try {
      const authHeader = headers.authorization;
      const cookieHeader = headers.cookie || '';
      const sessionToken = authHeader?.replace('Bearer ', '') ||
        cookieHeader.split(';').find((c: string) => c.trim().startsWith('better-auth.session_token='))?.split('=')[1];

      if (!sessionToken) {
        return { user: null, session: null };
      }

      const session = await auth.api.getSession({
        headers: new Headers({
          cookie: `better-auth.session_token=${sessionToken}`,
        }),
      });

      return {
        user: session?.user || null,
        session: session?.session || null,
      };
    } catch (error) {
      return { user: null, session: null };
    }
  });

