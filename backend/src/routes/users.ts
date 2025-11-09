// User routes
import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middleware/auth.middleware';
import UserController from '../controllers/user.controller';

export const userRoutes = new Elysia({ prefix: '/users' })
  .use(authMiddleware)

  // Get current user profile
  .get('/me', async (context: any) => {
    return UserController.getCurrentUser(context);
  })

  // Update current user profile
  .put(
    '/me',
    async (context: any) => {
      return UserController.updateCurrentUser(context);
    },
    {
      body: t.Object({
        name: t.Optional(t.String()),
        profilePicture: t.Optional(t.String()),
      }),
    }
  )

  // Register device token for push notifications
  .post(
    '/device-token',
    async (context: any) => {
      return UserController.registerDeviceToken(context);
    },
    {
      body: t.Object({
        token: t.String({ minLength: 1 }),
      }),
    }
  )

  // Search users
  .get(
    '/search',
    async (context: any) => {
      return UserController.searchUsers(context);
    },
    {
      query: t.Object({
        q: t.String({ minLength: 1 }),
      }),
    }
  )

  // Get user by ID
  .get('/:userId', async (context: any) => {
    return UserController.getUserById(context);
  });

export default userRoutes;
