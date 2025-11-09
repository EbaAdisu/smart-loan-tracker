import { baseApi } from './baseApi';
import { ApiResponse } from '../../types/api.types';

export interface AnalyticsSummary {
  totalGiven: number;
  totalReceived: number;
  netPosition: number;
  activeLoansCount: number;
}

export interface MonthlyAnalytics {
  month: string;
  given: number;
  received: number;
  net: number;
}

export interface YearlyAnalytics {
  year: number;
  totalGiven: number;
  totalReceived: number;
  netPosition: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  count: number;
}

export const analyticsApi = {
  async getSummary(): Promise<ApiResponse<AnalyticsSummary>> {
    return baseApi.get('/analytics/summary');
  },

  async getMonthly(month: string): Promise<ApiResponse<MonthlyAnalytics>> {
    return baseApi.get(`/analytics/monthly?month=${month}`);
  },

  async getYearly(year: number): Promise<ApiResponse<YearlyAnalytics>> {
    return baseApi.get(`/analytics/yearly?year=${year}`);
  },

  async getCategories(): Promise<ApiResponse<CategoryBreakdown[]>> {
    return baseApi.get('/analytics/categories');
  },
};

