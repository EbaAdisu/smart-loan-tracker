// User Controller
import authService from '../services/auth.service';
import mongoose from 'mongoose';
import logger from '../utils/logger';

export class UserController {
  // Get current user profile
  static async getCurrentUser(context: any) {
    const { user, set } = context;
    
    try {
      // Get Better Auth user from database
      const usersCollection = mongoose.connection.db?.collection('user');
      if (!usersCollection) {
        set.status = 500;
        return {
          success: false,
          error: 'Database not connected',
        };
      }
      const betterAuthUser = await usersCollection.findOne({ id: user.id });
      
      if (!betterAuthUser) {
        set.status = 404;
        return {
          success: false,
          error: 'User not found',
        };
      }
      
      const profile = await authService.getUserProfile(user.id);

      set.status = 200;
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
      logger.error('Error getting user profile:', error);
      set.status = 500;
      return {
        success: false,
        error: error.message || 'Failed to get user profile',
      };
    }
  }

  // Update current user profile
  static async updateCurrentUser(context: any) {
    const { user, body, set } = context;
    
    try {
      const { name, profilePicture } = body;

      // Update Better Auth user name if provided
      if (name) {
        const usersCollection = mongoose.connection.db?.collection('user');
        if (usersCollection) {
          await usersCollection.updateOne(
            { id: user.id },
            { $set: { name } }
          );
        }
      }

      // Update extended profile
      const updatedProfile = await authService.updateUserProfile(user.id, {
        profilePicture,
      });

      set.status = 200;
      return {
        success: true,
        data: updatedProfile,
      };
    } catch (error: any) {
      logger.error('Error updating user profile:', error);
      set.status = 500;
      return {
        success: false,
        error: error.message || 'Failed to update user profile',
      };
    }
  }

  // Register device token for push notifications
  static async registerDeviceToken(context: any) {
    const { user, body, set } = context;
    
    try {
      await authService.registerDeviceToken(user.id, body.token);
      set.status = 200;
      return {
        success: true,
        message: 'Device token registered',
      };
    } catch (error: any) {
      logger.error('Error registering device token:', error);
      set.status = 500;
      return {
        success: false,
        error: error.message || 'Failed to register device token',
      };
    }
  }

  // Search users
  static async searchUsers(context: any) {
    const { query, set } = context;
    
    try {
      if (!query.q || query.q.length < 2) {
        set.status = 400;
        return {
          success: false,
          error: 'Search query must be at least 2 characters',
        };
      }

      // Search in Better Auth users collection
      const usersCollection = mongoose.connection.db?.collection('user');
      if (!usersCollection) {
        set.status = 500;
        return {
          success: false,
          error: 'Database not connected',
        };
      }

      const users = await usersCollection
        .find({
          $or: [
            { name: { $regex: query.q, $options: 'i' } },
            { email: { $regex: query.q, $options: 'i' } },
          ],
        })
        .limit(20)
        .toArray();

      set.status = 200;
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
      logger.error('Error searching users:', error);
      set.status = 500;
      return {
        success: false,
        error: error.message || 'Failed to search users',
      };
    }
  }

  // Get user by ID
  static async getUserById(context: any) {
    const { params, set } = context;
    
    try {
      // Get user from Better Auth
      const usersCollection = mongoose.connection.db?.collection('user');
      if (!usersCollection) {
        set.status = 500;
        return {
          success: false,
          error: 'Database not connected',
        };
      }
      const betterAuthUser = await usersCollection.findOne({ id: params.userId });

      if (!betterAuthUser) {
        set.status = 404;
        return {
          success: false,
          error: 'User not found',
        };
      }

      // Get extended profile
      const profile = await authService.getUserProfile(params.userId);

      set.status = 200;
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
      logger.error('Error getting user by ID:', error);
      set.status = 500;
      return {
        success: false,
        error: error.message || 'Failed to get user',
      };
    }
  }
}

export default UserController;
