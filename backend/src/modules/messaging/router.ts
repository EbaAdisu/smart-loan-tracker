import { messagingController, notificationController } from "./controller";
import { Elysia } from "elysia";

export const messagingRouter = new Elysia()
    .use(messagingController)
    .use(notificationController);
