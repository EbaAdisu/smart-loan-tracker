import { io, Socket } from 'socket.io-client';
import { WS_URL } from '../utils/constants';
import { store } from '../store';
import { addNotification } from '../store/slices/notificationSlice';

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;

  connect(userId: string) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(WS_URL, {
      transports: ['websocket'],
      query: { userId },
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('WebSocket disconnected');
    });

    this.socket.on('new_message', (data: any) => {
      // Handle new message
      console.log('New message received:', data);
      // You can dispatch actions or update state here
    });

    this.socket.on('message_read', (data: any) => {
      // Handle message read
      console.log('Message read:', data);
    });

    this.socket.on('user_online', (data: any) => {
      console.log('User online:', data);
    });

    this.socket.on('user_offline', (data: any) => {
      console.log('User offline:', data);
    });

    this.socket.on('notification', (data: any) => {
      // Handle new notification
      store.dispatch(addNotification(data));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  sendMessage(loanId: string, content: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('send_message', { loanId, content });
    }
  }

  markMessageAsRead(messageId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('mark_message_read', { messageId });
    }
  }

  getIsConnected(): boolean {
    return this.isConnected;
  }
}

export const websocketService = new WebSocketService();

