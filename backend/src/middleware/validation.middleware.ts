// Request validation middleware using Zod
import { Elysia, t } from 'elysia';
import { ValidationError } from '../utils/errors';

// Common validation schemas
export const schemas = {
  // Pagination
  pagination: t.Object({
    page: t.Optional(t.Number({ minimum: 1, default: 1 })),
    limit: t.Optional(t.Number({ minimum: 1, maximum: 100, default: 20 })),
  }),

  // MongoDB ObjectId
  objectId: t.String({ minLength: 24, maxLength: 24, pattern: '^[a-f\\d]{24}$' }),

  // Date
  dateString: t.String({ format: 'date-time' }),

  // Search query
  searchQuery: t.Object({
    q: t.String({ minLength: 1 }),
  }),
};

// Validation error handler
export const validationMiddleware = new Elysia({ name: 'validation' })
  .onError(({ code, error, set }) => {
    if (code === 'VALIDATION') {
      set.status = 422;
      
      return {
        success: false,
        error: {
          message: 'Validation failed',
          statusCode: 422,
          details: error,
        },
      };
    }
  });

