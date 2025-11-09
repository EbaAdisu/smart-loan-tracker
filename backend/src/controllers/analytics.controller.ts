// Analytics Controller
import analyticsService from '../services/analytics.service';
import logger from '../utils/logger';

export class AnalyticsController {
  // Get overall summary
  static async getSummary(context: any) {
    const { user, set } = context;

    try {
      const summary = await analyticsService.getSummary(user.id);
      set.status = 200;
      return {
        success: true,
        data: summary,
      };
    } catch (error: any) {
      logger.error('Error getting analytics summary:', error);
      set.status = 500;
      return {
        success: false,
        error: error.message || 'Failed to get analytics summary',
      };
    }
  }

  // Get monthly breakdown
  static async getMonthlyBreakdown(context: any) {
    const { user, query, set } = context;

    try {
      // Validate month format (YYYY-MM)
      const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
      if (!monthRegex.test(query.month)) {
        set.status = 400;
        return {
          success: false,
          error: 'Invalid month format. Use YYYY-MM',
        };
      }

      const breakdown = await analyticsService.getMonthlyBreakdown(user.id, query.month);
      set.status = 200;
      return {
        success: true,
        data: breakdown,
      };
    } catch (error: any) {
      logger.error('Error getting monthly breakdown:', error);
      set.status = 500;
      return {
        success: false,
        error: error.message || 'Failed to get monthly breakdown',
      };
    }
  }

  // Get yearly summary
  static async getYearlySummary(context: any) {
    const { user, query, set } = context;

    try {
      const yearNum = parseInt(query.year);
      if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
        set.status = 400;
        return {
          success: false,
          error: 'Invalid year',
        };
      }

      const summary = await analyticsService.getYearlySummary(user.id, yearNum);
      set.status = 200;
      return {
        success: true,
        data: summary,
      };
    } catch (error: any) {
      logger.error('Error getting yearly summary:', error);
      set.status = 500;
      return {
        success: false,
        error: error.message || 'Failed to get yearly summary',
      };
    }
  }

  // Get category breakdown
  static async getCategoryBreakdown(context: any) {
    const { user, set } = context;

    try {
      const categories = await analyticsService.getCategoryBreakdown(user.id);
      set.status = 200;
      return {
        success: true,
        data: categories,
      };
    } catch (error: any) {
      logger.error('Error getting category breakdown:', error);
      set.status = 500;
      return {
        success: false,
        error: error.message || 'Failed to get category breakdown',
      };
    }
  }
}

export default AnalyticsController;
