import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { client, getDatabase } from './mongodb';

// Create auth instance with MongoDB adapter
const createAuth = async () => {
  const db = await getDatabase();
  const mongoClient = await client;

  return betterAuth({
    database: mongodbAdapter(db, {
      client: mongoClient,
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
    },
    user: {
      additionalFields: {
        // Add any additional fields here if needed
      },
    },
    secret: process.env.BETTER_AUTH_SECRET,
  });
};

// Export the auth instance
export const auth = await createAuth();

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
