// Notification Controller
import notificationService from '../services/notification.service';
import logger from '../utils/logger';

export class NotificationController {
  // Get all notifications for user
  static async getUserNotifications(userId: string, limit: number = 50) {
    try {
      const notifications = await notificationService.getUserNotifications(
        userId,
        { limit }
      );
      return {
        success: true,
        data: notifications,
      };
    } catch (error: any) {
      logger.error('Error getting notifications:', error);
      return {
        success: false,
        error: error.message || 'Failed to get notifications',
      };
    }
  }

  // Get unread notification count
  static async getUnreadCount(userId: string) {
    try {
      const count = await notificationService.getUnreadCount(userId);
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

  // Mark notification as read
  static async markAsRead(notificationId: string, userId: string) {
    try {
      const notification = await notificationService.markAsRead(notificationId);
      return {
        success: true,
        data: notification,
      };
    } catch (error: any) {
      logger.error('Error marking notification as read:', error);
      return {
        success: false,
        error: error.message || 'Failed to mark notification as read',
      };
    }
  }
}

export default NotificationController;

