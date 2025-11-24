import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.string().default("3000"),
    // Firebase Service Account (JSON string or individual fields)
    FIREBASE_SERVICE_ACCOUNT: z.string().optional(),
    FIREBASE_PROJECT_ID: z.string().optional(),
    FIREBASE_CLIENT_EMAIL: z.string().optional(),
    FIREBASE_PRIVATE_KEY: z.string().optional(),
    CORS_ORIGIN: z.string().default("*"),
});

export const env = envSchema.parse(process.env);
