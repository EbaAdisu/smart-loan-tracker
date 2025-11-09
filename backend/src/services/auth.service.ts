// Authentication Service
import { auth } from '../config/auth';
import { UserProfile } from '../models/User';
import { ConflictError, NotFoundError } from '../utils/errors';
import logger from '../utils/logger';

export class AuthService {
  // Create user profile after Better Auth signup
  async createUserProfile(userId: string): Promise<void> {
    try {
      // Check if profile already exists
      const existingProfile = await UserProfile.findOne({ userId });
      if (existingProfile) {
        logger.warn(`User profile already exists for userId: ${userId}`);
        return;
      }

      // Create new user profile
      const profile = new UserProfile({
        userId,
        deviceTokens: [],
        lastLogin: new Date(),
      });

      await profile.save();
      logger.success(`Created user profile for userId: ${userId}`);
    } catch (error) {
      logger.error('Failed to create user profile', error);
      throw error;
    }
  }

  // Get user profile by userId
  async getUserProfile(userId: string) {
    const profile = await UserProfile.findOne({ userId });
    if (!profile) {
      throw new NotFoundError('User profile not found');
    }
    return profile;
  }

  // Update user profile
  async updateUserProfile(userId: string, data: Partial<{ profilePicture: string }>) {
    const profile = await UserProfile.findOne({ userId });
    if (!profile) {
      throw new NotFoundError('User profile not found');
    }

    if (data.profilePicture !== undefined) {
      profile.profilePicture = data.profilePicture;
    }

    await profile.save();
    return profile;
  }

  // Register device token for push notifications
  async registerDeviceToken(userId: string, token: string) {
    const profile = await this.getUserProfile(userId);
    profile.addDeviceToken(token);
    await profile.save();
    return profile;
  }

  // Remove device token
  async removeDeviceToken(userId: string, token: string) {
    const profile = await this.getUserProfile(userId);
    profile.removeDeviceToken(token);
    await profile.save();
    return profile;
  }

  // Update last login
  async updateLastLogin(userId: string) {
    const profile = await UserProfile.findOne({ userId });
    if (profile) {
      profile.updateLastLogin();
      await profile.save();
    }
  }

  // Get user's device tokens for push notifications
  async getDeviceTokens(userId: string): Promise<string[]> {
    const profile = await UserProfile.findOne({ userId });
    return profile?.deviceTokens || [];
  }
}

export default new AuthService();

