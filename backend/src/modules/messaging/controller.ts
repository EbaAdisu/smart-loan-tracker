import { Elysia, t } from "elysia";
import { authMiddleware, type User } from "../auth/middleware";
import { MessagingService } from "./service";
import { CreateMessageSchema } from "./model";
import { UnauthorizedError } from "../../core/errors";

export const messagingController = new Elysia({ prefix: "/messages" })
    .use(authMiddleware)
    .post("/", async ({ user, body }: { user: User | null, body: typeof CreateMessageSchema.static }) => {
        if (!user) throw new UnauthorizedError();
        return MessagingService.sendMessage(user.uid, body.receiverId, body.content);
    }, {
        body: CreateMessageSchema,
        isAuth: true,
    })
    .get("/:userId", async ({ user, params: { userId } }: { user: User | null, params: { userId: string } }) => {
        if (!user) throw new UnauthorizedError();
        return MessagingService.getChatHistory(user.uid, userId);
    }, {
        isAuth: true,
    });

export const notificationController = new Elysia({ prefix: "/notifications" })
    .use(authMiddleware)
    .get("/", async ({ user }: { user: User | null }) => {
        if (!user) throw new UnauthorizedError();
        return MessagingService.getUserNotifications(user.uid);
    }, {
        isAuth: true,
    })
    .patch("/:id/read", async ({ user, params: { id } }: { user: User | null, params: { id: string } }) => {
        if (!user) throw new UnauthorizedError();
        await MessagingService.markNotificationRead(id, user.uid);
        return { success: true };
    }, {
        isAuth: true,
    });
