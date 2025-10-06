export interface Payment {
  id: string;
  loanId: string;
  amount: number;
  paymentDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentData {
  loanId: string;
  amount: number;
  paymentDate: Date;
  notes?: string;
}

