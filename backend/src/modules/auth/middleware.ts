import { Elysia } from "elysia";
import { auth } from "../../core/db/firebase";
import { UnauthorizedError } from "../../core/errors";

export interface User {
    uid: string;
    email?: string;
    picture?: string;
}

export const authMiddleware = (app: Elysia) =>
    app.derive(async ({ headers }) => {
        const authHeader = headers["authorization"];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return { user: null };
        }

        const token = authHeader.split("Bearer ")[1];

        try {
            const decodedToken = await auth.verifyIdToken(token);
            const user: User = {
                uid: decodedToken.uid,
                email: decodedToken.email,
                picture: decodedToken.picture,
            };
            return { user };
        } catch (error) {
            // Token is invalid or expired, but we don't throw here to allow optional auth routes.
            // Protected routes should check if user is present.
            return { user: null };
        }
    })
        .macro(({ onBeforeHandle }) => ({
            isAuth(enabled: boolean) {
                if (!enabled) return;
                onBeforeHandle(({ user }: { user: User | null }) => {
                    if (!user) {
                        throw new UnauthorizedError();
                    }
                });
            },
        }));
