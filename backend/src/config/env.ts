// Environment variable configuration
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().min(1, 'MongoDB URI is required'),
  BETTER_AUTH_SECRET: z.string().min(32, 'Better Auth secret must be at least 32 characters'),
  BETTER_AUTH_URL: z.string().url('Valid URL required for Better Auth'),
  EXPO_ACCESS_TOKEN: z.string().optional(),
  CORS_ORIGIN: z.string().default('*'),
});

// Parse and validate environment variables
function loadEnv() {
  try {
    const env = {
      PORT: process.env.PORT || '3000',
      NODE_ENV: process.env.NODE_ENV || 'development',
      MONGODB_URI: process.env.MONGODB_URI || '',
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || '',
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
      EXPO_ACCESS_TOKEN: process.env.EXPO_ACCESS_TOKEN,
      CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
    };

    return envSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

export const env = loadEnv();

export default env;

