// Payment Model
import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  loanId: string; // References Loan.loanId
  amount: number;
  timestamp: Date;
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    loanId: {
      type: String,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'payments',
  }
);

// Indexes
PaymentSchema.index({ loanId: 1, timestamp: -1 });
PaymentSchema.index({ timestamp: -1 });

// Virtuals
PaymentSchema.virtual('loan', {
  ref: 'Loan',
  localField: 'loanId',
  foreignField: 'loanId',
  justOne: true,
});

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
export default Payment;

