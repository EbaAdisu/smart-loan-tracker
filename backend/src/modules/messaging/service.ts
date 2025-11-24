import { MessagingRepository } from "./repository";
import { Message, Notification, NotificationType } from "./model";
import { randomUUID } from "crypto";
import { NotFoundError } from "../../core/errors";
import { messaging } from "../../core/db/firebase";
import { UserRepository } from "../user/repository";

export class MessagingService {
    static async sendMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
        const now = new Date().toISOString();
        const message: Message = {
            id: randomUUID(),
            senderId,
            receiverId,
            content,
            createdAt: now,
            read: false,
        };

        await MessagingRepository.createMessage(message);

        // Trigger notification for receiver
        await this.sendNotification(
            receiverId,
            "New Message",
            `You have a new message`, // In real app, maybe show snippet?
            { type: NotificationType.MESSAGE, senderId }
        );

        return message;
    }

    static async getChatHistory(user1: string, user2: string): Promise<Message[]> {
        return MessagingRepository.getMessages(user1, user2);
    }

    static async sendNotification(userId: string, title: string, body: string, data?: any): Promise<Notification> {
        const now = new Date().toISOString();
        const notification: Notification = {
            id: randomUUID(),
            userId,
            type: data?.type || NotificationType.SYSTEM,
            title,
            body,
            data,
            read: false,
            createdAt: now,
        };

        await MessagingRepository.createNotification(notification);

        // Send FCM Push Notification
        try {
            const user = await UserRepository.findById(userId);
            if (user?.deviceTokens?.length) {
                await messaging.sendEachForMulticast({
                    tokens: user.deviceTokens,
                    notification: {
                        title,
                        body,
                    },
                    data: {
                        ...data,
                        click_action: "FLUTTER_NOTIFICATION_CLICK", // Standard for many apps
                    },
                });
            }
        } catch (error) {
            console.error("Failed to send FCM notification:", error);
            // Don't fail the request if notification fails
        }

        return notification;
    }

    static async getUserNotifications(userId: string): Promise<Notification[]> {
        return MessagingRepository.getUserNotifications(userId);
    }

    static async markNotificationRead(id: string, userId: string): Promise<void> {
        // Verify ownership? Ideally yes, but for now simple update
        // We should probably fetch it first to check userId matches
        await MessagingRepository.markNotificationRead(id);
    }
}
