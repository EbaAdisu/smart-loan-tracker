// Request Logger Middleware - Logs all incoming requests and responses
import { Elysia } from 'elysia';
import logger from '../utils/logger';

export const requestLoggerMiddleware = new Elysia({ name: 'request-logger' })
  .onRequest(({ request, set }) => {
    const method = request.method;
    const url = new URL(request.url);
    const path = url.pathname;
    const query = url.search;
    const timestamp = new Date().toISOString();

    // Log incoming request
    logger.info(`[${method}] ${path}${query ? query : ''} - ${timestamp}`);
  })
  .onAfterHandle(({ request, response, set }) => {
    const method = request.method;
    const url = new URL(request.url);
    const path = url.pathname;
    const status = typeof set.status === 'number' ? set.status : 200;

    // Log response
    logger.info(`[${method}] ${path} - ${status} ${status >= 200 && status < 300 ? '✓' : '✗'}`);
  });

export default requestLoggerMiddleware;

