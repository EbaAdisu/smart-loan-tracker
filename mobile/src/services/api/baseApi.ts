import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '../../utils/constants';
import { storageService } from '../storage.service';
import { ApiResponse } from '../../types/api.types';

class BaseApi {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      withCredentials: true, // Important for Better Auth cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token if available
    this.api.interceptors.request.use(
      async (config) => {
        const token = await storageService.getSessionToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear session
          await storageService.clearAll();
          // You might want to dispatch a logout action here
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(url: string, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async put<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete<T = any>(url: string, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): ApiResponse {
    if (error.response) {
      return {
        success: false,
        error: {
          message: error.response.data?.error?.message || error.response.data?.message || 'An error occurred',
          statusCode: error.response.status,
          code: error.response.data?.error?.code || 'UNKNOWN_ERROR',
        },
      };
    } else if (error.request) {
      return {
        success: false,
        error: {
          message: 'Network error. Please check your connection.',
          statusCode: 0,
          code: 'NETWORK_ERROR',
        },
      };
    } else {
      return {
        success: false,
        error: {
          message: error.message || 'An unexpected error occurred',
          statusCode: 500,
          code: 'UNKNOWN_ERROR',
        },
      };
    }
  }
}

export const baseApi = new BaseApi();

