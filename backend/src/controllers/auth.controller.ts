// Auth Controller
import { getAuth } from '../config/auth';
import authService from '../services/auth.service';
import { asyncHandler } from '../utils/errors';

export class AuthController {
  // Handle Better Auth routes
  static handleAuthRequest = asyncHandler(async (context: any): Promise<Response> => {
    const { request } = context;

    const auth = getAuth();
    return auth.handler(request);
  });

  // Create user profile after signup
  static createUserProfile = asyncHandler(async (context: any) => {
    const { body, set } = context;

    const { userId } = body;
    await authService.createUserProfile(userId);
    set.status = 201;
    return {
      success: true,
      message: 'User profile created',
    };
  });
}

export default AuthController;
