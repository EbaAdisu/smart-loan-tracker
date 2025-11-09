// Notification Service
import { Notification, NotificationType, INotification } from '../models/Notification';
import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { env } from '../config/env';
import authService from './auth.service';
import { NotFoundError } from '../utils/errors';
import logger from '../utils/logger';

export interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  loanId?: string;
}

export class NotificationService {
  private expo: Expo;

  constructor() {
    this.expo = new Expo({
      accessToken: env.EXPO_ACCESS_TOKEN,
    });
  }

  // Create notification
  async createNotification(data: CreateNotificationData): Promise<INotification> {
    try {
      const notification = new Notification({
        ...data,
        read: false,
      });

      await notification.save();
      logger.success(`Created notification for user: ${data.userId}`);

      // Send push notification
      await this.sendPushNotification(data.userId, data.title, data.body, data.loanId);

      return notification;
    } catch (error) {
      logger.error('Failed to create notification', error);
      throw error;
    }
  }

  // Send push notification via Expo
  async sendPushNotification(
    userId: string,
    title: string,
    body: string,
    loanId?: string
  ): Promise<void> {
    try {
      const deviceTokens = await authService.getDeviceTokens(userId);

      if (!deviceTokens || deviceTokens.length === 0) {
        logger.warn(`No device tokens found for user: ${userId}`);
        return;
      }

      // Filter valid Expo push tokens
      const validTokens = deviceTokens.filter((token) => Expo.isExpoPushToken(token));

      if (validTokens.length === 0) {
        logger.warn(`No valid Expo push tokens for user: ${userId}`);
        return;
      }

      // Create messages
      const messages: ExpoPushMessage[] = validTokens.map((token) => ({
        to: token,
        sound: 'default',
        title,
        body,
        data: { loanId },
      }));

      // Send in chunks
      const chunks = this.expo.chunkPushNotifications(messages);
      const tickets: ExpoPushTicket[] = [];

      for (const chunk of chunks) {
        try {
          const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          logger.error('Error sending push notification chunk', error);
        }
      }

      logger.success(`Sent ${tickets.length} push notifications to user: ${userId}`);
    } catch (error) {
      logger.error('Failed to send push notification', error);
      // Don't throw - notification was created, push just failed
    }
  }

  // Get notifications for a user
  async getUserNotifications(
    userId: string,
    filters?: {
      read?: boolean;
      type?: NotificationType;
      limit?: number;
    }
  ): Promise<INotification[]> {
    const query: any = { userId };

    if (filters?.read !== undefined) {
      query.read = filters.read;
    }

    if (filters?.type) {
      query.type = filters.type;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(filters?.limit || 50);

    return notifications;
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<INotification> {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    notification.markAsRead();
    await notification.save();
    return notification;
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string): Promise<void> {
    await Notification.updateMany(
      { userId, read: false },
      { $set: { read: true } }
    );
    logger.success(`Marked all notifications as read for user: ${userId}`);
  }

  // Delete notification
  async deleteNotification(notificationId: string): Promise<void> {
    const result = await Notification.findByIdAndDelete(notificationId);
    if (!result) {
      throw new NotFoundError('Notification not found');
    }
    logger.success(`Deleted notification: ${notificationId}`);
  }

  // Get unread count
  async getUnreadCount(userId: string): Promise<number> {
    const count = await Notification.countDocuments({
      userId,
      read: false,
    });
    return count;
  }

  // Notify about loan due soon
  async notifyLoanDue(userId: string, loanId: string, daysUntilDue: number): Promise<void> {
    await this.createNotification({
      userId,
      type: NotificationType.LOAN_DUE,
      title: 'Loan Due Soon',
      body: `You have a loan due in ${daysUntilDue} days`,
      loanId,
    });
  }

  // Notify about overdue loan
  async notifyLoanOverdue(userId: string, loanId: string): Promise<void> {
    await this.createNotification({
      userId,
      type: NotificationType.LOAN_OVERDUE,
      title: 'Loan Overdue',
      body: 'You have an overdue loan. Please make a payment.',
      loanId,
    });
  }

  // Notify about payment received
  async notifyPaymentReceived(userId: string, loanId: string, amount: number): Promise<void> {
    await this.createNotification({
      userId,
      type: NotificationType.PAYMENT_RECEIVED,
      title: 'Payment Received',
      body: `You received a payment of $${amount}`,
      loanId,
    });
  }

  // Notify about new message
  async notifyNewMessage(userId: string, loanId: string, senderName: string): Promise<void> {
    await this.createNotification({
      userId,
      type: NotificationType.NEW_MESSAGE,
      title: 'New Message',
      body: `${senderName} sent you a message`,
      loanId,
    });
  }

  // Notify about loan status change
  async notifyStatusChange(userId: string, loanId: string, newStatus: string): Promise<void> {
    await this.createNotification({
      userId,
      type: NotificationType.STATUS_CHANGE,
      title: 'Loan Status Changed',
      body: `Loan status changed to: ${newStatus}`,
      loanId,
    });
  }
}

export default new NotificationService();

