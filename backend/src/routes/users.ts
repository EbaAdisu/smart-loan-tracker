// User routes
import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middleware/auth.middleware';
import UserController from '../controllers/user.controller';

export const userRoutes = new Elysia({ prefix: '/users' })
  .use(authMiddleware)

  // Get current user profile
  .get('/me', async (context: any) => {
    const { user } = context;
    return UserController.getCurrentUser(user.id);
  })

  // Update current user profile
  .put(
    '/me',
    async (context: any) => {
      const { user, body, set } = context;
      const result = await UserController.updateCurrentUser(user.id, body);
      
      if (!result.success) {
        set.status = 400;
      }
      
      return result;
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
      const { user, body, set } = context;
      const result = await UserController.registerDeviceToken(user.id, body.token);
      
      if (!result.success) {
        set.status = 400;
      }
      
      return result;
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
      const { query } = context;
      return UserController.searchUsers(query.q);
    },
    {
      query: t.Object({
        q: t.String({ minLength: 1 }),
      }),
    }
  )

  // Get user by ID
  .get('/:userId', async (context: any) => {
    const { params, set } = context;
    const result = await UserController.getUserById(params.userId);
    
    if (!result.success) {
      set.status = result.error === 'User not found' ? 404 : 400;
    }
    
    return result;
  });

export default userRoutes;
