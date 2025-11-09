import { baseApi } from './baseApi';
import { ApiResponse } from '../../types/api.types';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  loanId?: string;
  read: boolean;
  createdAt: string;
}

export const notificationApi = {
  async getNotifications(limit: number = 50): Promise<ApiResponse<Notification[]>> {
    return baseApi.get(`/notifications?limit=${limit}`);
  },

  async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    return baseApi.get('/notifications/unread-count');
  },

  async markAsRead(notificationId: string): Promise<ApiResponse<void>> {
    return baseApi.post('/notifications/mark-read', { notificationId });
  },
};

