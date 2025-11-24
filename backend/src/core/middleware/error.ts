import { Elysia } from "elysia";
import { AppError } from "../errors";

export const errorMiddleware = new Elysia()
    .error({
        AppError,
    })
    .onError(({ code, error, set }) => {
        if (code === "AppError") {
            set.status = error.statusCode;
            return {
                success: false,
                error: {
                    message: error.message,
                    code: error.code,
                },
            };
        }

        console.error("Unhandled Error:", error);

        set.status = 500;
        return {
            success: false,
            error: {
                message: "Internal Server Error",
                code: "INTERNAL_SERVER_ERROR",
            },
        };
    });
