// Message Model
import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  loanId: string; // References Loan.loanId
  senderUserId: string; // References UserProfile.userId
  receiverUserId: string; // References UserProfile.userId
  senderName: string;
  content: string;
  read: boolean;
  createdAt: Date;
  markAsRead(): void;
}

const MessageSchema = new Schema<IMessage>(
  {
    loanId: {
      type: String,
      required: true,
      index: true,
    },
    senderUserId: {
      type: String,
      required: true,
      index: true,
    },
    receiverUserId: {
      type: String,
      required: true,
      index: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'messages',
  }
);

// Indexes for efficient queries
MessageSchema.index({ loanId: 1, createdAt: -1 });
MessageSchema.index({ receiverUserId: 1, read: 1 });
MessageSchema.index({ senderUserId: 1, createdAt: -1 });

// Methods
MessageSchema.methods.markAsRead = function () {
  this.read = true;
};

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
export default Message;

