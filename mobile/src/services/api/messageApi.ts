import { baseApi } from './baseApi';
import { ApiResponse } from '../../types/api.types';

export interface Message {
  id: string;
  loanId: string;
  senderId: string;
  senderName: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface SendMessageData {
  loanId: string;
  content: string;
}

export const messageApi = {
  async getMessages(loanId: string): Promise<ApiResponse<Message[]>> {
    return baseApi.get(`/messages/loans/${loanId}`);
  },

  async sendMessage(data: SendMessageData): Promise<ApiResponse<Message>> {
    return baseApi.post('/messages', data);
  },

  async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    return baseApi.get('/messages/unread-count');
  },

  async getRecentMessages(limit: number = 10): Promise<ApiResponse<Message[]>> {
    return baseApi.get(`/messages/recent?limit=${limit}`);
  },
};

