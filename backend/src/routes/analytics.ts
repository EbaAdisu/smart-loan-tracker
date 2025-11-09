// Analytics routes
import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middleware/auth.middleware';
import AnalyticsController from '../controllers/analytics.controller';

export const analyticsRoutes = new Elysia({ prefix: '/analytics' })
  .use(authMiddleware)

  // Get overall summary
  .get('/summary', async (context: any) => {
    const { user } = context;
    return AnalyticsController.getSummary(user.id);
  })

  // Get monthly breakdown
  .get(
    '/monthly',
    async (context: any) => {
      const { user, query, set } = context;
      const result = await AnalyticsController.getMonthlyBreakdown(user.id, query.month);

      if (!result.success) {
        set.status = 400;
      }

      return result;
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
      const result = await AnalyticsController.getYearlySummary(user.id, query.year);

      if (!result.success) {
        set.status = 400;
      }

      return result;
    },
    {
      query: t.Object({
        year: t.String({ pattern: '^\\d{4}$' }),
      }),
    }
  )

  // Get category breakdown
  .get('/categories', async (context: any) => {
    const { user } = context;
    return AnalyticsController.getCategoryBreakdown(user.id);
  });

export default analyticsRoutes;
