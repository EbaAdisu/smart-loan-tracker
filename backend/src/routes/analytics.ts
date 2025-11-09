// Analytics routes
import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middleware/auth.middleware';
import AnalyticsController from '../controllers/analytics.controller';

export const analyticsRoutes = new Elysia({ prefix: '/analytics' })
  .use(authMiddleware)

  // Get overall summary
  .get('/summary', async (context: any) => {
    return AnalyticsController.getSummary(context);
  })

  // Get monthly breakdown
  .get(
    '/monthly',
    async (context: any) => {
      return AnalyticsController.getMonthlyBreakdown(context);
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
      return AnalyticsController.getYearlySummary(context);
    },
    {
      query: t.Object({
        year: t.String({ pattern: '^\\d{4}$' }),
      }),
    }
  )

  // Get category breakdown
  .get('/categories', async (context: any) => {
    return AnalyticsController.getCategoryBreakdown(context);
  });

export default analyticsRoutes;
