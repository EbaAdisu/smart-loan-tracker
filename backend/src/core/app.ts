import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { errorMiddleware } from "./middleware/error";
import { env } from "./config/env";
import { userRouter } from "../modules/user/router";
import { loanRouter } from "../modules/loan/router";
import { messagingRouter } from "../modules/messaging/router";
import { analyticsRouter } from "../modules/analytics/router";

export const createApp = () => {
    const app = new Elysia()
        .use(
            cors({
                origin: env.CORS_ORIGIN,
            })
        )
        .use(swagger())
        .use(errorMiddleware)
        .group("/api", (app) => app.use(userRouter).use(loanRouter).use(messagingRouter).use(analyticsRouter))
        .get("/health", () => ({ status: "ok", timestamp: new Date().toISOString() }));

    return app;
};
