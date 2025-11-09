// Auth Controller
import { getAuth } from '../config/auth';
import authService from '../services/auth.service';
import logger from '../utils/logger';

export class AuthController {
  // Handle Better Auth routes
  static async handleAuthRequest(request: Request): Promise<Response> {
    try {
      const auth = getAuth();
      return auth.handler(request);
    } catch (error: any) {
      logger.error('Auth handler error:', error);
      return new Response(
        JSON.stringify({ success: false, error: 'Authentication error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // Create user profile after signup
  static async createUserProfile(userId: string) {
    try {
      await authService.createUserProfile(userId);
      return {
        success: true,
        message: 'User profile created',
      };
    } catch (error: any) {
      logger.error('Error creating user profile:', error);
      return {
        success: false,
        error: error.message || 'Failed to create user profile',
      };
    }
  }
}

export default AuthController;

