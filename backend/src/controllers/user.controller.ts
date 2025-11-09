// User Controller
import authService from '../services/auth.service';
import mongoose from 'mongoose';
import { asyncHandler, NotFoundError, BadRequestError, DatabaseError } from '../utils/errors';

export class UserController {
  // Get current user profile
  static getCurrentUser = asyncHandler(async (context: any) => {
    const { user } = context;

    // Get Better Auth user from database
    const usersCollection = mongoose.connection.db?.collection('user');
    if (!usersCollection) {
      throw new DatabaseError('Database not connected');
    }
    const betterAuthUser = await usersCollection.findOne({ id: user.id });

    if (!betterAuthUser) {
      throw new NotFoundError('User not found');
    }

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
  });

  // Update current user profile
  static updateCurrentUser = asyncHandler(async (context: any) => {
    const { user, body } = context;

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

    return {
      success: true,
      data: updatedProfile,
    };
  });

  // Register device token for push notifications
  static registerDeviceToken = asyncHandler(async (context: any) => {
    const { user, body } = context;

    await authService.registerDeviceToken(user.id, body.token);
    return {
      success: true,
      message: 'Device token registered',
    };
  });

  // Search users
  static searchUsers = asyncHandler(async (context: any) => {
    const { query } = context;

    if (!query.q || query.q.length < 2) {
      throw new BadRequestError('Search query must be at least 2 characters');
    }

    // Search in Better Auth users collection
    const usersCollection = mongoose.connection.db?.collection('user');
    if (!usersCollection) {
      throw new DatabaseError('Database not connected');
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

    return {
      success: true,
      data: users.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        image: u.image,
      })),
    };
  });

  // Get user by ID
  static getUserById = asyncHandler(async (context: any) => {
    const { params } = context;

    // Get user from Better Auth
    const usersCollection = mongoose.connection.db?.collection('user');
    if (!usersCollection) {
      throw new DatabaseError('Database not connected');
    }
    const betterAuthUser = await usersCollection.findOne({ id: params.userId });

    if (!betterAuthUser) {
      throw new NotFoundError('User not found');
    }

    // Get extended profile
    const profile = await authService.getUserProfile(params.userId);

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
  });
}

export default UserController;
