// Message Controller
import messageService from '../services/message.service';
import loanService from '../services/loan.service';
import logger from '../utils/logger';

export class MessageController {
  // Get messages for a loan
  static async getLoanMessages(loanId: string, userId: string) {
    try {
      // Verify user has access to this loan
      const loan = await loanService.getLoanById(loanId);
      if (!loan) {
        return {
          success: false,
          error: 'Loan not found',
        };
      }

      if (loan.lenderUserId !== userId && loan.borrowerUserId !== userId) {
        return {
          success: false,
          error: 'Not authorized to view messages for this loan',
        };
      }

      const messages = await messageService.getMessagesForLoan(loanId);
      return {
        success: true,
        data: messages,
      };
    } catch (error: any) {
      logger.error('Error getting messages:', error);
      return {
        success: false,
        error: error.message || 'Failed to get messages',
      };
    }
  }

  // Send message
  static async sendMessage(
    userId: string,
    data: { loanId: string; content: string }
  ) {
    try {
      // Verify user has access to this loan
      const loan = await loanService.getLoanById(data.loanId);
      if (!loan) {
        return {
          success: false,
          error: 'Loan not found',
        };
      }

      if (loan.lenderUserId !== userId && loan.borrowerUserId !== userId) {
        return {
          success: false,
          error: 'Not authorized to send messages for this loan',
        };
      }

      const receiverUserId =
        loan.lenderUserId === userId ? loan.borrowerUserId : loan.lenderUserId;
      const senderName =
        loan.lenderUserId === userId ? loan.lenderName : loan.borrowerName;

      const message = await messageService.sendMessage({
        loanId: data.loanId,
        senderUserId: userId,
        receiverUserId,
        senderName,
        content: data.content,
      });

      return {
        success: true,
        data: message,
      };
    } catch (error: any) {
      logger.error('Error sending message:', error);
      return {
        success: false,
        error: error.message || 'Failed to send message',
      };
    }
  }

  // Get unread message count
  static async getUnreadCount(userId: string) {
    try {
      const count = await messageService.getUnreadCount(userId);
      return {
        success: true,
        data: { count },
      };
    } catch (error: any) {
      logger.error('Error getting unread count:', error);
      return {
        success: false,
        error: error.message || 'Failed to get unread count',
      };
    }
  }

  // Get recent messages
  static async getRecentMessages(userId: string, limit: number = 10) {
    try {
      const messages = await messageService.getRecentConversations(userId, limit);
      return {
        success: true,
        data: messages,
      };
    } catch (error: any) {
      logger.error('Error getting recent messages:', error);
      return {
        success: false,
        error: error.message || 'Failed to get recent messages',
      };
    }
  }
}

export default MessageController;

