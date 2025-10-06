import { ObjectId } from 'mongodb';

// MongoDB Document interfaces
export interface MongoDocument {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Loan document interface
export interface LoanDocument extends MongoDocument {
  userId: string;
  personName: string;
  amount: number;
  remainingAmount: number;
  loanType: 'I_OWE_THEM' | 'THEY_OWE_ME';
  description?: string;
  status: 'ACTIVE' | 'PAID';
}

// Payment document interface
export interface PaymentDocument extends MongoDocument {
  loanId: string;
  amount: number;
  paymentDate: Date;
  notes?: string;
}

// Utility functions for converting between Prisma types and MongoDB types
export function toMongoId(id: string | ObjectId): ObjectId {
  if (typeof id === 'string') {
    return new ObjectId(id);
  }
  return id;
}

export function fromMongoId(id: ObjectId): string {
  return id.toString();
}

// Convert MongoDB document to API response format
export function convertLoanDocument(doc: LoanDocument) {
  return {
    id: fromMongoId(doc._id),
    userId: doc.userId,
    personName: doc.personName,
    amount: doc.amount,
    remainingAmount: doc.remainingAmount,
    loanType: doc.loanType,
    description: doc.description,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export function convertPaymentDocument(doc: PaymentDocument) {
  return {
    id: fromMongoId(doc._id),
    loanId: doc.loanId,
    amount: doc.amount,
    paymentDate: doc.paymentDate,
    notes: doc.notes,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
