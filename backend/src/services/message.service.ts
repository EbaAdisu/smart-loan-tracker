// Message Service
import { Message, IMessage } from '../models/Message';
import { NotFoundError } from '../utils/errors';
import logger from '../utils/logger';

export interface CreateMessageData {
  loanId: string;
  senderUserId: string;
  receiverUserId: string;
  senderName: string;
  content: string;
}

export class MessageService {
  // Send a message
  async sendMessage(data: CreateMessageData): Promise<IMessage> {
    try {
      const message = new Message({
        ...data,
        read: false,
      });

      await message.save();
      logger.success(`Message sent from ${data.senderUserId} to ${data.receiverUserId}`);
      return message;
    } catch (error) {
      logger.error('Failed to send message', error);
      throw error;
    }
  }

  // Get messages for a loan
  async getMessagesForLoan(loanId: string, limit: number = 50): Promise<IMessage[]> {
    const messages = await Message.find({ loanId })
      .sort({ createdAt: -1 })
      .limit(limit);

    return messages.reverse(); // Return in chronological order
  }

  // Mark message as read
  async markAsRead(messageId: string): Promise<IMessage> {
    const message = await Message.findById(messageId);
    if (!message) {
      throw new NotFoundError('Message not found');
    }

    message.markAsRead();
    await message.save();
    return message;
  }

  // Mark all messages in a loan as read for a user
  async markLoanMessagesAsRead(loanId: string, userId: string): Promise<void> {
    await Message.updateMany(
      {
        loanId,
        receiverUserId: userId,
        read: false,
      },
      {
        $set: { read: true },
      }
    );

    logger.success(`Marked all messages as read for loan ${loanId} and user ${userId}`);
  }

  // Get unread message count for a user
  async getUnreadCount(userId: string): Promise<number> {
    const count = await Message.countDocuments({
      receiverUserId: userId,
      read: false,
    });

    return count;
  }

  // Get unread messages for a user
  async getUnreadMessages(userId: string, limit: number = 50): Promise<IMessage[]> {
    const messages = await Message.find({
      receiverUserId: userId,
      read: false,
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    return messages;
  }

  // Delete message
  async deleteMessage(messageId: string): Promise<void> {
    const result = await Message.findByIdAndDelete(messageId);
    if (!result) {
      throw new NotFoundError('Message not found');
    }
    logger.success(`Deleted message: ${messageId}`);
  }

  // Get recent conversations for a user
  async getRecentConversations(userId: string, limit: number = 10) {
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ senderUserId: userId }, { receiverUserId: userId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: '$loanId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$receiverUserId', userId] }, { $eq: ['$read', false] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $limit: limit,
      },
    ]);

    return messages;
  }
}

export default new MessageService();

