// Message Controller
import messageService from '../services/message.service';
import loanService from '../services/loan.service';
import { asyncHandler, NotFoundError, ForbiddenError } from '../utils/errors';

export class MessageController {
  // Get messages for a loan
  static getLoanMessages = asyncHandler(async (context: any) => {
    const { user, params } = context;

    // Verify user has access to this loan
    const loan = await loanService.getLoanById(params.loanId);
    if (!loan) {
      throw new NotFoundError('Loan not found');
    }

    if (loan.lenderUserId !== user.id && loan.borrowerUserId !== user.id) {
      throw new ForbiddenError('Not authorized to view messages for this loan');
    }

    const messages = await messageService.getMessagesForLoan(params.loanId);
    return {
      success: true,
      data: messages,
    };
  });

  // Send message
  static sendMessage = asyncHandler(async (context: any) => {
    const { user, body, set } = context;

    // Verify user has access to this loan
    const loan = await loanService.getLoanById(body.loanId);
    if (!loan) {
      throw new NotFoundError('Loan not found');
    }

    if (loan.lenderUserId !== user.id && loan.borrowerUserId !== user.id) {
      throw new ForbiddenError('Not authorized to send messages for this loan');
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
  });

  // Get unread message count
  static getUnreadCount = asyncHandler(async (context: any) => {
    const { user } = context;

    const count = await messageService.getUnreadCount(user.id);
    return {
      success: true,
      data: { count },
    };
  });

  // Get recent messages
  static getRecentMessages = asyncHandler(async (context: any) => {
    const { user, query } = context;
    const limit = query.limit ? parseInt(query.limit) : 10;

    const messages = await messageService.getRecentConversations(user.id, limit);
    return {
      success: true,
      data: messages,
    };
  });
}

export default MessageController;
