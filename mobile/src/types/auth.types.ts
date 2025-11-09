export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    session: any;
  };
  error?: {
    message: string;
    statusCode: number;
    code: string;
  };
}

