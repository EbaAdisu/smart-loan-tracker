import { baseApi } from './baseApi';
import { ApiResponse } from '../../types/api.types';
import { User } from '../../types/auth.types';

export interface UpdateProfileData {
  name?: string;
  profilePicture?: string;
}

export const userApi = {
  async getProfile(): Promise<ApiResponse<User>> {
    return baseApi.get('/users/me');
  },

  async updateProfile(data: UpdateProfileData): Promise<ApiResponse<User>> {
    return baseApi.put('/users/me', data);
  },

  async searchUsers(query: string): Promise<ApiResponse<User[]>> {
    return baseApi.get(`/users/search?q=${encodeURIComponent(query)}`);
  },

  async getUserById(userId: string): Promise<ApiResponse<User>> {
    return baseApi.get(`/users/${userId}`);
  },

  async registerDeviceToken(token: string): Promise<ApiResponse<void>> {
    return baseApi.post('/users/device-token', { token });
  },
};

