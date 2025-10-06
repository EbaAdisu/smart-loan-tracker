export interface Payment {
  id: string;
  name: string; // NEW: Who owes/owed
  amount: number;
  direction: 'owe' | 'owed'; // NEW: Direction indicator
  paymentDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentData {
  name: string; // NEW: Who owes/owed
  amount: number;
  direction: 'owe' | 'owed'; // NEW: Direction indicator
  paymentDate: Date;
  notes?: string;
}
