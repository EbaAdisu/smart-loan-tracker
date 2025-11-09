// User Controller
import authService from '../services/auth.service';
import mongoose from 'mongoose';
import logger from '../utils/logger';

export class UserController {
  // Get current user profile
  static async getCurrentUser(userId: string) {
    try {
      // Get Better Auth user from database
      const usersCollection = mongoose.connection.db?.collection('user');
      if (!usersCollection) {
        return {
          success: false,
          error: 'Database not connected',
        };
      }
      const betterAuthUser = await usersCollection.findOne({ id: userId });
      
      if (!betterAuthUser) {
        return {
          success: false,
          error: 'User not found',
        };
      }
      
      const profile = await authService.getUserProfile(userId);

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
      return {
        success: false,
        error: error.message || 'Failed to get user profile',
      };
    }
  }

  // Update current user profile
  static async updateCurrentUser(userId: string, data: { name?: string; profilePicture?: string }) {
    try {
      const { name, profilePicture } = data;

      // Update Better Auth user name if provided
      if (name) {
        const usersCollection = mongoose.connection.db?.collection('user');
        if (usersCollection) {
          await usersCollection.updateOne(
            { id: userId },
            { $set: { name } }
          );
        }
      }

      // Update extended profile
      const updatedProfile = await authService.updateUserProfile(userId, {
        profilePicture,
      });

      return {
        success: true,
        data: updatedProfile,
      };
    } catch (error: any) {
      logger.error('Error updating user profile:', error);
      return {
        success: false,
        error: error.message || 'Failed to update user profile',
      };
    }
  }

  // Register device token for push notifications
  static async registerDeviceToken(userId: string, token: string) {
    try {
      await authService.registerDeviceToken(userId, token);
      return {
        success: true,
        message: 'Device token registered',
      };
    } catch (error: any) {
      logger.error('Error registering device token:', error);
      return {
        success: false,
        error: error.message || 'Failed to register device token',
      };
    }
  }

  // Search users
  static async searchUsers(query: string) {
    try {
      if (!query || query.length < 2) {
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
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
          ],
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
      logger.error('Error searching users:', error);
      return {
        success: false,
        error: error.message || 'Failed to search users',
      };
    }
  }

  // Get user by ID
  static async getUserById(userId: string) {
    try {
      // Get user from Better Auth
      const usersCollection = mongoose.connection.db?.collection('user');
      if (!usersCollection) {
        return {
          success: false,
          error: 'Database not connected',
        };
      }
      const betterAuthUser = await usersCollection.findOne({ id: userId });

      if (!betterAuthUser) {
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
      logger.error('Error getting user by ID:', error);
      return {
        success: false,
        error: error.message || 'Failed to get user',
      };
    }
  }
}

export default UserController;

