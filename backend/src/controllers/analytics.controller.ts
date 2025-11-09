// Analytics Controller
import analyticsService from '../services/analytics.service';
import logger from '../utils/logger';

export class AnalyticsController {
  // Get overall summary
  static async getSummary(userId: string) {
    try {
      const summary = await analyticsService.getSummary(userId);
      return {
        success: true,
        data: summary,
      };
    } catch (error: any) {
      logger.error('Error getting analytics summary:', error);
      return {
        success: false,
        error: error.message || 'Failed to get analytics summary',
      };
    }
  }

  // Get monthly breakdown
  static async getMonthlyBreakdown(userId: string, month: string) {
    try {
      // Validate month format (YYYY-MM)
      const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
      if (!monthRegex.test(month)) {
        return {
          success: false,
          error: 'Invalid month format. Use YYYY-MM',
        };
      }

      const breakdown = await analyticsService.getMonthlyBreakdown(userId, month);
      return {
        success: true,
        data: breakdown,
      };
    } catch (error: any) {
      logger.error('Error getting monthly breakdown:', error);
      return {
        success: false,
        error: error.message || 'Failed to get monthly breakdown',
      };
    }
  }

  // Get yearly summary
  static async getYearlySummary(userId: string, year: string) {
    try {
      const yearNum = parseInt(year);
      if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
        return {
          success: false,
          error: 'Invalid year',
        };
      }

      const summary = await analyticsService.getYearlySummary(userId, yearNum);
      return {
        success: true,
        data: summary,
      };
    } catch (error: any) {
      logger.error('Error getting yearly summary:', error);
      return {
        success: false,
        error: error.message || 'Failed to get yearly summary',
      };
    }
  }

  // Get category breakdown
  static async getCategoryBreakdown(userId: string) {
    try {
      const categories = await analyticsService.getCategoryBreakdown(userId);
      return {
        success: true,
        data: categories,
      };
    } catch (error: any) {
      logger.error('Error getting category breakdown:', error);
      return {
        success: false,
        error: error.message || 'Failed to get category breakdown',
      };
    }
  }
}

export default AnalyticsController;

