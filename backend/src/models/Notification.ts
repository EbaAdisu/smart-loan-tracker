// Notification Model
import mongoose, { Schema, Document } from 'mongoose';

export enum NotificationType {
  LOAN_DUE = 'loan_due',
  LOAN_OVERDUE = 'loan_overdue',
  PAYMENT_RECEIVED = 'payment_received',
  NEW_MESSAGE = 'new_message',
  STATUS_CHANGE = 'status_change',
}

export interface INotification extends Document {
  userId: string; // References UserProfile.userId
  type: NotificationType;
  title: string;
  body: string;
  loanId?: string; // References Loan.loanId
  read: boolean;
  createdAt: Date;
  markAsRead(): void;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    body: {
      type: String,
      required: true,
      maxlength: 500,
    },
    loanId: {
      type: String,
      default: null,
      index: true,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'notifications',
  }
);

// Indexes for efficient queries
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, type: 1 });
NotificationSchema.index({ createdAt: -1 });

// Methods
NotificationSchema.methods.markAsRead = function () {
  this.read = true;
};

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
export default Notification;

