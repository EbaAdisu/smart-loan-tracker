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
      return NotificationController.getUserNotifications(context);
    },
    {
      query: t.Object({
        limit: t.Optional(t.String()),
      }),
    }
  )

  // Get unread notification count
  .get('/unread-count', async (context: any) => {
    return NotificationController.getUnreadCount(context);
  })

  // Mark notification as read
  .post(
    '/mark-read',
    async (context: any) => {
      return NotificationController.markAsRead(context);
    },
    {
      body: t.Object({
        notificationId: t.String({ minLength: 1 }),
      }),
    }
  );

export default notificationRoutes;
