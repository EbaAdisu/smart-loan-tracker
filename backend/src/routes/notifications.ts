// Notification routes
import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middleware/auth.middleware';
import NotificationController from '../controllers/notification.controller';

export const notificationRoutes = new Elysia({ prefix: '/notifications' })
  .use(authMiddleware)

  // Get all notifications
  .get(
    '/',
    async (context: any) => {
      const { user, query } = context;
      const limit = query.limit ? parseInt(query.limit) : 50;
      return NotificationController.getUserNotifications(user.id, limit);
    },
    {
      query: t.Object({
        limit: t.Optional(t.String()),
      }),
    }
  )

  // Get unread notification count
  .get('/unread-count', async (context: any) => {
    const { user } = context;
    return NotificationController.getUnreadCount(user.id);
  })

  // Mark notification as read
  .post(
    '/mark-read',
    async (context: any) => {
      const { user, body, set } = context;
      const result = await NotificationController.markAsRead(body.notificationId, user.id);
      
      if (!result.success) {
        set.status = 400;
      }
      
      return result;
    },
    {
      body: t.Object({
        notificationId: t.String({ minLength: 1 }),
      }),
    }
  );

export default notificationRoutes;
