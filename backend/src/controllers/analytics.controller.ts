// Analytics Controller
import analyticsService from '../services/analytics.service';
import { asyncHandler, BadRequestError } from '../utils/errors';

export class AnalyticsController {
  // Get overall summary
  static getSummary = asyncHandler(async (context: any) => {
    const { user } = context;

    const summary = await analyticsService.getSummary(user.id);
    return {
      success: true,
      data: summary,
    };
  });

  // Get monthly breakdown
  static getMonthlyBreakdown = asyncHandler(async (context: any) => {
    const { user, query } = context;

    // Validate month format (YYYY-MM)
    const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
    if (!monthRegex.test(query.month)) {
      throw new BadRequestError('Invalid month format. Use YYYY-MM');
    }

    const breakdown = await analyticsService.getMonthlyBreakdown(user.id, query.month);
    return {
      success: true,
      data: breakdown,
    };
  });

  // Get yearly summary
  static getYearlySummary = asyncHandler(async (context: any) => {
    const { user, query } = context;

    const yearNum = parseInt(query.year);
    if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
      throw new BadRequestError('Invalid year');
    }

    const summary = await analyticsService.getYearlySummary(user.id, yearNum);
    return {
      success: true,
      data: summary,
    };
  });

  // Get category breakdown
  static getCategoryBreakdown = asyncHandler(async (context: any) => {
    const { user } = context;

    const categories = await analyticsService.getCategoryBreakdown(user.id);
    return {
      success: true,
      data: categories,
    };
  });
}

export default AnalyticsController;
