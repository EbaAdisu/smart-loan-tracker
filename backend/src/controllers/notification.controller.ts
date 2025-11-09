// Notification Controller
import notificationService from '../services/notification.service';
import { asyncHandler } from '../utils/errors';

export class NotificationController {
  // Get all notifications for user
  static getUserNotifications = asyncHandler(async (context: any) => {
    const { user, query } = context;
    const limit = query.limit ? parseInt(query.limit) : 50;

    const notifications = await notificationService.getUserNotifications(
      user.id,
      { limit }
    );
    return {
      success: true,
      data: notifications,
    };
  });

  // Get unread notification count
  static getUnreadCount = asyncHandler(async (context: any) => {
    const { user } = context;

    const count = await notificationService.getUnreadCount(user.id);
    return {
      success: true,
      data: { count },
    };
  });

  // Mark notification as read
  static markAsRead = asyncHandler(async (context: any) => {
    const { body } = context;

    const notification = await notificationService.markAsRead(body.notificationId);
    return {
      success: true,
      data: notification,
    };
  });
}

export default NotificationController;
