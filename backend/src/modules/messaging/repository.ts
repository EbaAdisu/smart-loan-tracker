import { db } from "../../core/db/firebase";
import { Message, Notification } from "./model";

const MESSAGES_COLLECTION = "messages";
const NOTIFICATIONS_COLLECTION = "notifications";

export class MessagingRepository {
    static async createMessage(message: Message): Promise<Message> {
        await db.collection(MESSAGES_COLLECTION).doc(message.id).set(message);
        return message;
    }

    static async getMessages(user1: string, user2: string): Promise<Message[]> {
        // Firestore doesn't support logical OR in where clauses efficiently for this "chat room" style query easily without composite indexes or client-side merging.
        // A common pattern is to store a "chatId" (e.g., sorted(uid1, uid2).join('_')) on each message.
        // Let's assume we filter by chatId if we had it, or just query twice.
        // For simplicity and scalability, let's just query messages where (sender=u1 AND receiver=u2) OR (sender=u2 AND receiver=u1)

        const sent = await db.collection(MESSAGES_COLLECTION)
            .where("senderId", "==", user1)
            .where("receiverId", "==", user2)
            .get();

        const received = await db.collection(MESSAGES_COLLECTION)
            .where("senderId", "==", user2)
            .where("receiverId", "==", user1)
            .get();

        const messages: Message[] = [
            ...sent.docs.map(d => d.data() as Message),
            ...received.docs.map(d => d.data() as Message)
        ];

        // Sort by createdAt
        return messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    static async createNotification(notification: Notification): Promise<Notification> {
        await db.collection(NOTIFICATIONS_COLLECTION).doc(notification.id).set(notification);
        return notification;
    }

    static async getUserNotifications(userId: string): Promise<Notification[]> {
        const snapshot = await db.collection(NOTIFICATIONS_COLLECTION)
            .where("userId", "==", userId)
            .orderBy("createdAt", "desc")
            .get();
        return snapshot.docs.map(doc => doc.data() as Notification);
    }

    static async markNotificationRead(id: string): Promise<void> {
        await db.collection(NOTIFICATIONS_COLLECTION).doc(id).update({ read: true });
    }
}
