// Auth routes - Better Auth integration
import { Elysia, t } from 'elysia';
import AuthController from '../controllers/auth.controller';

export const authRoutes = new Elysia({ prefix: '/auth' })
  // Better Auth handles all auth endpoints via its own routes
  .all('/*', async (context: any) => {
    return AuthController.handleAuthRequest(context);
  })
  // Hook: Create user profile after successful signup
  .post(
    '/signup/callback',
    async (context: any) => {
      return AuthController.createUserProfile(context);
    },
    {
      body: t.Object({
        userId: t.String(),
      }),
    }
  );

export default authRoutes;
