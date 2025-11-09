// Auth routes - Better Auth integration
import { Elysia, t } from 'elysia';
import AuthController from '../controllers/auth.controller';

export const authRoutes = new Elysia({ prefix: '/auth' })
  // Better Auth handles all auth endpoints via its own routes
  .all('/*', async ({ request }) => {
    return AuthController.handleAuthRequest(request);
  })
  // Hook: Create user profile after successful signup
  .post(
    '/signup/callback',
    async ({ body, set }) => {
      const { userId } = body as { userId: string };
      const result = await AuthController.createUserProfile(userId);
      
      if (!result.success) {
        set.status = 400;
      }
      
      return result;
    },
    {
      body: t.Object({
        userId: t.String(),
      }),
    }
  );

export default authRoutes;
