// Better Auth configuration
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";
import { env } from "./env";

let authInstance: any = null;

// Create Better Auth instance lazily (after DB connection)
export function initializeAuth() {
  if (!authInstance) {
    const client = mongoose.connection.getClient();
    if (!client) {
      throw new Error('MongoDB client not initialized. Call connectDatabase() first.');
    }

    authInstance = betterAuth({
      database: mongodbAdapter(client.db()),
      emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
      },
      secret: env.BETTER_AUTH_SECRET,
      baseURL: env.BETTER_AUTH_URL,
      trustedOrigins: env.CORS_ORIGIN.split(','),
      session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
      },
    });
  }
  return authInstance;
}

export const getAuth = () => {
  if (!authInstance) {
    throw new Error('Auth not initialized. Call initializeAuth() first.');
  }
  return authInstance;
};

// For type inference (these will be available after initialization)
export type Session = any;
export type User = any;

