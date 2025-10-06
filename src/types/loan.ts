import { Payment } from './payment';

export type LoanType = 'I_OWE_THEM' | 'THEY_OWE_ME';
export type LoanStatus = 'ACTIVE' | 'PAID';

export interface Loan {
  id: string;
  userId: string;
  personName: string;
  amount: number;
  remainingAmount: number;
  loanType: LoanType;
  description?: string;
  status: LoanStatus;
  createdAt: Date;
  updatedAt: Date;
  payments?: Payment[];
}

export interface CreateLoanData {
  personName: string;
  amount: number;
  loanType: LoanType;
  description?: string;
}

export interface UpdateLoanData {
  personName?: string;
  amount?: number;
  loanType?: LoanType;
  description?: string;
  status?: LoanStatus;
}
