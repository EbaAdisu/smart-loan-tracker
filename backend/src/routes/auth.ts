// Auth routes - Better Auth integration
import { Elysia, t } from 'elysia';
import { getAuth } from '../config/auth';
import authService from '../services/auth.service';

export const authRoutes = new Elysia({ prefix: '/auth' })
  // Better Auth handles all auth endpoints via its own routes
  .all('/*', async ({ request }) => {
    const auth = getAuth();
    return auth.handler(request);
  })
  // Hook: Create user profile after successful signup
  .post('/signup/callback', async ({ body }) => {
    try {
      const { userId } = body as { userId: string };
      await authService.createUserProfile(userId);
      return { success: true, message: 'User profile created' };
    } catch (error) {
      console.error('Error creating user profile:', error);
      return { success: false, error: 'Failed to create user profile' };
    }
  });

export default authRoutes;

