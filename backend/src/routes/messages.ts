// Message routes
import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middleware/auth.middleware';
import MessageController from '../controllers/message.controller';

export const messageRoutes = new Elysia({ prefix: '/messages' })
  .use(authMiddleware)

  // Get messages for a loan
  .get('/loans/:loanId', async (context: any) => {
    const { user, params, set } = context;
    const result = await MessageController.getLoanMessages(params.loanId, user.id);

    if (!result.success) {
      set.status = result.error === 'Loan not found' ? 404 : 403;
    }

    return result;
  })

  // Send message
  .post(
    '/',
    async (context: any) => {
      const { user, body, set } = context;
      const result = await MessageController.sendMessage(user.id, {
        loanId: body.loanId,
        content: body.content,
      });

      if (!result.success) {
        set.status = 400;
      }

      return result;
    },
    {
      body: t.Object({
        loanId: t.String({ minLength: 1 }),
        content: t.String({ minLength: 1 }),
      }),
    }
  )

  // Get unread message count
  .get('/unread-count', async (context: any) => {
    const { user } = context;
    return MessageController.getUnreadCount(user.id);
  })

  // Get recent messages
  .get(
    '/recent',
    async (context: any) => {
      const { user, query } = context;
      const limit = query.limit ? parseInt(query.limit) : 10;
      return MessageController.getRecentMessages(user.id, limit);
    },
    {
      query: t.Object({
        limit: t.Optional(t.String()),
      }),
    }
  );

export default messageRoutes;
