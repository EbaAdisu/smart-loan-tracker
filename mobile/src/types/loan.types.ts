export type LoanStatus = 'pending' | 'active' | 'overdue' | 'completed' | 'cancelled';
export type LoanRole = 'lender' | 'borrower';

export interface Loan {
  id: string;
  lenderUserId: string;
  borrowerUserId: string;
  lenderName: string;
  borrowerName: string;
  amount: number;
  balanceRemaining: number;
  reason?: string;
  dueDate: string;
  status: LoanStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  loanId: string;
  amount: number;
  notes?: string;
  createdAt: string;
}

export interface LoanFilters {
  type: 'all' | 'given' | 'received';
  status: 'all' | 'active' | 'overdue' | 'completed';
}

export interface CreateLoanData {
  lenderUserId: string;
  borrowerUserId: string;
  lenderName: string;
  borrowerName: string;
  amount: number;
  reason?: string;
  dueDate: string;
}

export interface UpdateLoanData {
  status?: LoanStatus;
  amount?: number;
  reason?: string;
  dueDate?: string;
  balanceRemaining?: number;
}

export interface RecordPaymentData {
  amount: number;
  notes?: string;
}

