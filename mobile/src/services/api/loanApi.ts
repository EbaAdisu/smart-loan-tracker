import { baseApi } from './baseApi';
import { ApiResponse } from '../../types/api.types';
import { Loan, CreateLoanData, UpdateLoanData, Payment, RecordPaymentData } from '../../types/loan.types';

export const loanApi = {
  async getLoans(params?: { status?: string; role?: string }): Promise<ApiResponse<Loan[]>> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.role) queryParams.append('role', params.role);
    
    const query = queryParams.toString();
    return baseApi.get(`/loans${query ? `?${query}` : ''}`);
  },

  async getLoan(loanId: string): Promise<ApiResponse<Loan>> {
    return baseApi.get(`/loans/${loanId}`);
  },

  async createLoan(data: CreateLoanData): Promise<ApiResponse<Loan>> {
    return baseApi.post('/loans', data);
  },

  async updateLoan(loanId: string, data: UpdateLoanData): Promise<ApiResponse<Loan>> {
    return baseApi.put(`/loans/${loanId}`, data);
  },

  async deleteLoan(loanId: string): Promise<ApiResponse<void>> {
    return baseApi.delete(`/loans/${loanId}`);
  },

  async acceptLoan(loanId: string): Promise<ApiResponse<Loan>> {
    return baseApi.post(`/loans/${loanId}/accept`);
  },

  async recordPayment(loanId: string, data: RecordPaymentData): Promise<ApiResponse<Payment>> {
    return baseApi.post(`/loans/${loanId}/payments`, { amount: data.amount, notes: data.notes });
  },

  async getPaymentHistory(loanId: string): Promise<ApiResponse<Payment[]>> {
    return baseApi.get(`/loans/${loanId}/payments`);
  },
};

