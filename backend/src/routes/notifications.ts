// Notification routes
import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middleware/auth.middleware';
import notificationService from '../services/notification.service';
import { NotificationType } from '../models/Notification';

export const notificationRoutes = new Elysia({ prefix: '/notifications' })
  .use(authMiddleware)

  // Get user notifications
  .get('/', async (context: any) => {
    const { user, body, set, params, query, headers, request } = context;
    try {
      const { read, type, limit } = query;

      const notifications = await notificationService.getUserNotifications(user.id, {
        read: read ? read === 'true' : undefined,
        type: type as NotificationType,
        limit: limit ? parseInt(limit) : 50,
      });

      return {
        success: true,
        data: notifications,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get notifications',
      };
    }
  })

  // Get unread count
  .get('/unread-count', async (context: any) => {
    const { user, body, set, params, query, headers, request } = context;
    try {
      const count = await notificationService.getUnreadCount(user.id);

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

  // Mark notification as read
  .put('/:id/read', async ({ params, set }) => {
    try {
      const notification = await notificationService.markAsRead(params.id);

      return {
        success: true,
        data: notification,
      };
    } catch (error: any) {
      set.status = 404;
      return {
        success: false,
        error: error.message || 'Failed to mark notification as read',
      };
    }
  })

  // Mark all notifications as read
  .put('/read-all', async (context: any) => {
    const { user, body, set, params, query, headers, request } = context;
    try {
      await notificationService.markAllAsRead(user.id);

      return {
        success: true,
        message: 'All notifications marked as read',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to mark all notifications as read',
      };
    }
  })

  // Delete notification
  .delete('/:id', async ({ params, set }) => {
    try {
      await notificationService.deleteNotification(params.id);

      return {
        success: true,
        message: 'Notification deleted',
      };
    } catch (error: any) {
      set.status = 404;
      return {
        success: false,
        error: error.message || 'Failed to delete notification',
      };
    }
  });

export default notificationRoutes;

