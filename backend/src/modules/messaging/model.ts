import { t } from "elysia";

export const MessageSchema = t.Object({
    id: t.String(),
    senderId: t.String(),
    receiverId: t.String(),
    content: t.String(),
    createdAt: t.String({ format: "date-time" }),
    read: t.Boolean(),
});

export type Message = typeof MessageSchema.static;

export const CreateMessageSchema = t.Object({
    receiverId: t.String(),
    content: t.String({ minLength: 1 }),
});

export const NotificationType = {
    LOAN_REQUEST: "LOAN_REQUEST",
    PAYMENT_RECEIVED: "PAYMENT_RECEIVED",
    MESSAGE: "MESSAGE",
    SYSTEM: "SYSTEM",
} as const;

export type NotificationTypeEnum = typeof NotificationType[keyof typeof NotificationType];

export const NotificationSchema = t.Object({
    id: t.String(),
    userId: t.String(),
    type: t.String(), // Enum: LOAN_REQUEST, PAYMENT_RECEIVED, MESSAGE, SYSTEM
    title: t.String(),
    body: t.String(),
    data: t.Optional(t.Any()), // JSON data for navigation/context
    read: t.Boolean(),
    createdAt: t.String({ format: "date-time" }),
});

export type Notification = typeof NotificationSchema.static;
