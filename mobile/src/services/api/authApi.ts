import { baseApi } from './baseApi';
import { LoginCredentials, SignupData, AuthResponse, User } from '../../types/auth.types';

export const authApi = {
  async signup(data: SignupData): Promise<AuthResponse> {
    return baseApi.post('/auth/sign-up/email', {
      email: data.email,
      password: data.password,
      name: data.name,
    });
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return baseApi.post('/auth/sign-in/email', {
      email: credentials.email,
      password: credentials.password,
    });
  },

  async logout(): Promise<AuthResponse> {
    return baseApi.post('/auth/sign-out');
  },

  async getSession(): Promise<AuthResponse> {
    return baseApi.get('/auth/get-session');
  },

  async forgotPassword(email: string): Promise<AuthResponse> {
    return baseApi.post('/auth/forgot-password', { email });
  },
};

