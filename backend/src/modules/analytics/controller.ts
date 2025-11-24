import { Elysia } from "elysia";
import { authMiddleware, type User } from "../auth/middleware";
import { AnalyticsService } from "./service";
import { UnauthorizedError } from "../../core/errors";

export const analyticsController = new Elysia({ prefix: "/analytics" })
    .use(authMiddleware)
    .get("/me", async ({ user }: { user: User | null }) => {
        if (!user) throw new UnauthorizedError();
        return AnalyticsService.getUserStats(user.uid);
    }, {
        isAuth: true,
    })
    .get("/system", async ({ user }: { user: User | null }) => {
        if (!user) throw new UnauthorizedError();
        // TODO: Add Admin check here
        return AnalyticsService.getSystemStats();
    }, {
        isAuth: true,
    });
