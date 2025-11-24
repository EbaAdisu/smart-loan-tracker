import { Elysia } from "elysia";
import { authMiddleware } from "../auth/middleware";
import { UserService } from "./service";
import { CreateUserSchema, UpdateUserSchema } from "./model";
import { UnauthorizedError } from "../../core/errors";

export const userController = new Elysia({ prefix: "/users" })
    .use(authMiddleware)
    .get("/me", async ({ user }) => {
        if (!user) throw new UnauthorizedError();
        return UserService.getProfile(user.uid);
    }, {
        isAuth: true,
    })
    .post("/sync", async ({ user, body }) => {
        if (!user) throw new UnauthorizedError();
        return UserService.syncProfile(user.uid, user.email || "", body);
    }, {
        body: CreateUserSchema,
        isAuth: true,
    })
    .patch("/me", async ({ user, body }) => {
        if (!user) throw new UnauthorizedError();
        if (body.deviceToken) {
            await UserService.addDeviceToken(user.uid, body.deviceToken);
        }
        await UserService.updateProfile(user.uid, body);
        return { success: true };
    }, {
        body: UpdateUserSchema,
        isAuth: true,
    });
