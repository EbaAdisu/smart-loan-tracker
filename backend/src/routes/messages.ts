// Message routes
import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middleware/auth.middleware';
import MessageController from '../controllers/message.controller';

export const messageRoutes = new Elysia({ prefix: '/messages' })
  .use(authMiddleware)

  // Get messages for a loan
  .get('/loans/:loanId', async (context: any) => {
    return MessageController.getLoanMessages(context);
  })

  // Send message
  .post(
    '/',
    async (context: any) => {
      return MessageController.sendMessage(context);
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
    return MessageController.getUnreadCount(context);
  })

  // Get recent messages
  .get(
    '/recent',
    async (context: any) => {
      return MessageController.getRecentMessages(context);
    },
    {
      query: t.Object({
        limit: t.Optional(t.String()),
      }),
    }
  );

export default messageRoutes;
