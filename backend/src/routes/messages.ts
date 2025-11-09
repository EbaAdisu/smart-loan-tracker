// Message routes
import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middleware/auth.middleware';
import messageService from '../services/message.service';
import loanService from '../services/loan.service';
import notificationService from '../services/notification.service';

export const messageRoutes = new Elysia({ prefix: '/messages' })
  .use(authMiddleware)

  // Get messages for a loan
  .get('/loans/:loanId', async (context: any) => {
    const { user, body, set, params, query, headers, request } = context;
    try {
      const { loanId } = params;
      const { limit } = query;

      // Verify user has access to this loan
      const loan = await loanService.getLoanById(loanId);
      if (loan.lenderUserId !== user.id && loan.borrowerUserId !== user.id) {
        set.status = 403;
        return {
          success: false,
          error: 'Not authorized to view messages for this loan',
        };
      }

      const messages = await messageService.getMessagesForLoan(
        loanId,
        limit ? parseInt(limit) : 50
      );

      // Mark messages as read for current user
      await messageService.markLoanMessagesAsRead(loanId, user.id);

      return {
        success: true,
        data: messages,
      };
    } catch (error: any) {
      set.status = 404;
      return {
        success: false,
        error: error.message || 'Failed to get messages',
      };
    }
  })

  // Send a message
  .post(
    '/',
    async (context: any) => {
      const { user, body, set, params, query, headers, request } = context;
    try {
        // Verify user has access to this loan
        const loan = await loanService.getLoanById(body.loanId);
        if (loan.lenderUserId !== user.id && loan.borrowerUserId !== user.id) {
          set.status = 403;
          return {
            success: false,
            error: 'Not authorized to send messages for this loan',
          };
        }

        // Determine receiver
        const receiverUserId =
          loan.lenderUserId === user.id ? loan.borrowerUserId : loan.lenderUserId;

        const message = await messageService.sendMessage({
          loanId: body.loanId,
          senderUserId: user.id,
          receiverUserId,
          senderName: user.name,
          content: body.content,
        });

        // Notify receiver
        await notificationService.notifyNewMessage(
          receiverUserId,
          body.loanId,
          user.name
        );

        return {
          success: true,
          data: message,
        };
      } catch (error: any) {
        set.status = 400;
        return {
          success: false,
          error: error.message || 'Failed to send message',
        };
      }
    },
    {
      body: t.Object({
        loanId: t.String({ minLength: 1 }),
        content: t.String({ minLength: 1, maxLength: 5000 }),
      }),
    }
  )

  // Mark message as read
  .put('/:messageId/read', async ({ params, set }) => {
    try {
      const message = await messageService.markAsRead(params.messageId);

      return {
        success: true,
        data: message,
      };
    } catch (error: any) {
      set.status = 404;
      return {
        success: false,
        error: error.message || 'Failed to mark message as read',
      };
    }
  })

  // Get unread message count
  .get('/unread-count', async (context: any) => {
    const { user, body, set, params, query, headers, request } = context;
    try {
      const count = await messageService.getUnreadCount(user.id);

      return {
        success: true,
        data: { count },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get unread count',
      };
    }
  })

  // Get recent conversations
  .get('/conversations', async (context: any) => {
    const { user, body, set, params, query, headers, request } = context;
    try {
      const { limit } = query;

      const conversations = await messageService.getRecentConversations(
        user.id,
        limit ? parseInt(limit) : 10
      );

      return {
        success: true,
        data: conversations,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get conversations',
      };
    }
  });

export default messageRoutes;

