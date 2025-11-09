export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
export const WS_URL = process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3000/ws';

export const STORAGE_KEYS = {
  SESSION_TOKEN: 'session_token',
  USER_DATA: 'user_data',
  LOANS_CACHE: 'loans_cache',
} as const;

export const LOAN_STATUS_COLORS = {
  pending: '#FFA500',
  active: '#4CAF50',
  overdue: '#F44336',
  completed: '#9E9E9E',
  cancelled: '#757575',
} as const;

export const NOTIFICATION_TYPES = {
  LOAN_DUE: 'loan_due',
  LOAN_OVERDUE: 'loan_overdue',
  PAYMENT_RECEIVED: 'payment_received',
  NEW_MESSAGE: 'new_message',
  LOAN_STATUS_CHANGED: 'loan_status_changed',
} as const;

