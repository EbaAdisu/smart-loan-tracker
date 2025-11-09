// Message Controller
import messageService from '../services/message.service';
import loanService from '../services/loan.service';
import logger from '../utils/logger';

export class MessageController {
  // Get messages for a loan
  static async getLoanMessages(context: any) {
    const { user, params, set } = context;
    
    try {
      // Verify user has access to this loan
      const loan = await loanService.getLoanById(params.loanId);
      if (!loan) {
        set.status = 404;
        return {
          success: false,
          error: 'Loan not found',
        };
      }

      if (loan.lenderUserId !== user.id && loan.borrowerUserId !== user.id) {
        set.status = 403;
        return {
          success: false,
          error: 'Not authorized to view messages for this loan',
        };
      }

      const messages = await messageService.getMessagesForLoan(params.loanId);
      set.status = 200;
      return {
        success: true,
        data: messages,
      };
    } catch (error: any) {
      logger.error('Error getting messages:', error);
      set.status = 500;
      return {
        success: false,
        error: error.message || 'Failed to get messages',
      };
    }
  }

  // Send message
  static async sendMessage(context: any) {
    const { user, body, set } = context;
    
    try {
      // Verify user has access to this loan
      const loan = await loanService.getLoanById(body.loanId);
      if (!loan) {
        set.status = 404;
        return {
          success: false,
          error: 'Loan not found',
        };
      }

      if (loan.lenderUserId !== user.id && loan.borrowerUserId !== user.id) {
        set.status = 403;
        return {
          success: false,
          error: 'Not authorized to send messages for this loan',
        };
      }

      const receiverUserId =
        loan.lenderUserId === user.id ? loan.borrowerUserId : loan.lenderUserId;
      const senderName =
        loan.lenderUserId === user.id ? loan.lenderName : loan.borrowerName;

      const message = await messageService.sendMessage({
        loanId: body.loanId,
        senderUserId: user.id,
        receiverUserId,
        senderName,
        content: body.content,
      });

      set.status = 201;
      return {
        success: true,
        data: message,
      };
    } catch (error: any) {
      logger.error('Error sending message:', error);
      set.status = 500;
      return {
        success: false,
        error: error.message || 'Failed to send message',
      };
    }
  }

  // Get unread message count
  static async getUnreadCount(context: any) {
    const { user, set } = context;
    
    try {
      const count = await messageService.getUnreadCount(user.id);
      set.status = 200;
      return {
        success: true,
        data: { count },
      };
    } catch (error: any) {
      logger.error('Error getting unread count:', error);
      set.status = 500;
      return {
        success: false,
        error: error.message || 'Failed to get unread count',
      };
    }
  }

  // Get recent messages
  static async getRecentMessages(context: any) {
    const { user, query, set } = context;
    const limit = query.limit ? parseInt(query.limit) : 10;
    
    try {
      const messages = await messageService.getRecentConversations(user.id, limit);
      set.status = 200;
      return {
        success: true,
        data: messages,
      };
    } catch (error: any) {
      logger.error('Error getting recent messages:', error);
      set.status = 500;
      return {
        success: false,
        error: error.message || 'Failed to get recent messages',
      };
    }
  }
}

export default MessageController;
