// Loan Model
import mongoose, { Schema, Document } from 'mongoose';

export enum LoanStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

export interface ILoan extends Document {
  loanId: string;
  lenderUserId: string; // References UserProfile.userId
  borrowerUserId: string; // References UserProfile.userId
  lenderName: string;
  borrowerName: string;
  amount: number;
  reason?: string;
  dateCreated: Date;
  dueDate: Date;
  status: LoanStatus;
  balanceRemaining: number;
  createdAt: Date;
  updatedAt: Date;
  isOverdue(): boolean;
  isCompleted(): boolean;
  updateBalance(paymentAmount: number): void;
}

const LoanSchema = new Schema<ILoan>(
  {
    loanId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    lenderUserId: {
      type: String,
      required: true,
      index: true,
    },
    borrowerUserId: {
      type: String,
      required: true,
      index: true,
    },
    lenderName: {
      type: String,
      required: true,
    },
    borrowerName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    reason: {
      type: String,
      default: '',
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(LoanStatus),
      default: LoanStatus.ACTIVE,
      index: true,
    },
    balanceRemaining: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: 'loans',
  }
);

// Indexes for efficient queries
LoanSchema.index({ lenderUserId: 1, status: 1 });
LoanSchema.index({ borrowerUserId: 1, status: 1 });
LoanSchema.index({ dueDate: 1, status: 1 });
LoanSchema.index({ createdAt: -1 });

// Generate unique loan ID
LoanSchema.pre('save', async function (next) {
  if (!this.loanId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    this.loanId = `LOAN-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

// Methods
LoanSchema.methods.isOverdue = function (): boolean {
  return this.dueDate < new Date() && this.status !== LoanStatus.COMPLETED;
};

LoanSchema.methods.isCompleted = function (): boolean {
  return this.balanceRemaining === 0 || this.status === LoanStatus.COMPLETED;
};

LoanSchema.methods.updateBalance = function (paymentAmount: number) {
  this.balanceRemaining = Math.max(0, this.balanceRemaining - paymentAmount);
  if (this.balanceRemaining === 0) {
    this.status = LoanStatus.COMPLETED;
  }
};

export const Loan = mongoose.model<ILoan>('Loan', LoanSchema);
export default Loan;

