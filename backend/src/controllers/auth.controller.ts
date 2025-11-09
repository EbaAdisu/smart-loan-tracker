// Auth Controller
import { getAuth } from '../config/auth';
import authService from '../services/auth.service';
import logger from '../utils/logger';

export class AuthController {
  // Handle Better Auth routes
  static async handleAuthRequest(context: any): Promise<Response> {
    const { request } = context;
    
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
  static async createUserProfile(context: any) {
    const { body, set } = context;
    
    try {
      const { userId } = body;
      await authService.createUserProfile(userId);
      set.status = 201;
      return {
        success: true,
        message: 'User profile created',
      };
    } catch (error: any) {
      logger.error('Error creating user profile:', error);
      set.status = 500;
      return {
        success: false,
        error: error.message || 'Failed to create user profile',
      };
    }
  }
}

export default AuthController;
