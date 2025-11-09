// Global Error Handler Middleware (Last Defense)
import { Elysia } from 'elysia';
import { AppError, formatErrorResponse } from '../utils/errors';
import logger from '../utils/logger';
import { env } from '../config/env';

export const errorMiddleware = new Elysia({ name: 'error-handler' })
    .onError(({ code, error, set, request }) => {
        // Log error with context
        const path = request.url;
        const method = request.method;

        logger.error(`[${method}] ${path} - Error [${code}]:`, error);

        // Handle AppError instances (our custom errors)
        if (error instanceof AppError) {
            set.status = error.statusCode;
            return formatErrorResponse(error);
        }

        // Handle Elysia built-in errors
        if (code === 'NOT_FOUND') {
            set.status = 404;
            return {
                success: false,
                error: {
                    message: 'Endpoint not found',
                    statusCode: 404,
                    code: 'NOT_FOUND',
                },
            };
        }

        if (code === 'VALIDATION') {
            set.status = 422;
            return {
                success: false,
                error: {
                    message: 'Validation failed',
                    statusCode: 422,
                    code: 'VALIDATION',
                    details: error,
                },
            };
        }

        if (code === 'PARSE') {
            set.status = 400;
            return {
                success: false,
                error: {
                    message: 'Invalid request format',
                    statusCode: 400,
                    code: 'PARSE_ERROR',
                },
            };
        }

        // Handle database errors
        if (error instanceof Error && error.message.includes('Mongo')) {
            set.status = 500;
            logger.error('Database error:', error);
            return {
                success: false,
                error: {
                    message: env.NODE_ENV === 'production'
                        ? 'Database error occurred'
                        : error.message,
                    statusCode: 500,
                    code: 'DatabaseError',
                },
            };
        }

        // Handle unknown errors
        set.status = 500;
        logger.error('Unknown error:', error);

        return {
            success: false,
            error: {
                message: env.NODE_ENV === 'production'
                    ? 'An unexpected error occurred'
                    : error instanceof Error ? error.message : 'Unknown error',
                statusCode: 500,
                code: 'InternalServerError',
                ...(env.NODE_ENV === 'development' && error instanceof Error && {
                    stack: error.stack,
                }),
            },
        };
    });

export default errorMiddleware;

