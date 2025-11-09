// Main entry point for the Elysia.js backend
import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { env } from './config/env';
import { connectDatabase } from './config/database';
import { validationMiddleware } from './middleware/validation.middleware';
import logger from './utils/logger';
import CronJobs from './jobs/cron';
import { createServer } from 'http';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import loanRoutes from './routes/loans';
import analyticsRoutes from './routes/analytics';
import messageRoutes from './routes/messages';
import notificationRoutes from './routes/notifications';
import websocketHandler from './websocket/handler';

// Create Elysia app
const app = new Elysia()
  .use(
    cors({
      origin: env.CORS_ORIGIN.split(','),
      credentials: true,
    })
  )
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Smart Loan Tracker API',
          version: '1.0.0',
          description: 'Backend API for Smart Loan Tracker - Elysia.js + MongoDB + Better Auth',
        },
        tags: [
          { name: 'Auth', description: 'Authentication endpoints' },
          { name: 'Users', description: 'User management endpoints' },
          { name: 'Loans', description: 'Loan management endpoints' },
          { name: 'Analytics', description: 'Analytics and statistics endpoints' },
          { name: 'Messages', description: 'Messaging endpoints' },
          { name: 'Notifications', description: 'Notification endpoints' },
        ],
      },
    })
  )
  .use(validationMiddleware)

  // Health check endpoint
  .get('/', () => ({
    success: true,
    message: 'Smart Loan Tracker API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  }))

  .get('/health', () => ({
    success: true,
    status: 'healthy',
    database: 'connected',
    timestamp: new Date().toISOString(),
  }))

  // API routes
  .group('/api', (app) =>
    app
      .use(authRoutes)
      .use(userRoutes)
      .use(loanRoutes)
      .use(analyticsRoutes)
      .use(messageRoutes)
      .use(notificationRoutes)
  )

  // WebSocket
  .use(websocketHandler)

  // Global error handler
  .onError(({ code, error, set }) => {
    logger.error(`Error [${code}]:`, error);

    if (code === 'NOT_FOUND') {
      set.status = 404;
      return {
        success: false,
        error: 'Endpoint not found',
      };
    }

    if (code === 'VALIDATION') {
      set.status = 422;
      return {
        success: false,
        error: 'Validation failed',
        details: error,
      };
    }

    set.status = 500;
    return {
      success: false,
      error: 'Internal server error',
    };
  });

// Start server
async function startServer() {
  try {
    // Connect to database
    await connectDatabase();

    // Initialize Better Auth after DB connection
    const { initializeAuth } = await import('./config/auth');
    initializeAuth();
    logger.info('✅ Better Auth initialized');

    // Start cron jobs
    CronJobs.startAll();

    // Create HTTP server with Elysia fetch handler
    const server = createServer(async (req, res) => {
      const response = await app.fetch(new Request(`http://${req.headers.host}${req.url}`, {
        method: req.method,
        headers: req.headers as Record<string, string>,
        body: req.method !== 'GET' && req.method !== 'HEAD' ? (req as any) : undefined,
      }));

      res.statusCode = response.status;
      response.headers.forEach((value: string, key: string) => {
        res.setHeader(key, value);
      });

      const buffer = await response.arrayBuffer();
      res.end(Buffer.from(buffer));
    });

    server.listen(parseInt(env.PORT), () => {
      logger.success(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   🚀 Smart Loan Tracker Backend Started!              ║
║                                                        ║
║   Server:     http://localhost:${env.PORT}                    ║
║   Swagger:    http://localhost:${env.PORT}/swagger           ║
║   WebSocket:  ws://localhost:${env.PORT}/ws                  ║
║   Environment: ${env.NODE_ENV}                          ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    logger.error('Failed to start server');
    console.error('Error details:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully...');
  CronJobs.stopAll();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Shutting down gracefully...');
  CronJobs.stopAll();
  process.exit(0);
});

// Start the server
startServer();

export default app;

