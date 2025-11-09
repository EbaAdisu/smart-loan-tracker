// User routes
import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middleware/auth.middleware';
import authService from '../services/auth.service';
import { auth } from '../config/auth';
import mongoose from 'mongoose';

export const userRoutes = new Elysia({ prefix: '/users' })
  .use(authMiddleware)

  // Get current user profile
  .get('/me', async (context: any) => {
    const { user, body, set, params, query, headers, request } = context;
    try {
      // Get Better Auth user data
      const betterAuthUser = user;

      // Get extended profile
      const profile = await authService.getUserProfile(user.id);

      return {
        success: true,
        data: {
          id: betterAuthUser.id,
          email: betterAuthUser.email,
          name: betterAuthUser.name,
          image: betterAuthUser.image,
          profilePicture: profile.profilePicture,
          deviceTokens: profile.deviceTokens,
          createdAt: profile.createdAt,
          lastLogin: profile.lastLogin,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get user profile',
      };
    }
  })

  // Update current user profile
  .put(
    '/me',
    async (context: any) => {
      const { user, body, set, params, query, headers, request } = context;
    try {
        const { name, profilePicture } = body;

        // Update Better Auth user name if provided
        if (name) {
          // Better Auth update would go here
          // For now, we'll just update the profile
        }

        // Update extended profile
        if (profilePicture !== undefined) {
          await authService.updateUserProfile(user.id, { profilePicture });
        }

        const profile = await authService.getUserProfile(user.id);

        return {
          success: true,
          data: profile,
        };
      } catch (error: any) {
        set.status = 400;
        return {
          success: false,
          error: error.message || 'Failed to update profile',
        };
      }
    },
    {
      body: t.Object({
        name: t.Optional(t.String({ minLength: 1 })),
        profilePicture: t.Optional(t.String()),
      }),
    }
  )

  // Register device token for push notifications
  .post(
    '/device-token',
    async (context: any) => {
      const { user, body, set, params, query, headers, request } = context;
    try {
        const { token } = body;
        await authService.registerDeviceToken(user.id, token);

        return {
          success: true,
          message: 'Device token registered',
        };
      } catch (error: any) {
        set.status = 400;
        return {
          success: false,
          error: error.message || 'Failed to register device token',
        };
      }
    },
    {
      body: t.Object({
        token: t.String({ minLength: 1 }),
      }),
    }
  )

  // Search users by name or email
  .get(
    '/search',
    async (context: any) => {
      const { user, body, set, params, query, headers, request } = context;
    try {
        const { q } = query;

        if (!q || q.length < 2) {
          return {
            success: false,
            error: 'Search query must be at least 2 characters',
          };
        }

      // Search in Better Auth users collection
      const usersCollection = mongoose.connection.db?.collection('user');
      if (!usersCollection) {
        return {
          success: false,
          error: 'Database not connected',
        };
      }
        
        const users = await usersCollection
          .find({
            $or: [
              { name: { $regex: q, $options: 'i' } },
              { email: { $regex: q, $options: 'i' } },
            ],
            id: { $ne: user.id }, // Exclude current user
          })
          .limit(20)
          .toArray();

        return {
          success: true,
          data: users.map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            image: u.image,
          })),
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || 'Failed to search users',
        };
      }
    },
    {
      query: t.Object({
        q: t.String({ minLength: 1 }),
      }),
    }
  )

  // Get user by ID
  .get('/:userId', async ({ params, set }) => {
    try {
      const { userId } = params;

      // Get user from Better Auth
      const usersCollection = mongoose.connection.db?.collection('user');
      if (!usersCollection) {
        set.status = 500;
        return {
          success: false,
          error: 'Database not connected',
        };
      }
      const betterAuthUser = await usersCollection.findOne({ id: userId });

      if (!betterAuthUser) {
        set.status = 404;
        return {
          success: false,
          error: 'User not found',
        };
      }

      // Get extended profile
      const profile = await authService.getUserProfile(userId);

      return {
        success: true,
        data: {
          id: betterAuthUser.id,
          email: betterAuthUser.email,
          name: betterAuthUser.name,
          image: betterAuthUser.image,
          profilePicture: profile.profilePicture,
          createdAt: profile.createdAt,
        },
      };
    } catch (error: any) {
      set.status = 404;
      return {
        success: false,
        error: error.message || 'User not found',
      };
    }
  });

export default userRoutes;

