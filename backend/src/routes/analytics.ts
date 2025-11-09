// Analytics routes
import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middleware/auth.middleware';
import analyticsService from '../services/analytics.service';

export const analyticsRoutes = new Elysia({ prefix: '/analytics' })
  .use(authMiddleware)

  // Get overall summary
  .get('/summary', async (context: any) => {
    try {
      const { user } = context;
      const summary = await analyticsService.getSummary(user.id);

      return {
        success: true,
        data: summary,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get analytics summary',
      };
    }
  })

  // Get monthly breakdown
  .get(
    '/monthly',
    async (context: any) => {
      const { user, query, set } = context;
      try {
        const { month } = query;

        // Validate month format (YYYY-MM)
        const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
        if (!monthRegex.test(month)) {
          set.status = 400;
          return {
            success: false,
            error: 'Invalid month format. Use YYYY-MM',
          };
        }

        const breakdown = await analyticsService.getMonthlyBreakdown(user.id, month);

        return {
          success: true,
          data: breakdown,
        };
      } catch (error: any) {
        set.status = 400;
        return {
          success: false,
          error: error.message || 'Failed to get monthly breakdown',
        };
      }
    },
    {
      query: t.Object({
        month: t.String({ pattern: '^\\d{4}-(0[1-9]|1[0-2])$' }),
      }),
    }
  )

  // Get yearly summary
  .get(
    '/yearly',
    async (context: any) => {
      const { user, query, set } = context;
      try {
        const { year } = query;

        const yearNum = parseInt(year);
        if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
          set.status = 400;
          return {
            success: false,
            error: 'Invalid year',
          };
        }

        const summary = await analyticsService.getYearlySummary(user.id, yearNum);

        return {
          success: true,
          data: summary,
        };
      } catch (error: any) {
        set.status = 400;
        return {
          success: false,
          error: error.message || 'Failed to get yearly summary',
        };
      }
    },
    {
      query: t.Object({
        year: t.String({ pattern: '^\\d{4}$' }),
      }),
    }
  )

  // Get category breakdown
  .get('/categories', async (context: any) => {
    try {
      const { user } = context;
      const categories = await analyticsService.getCategoryBreakdown(user.id);

      return {
        success: true,
        data: categories,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get category breakdown',
      };
    }
  });

export default analyticsRoutes;

