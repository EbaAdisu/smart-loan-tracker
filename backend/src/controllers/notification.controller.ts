// Notification Controller
import notificationService from '../services/notification.service';
import logger from '../utils/logger';

export class NotificationController {
  // Get all notifications for user
  static async getUserNotifications(context: any) {
    const { user, query, set } = context;
    const limit = query.limit ? parseInt(query.limit) : 50;
    
    try {
      const notifications = await notificationService.getUserNotifications(
        user.id,
        { limit }
      );
      set.status = 200;
      return {
        success: true,
        data: notifications,
      };
    } catch (error: any) {
      logger.error('Error getting notifications:', error);
      set.status = 500;
      return {
        success: false,
        error: error.message || 'Failed to get notifications',
      };
    }
  }

  // Get unread notification count
  static async getUnreadCount(context: any) {
    const { user, set } = context;
    
    try {
      const count = await notificationService.getUnreadCount(user.id);
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

  // Mark notification as read
  static async markAsRead(context: any) {
    const { user, body, set } = context;
    
    try {
      const notification = await notificationService.markAsRead(body.notificationId);
      set.status = 200;
      return {
        success: true,
        data: notification,
      };
    } catch (error: any) {
      logger.error('Error marking notification as read:', error);
      set.status = 500;
      return {
        success: false,
        error: error.message || 'Failed to mark notification as read',
      };
    }
  }
}

export default NotificationController;
