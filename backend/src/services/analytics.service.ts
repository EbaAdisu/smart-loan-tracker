// Analytics Service
import { Loan, LoanStatus } from '../models/Loan';
import { Payment } from '../models/Payment';

export interface AnalyticsSummary {
  totalGiven: number;
  totalReceived: number;
  netPosition: number;
  activeLoansCount: number;
  completedLoansCount: number;
  totalOutstanding: number;
  averageLoanAmount: number;
}

export interface MonthlyBreakdown {
  month: string;
  totalGiven: number;
  totalReceived: number;
  loansGiven: number;
  loansReceived: number;
  paymentsReceived: number;
  paymentsMade: number;
}

export interface CategoryBreakdown {
  reason: string;
  count: number;
  totalAmount: number;
}

export class AnalyticsService {
  // Get overall summary for a user
  async getSummary(userId: string): Promise<AnalyticsSummary> {
    const loans = await Loan.find({
      $or: [{ lenderUserId: userId }, { borrowerUserId: userId }],
    });

    let totalGiven = 0;
    let totalReceived = 0;
    let activeLoansCount = 0;
    let completedLoansCount = 0;
    let totalOutstanding = 0;
    let totalLoanAmount = 0;
    let loanCount = 0;

    for (const loan of loans) {
      if (loan.lenderUserId === userId) {
        totalGiven += loan.amount;
        if (loan.status !== LoanStatus.COMPLETED && loan.status !== LoanStatus.CANCELLED) {
          totalOutstanding += loan.balanceRemaining;
        }
      } else {
        totalReceived += loan.amount;
      }

      if (loan.status === LoanStatus.ACTIVE || loan.status === LoanStatus.OVERDUE) {
        activeLoansCount++;
      }
      if (loan.status === LoanStatus.COMPLETED) {
        completedLoansCount++;
      }

      totalLoanAmount += loan.amount;
      loanCount++;
    }

    const netPosition = totalGiven - totalReceived;
    const averageLoanAmount = loanCount > 0 ? totalLoanAmount / loanCount : 0;

    return {
      totalGiven: Math.round(totalGiven * 100) / 100,
      totalReceived: Math.round(totalReceived * 100) / 100,
      netPosition: Math.round(netPosition * 100) / 100,
      activeLoansCount,
      completedLoansCount,
      totalOutstanding: Math.round(totalOutstanding * 100) / 100,
      averageLoanAmount: Math.round(averageLoanAmount * 100) / 100,
    };
  }

  // Get monthly breakdown
  async getMonthlyBreakdown(userId: string, month: string): Promise<MonthlyBreakdown> {
    // Parse month string (format: YYYY-MM)
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59);

    const loans = await Loan.find({
      $or: [{ lenderUserId: userId }, { borrowerUserId: userId }],
      dateCreated: { $gte: startDate, $lte: endDate },
    });

    let totalGiven = 0;
    let totalReceived = 0;
    let loansGiven = 0;
    let loansReceived = 0;

    for (const loan of loans) {
      if (loan.lenderUserId === userId) {
        totalGiven += loan.amount;
        loansGiven++;
      } else {
        totalReceived += loan.amount;
        loansReceived++;
      }
    }

    // Get payments for this month
    const payments = await Payment.find({
      timestamp: { $gte: startDate, $lte: endDate },
    });

    let paymentsReceived = 0;
    let paymentsMade = 0;

    for (const payment of payments) {
      const loan = await Loan.findOne({ loanId: payment.loanId });
      if (loan) {
        if (loan.lenderUserId === userId) {
          paymentsReceived++;
        } else {
          paymentsMade++;
        }
      }
    }

    return {
      month,
      totalGiven: Math.round(totalGiven * 100) / 100,
      totalReceived: Math.round(totalReceived * 100) / 100,
      loansGiven,
      loansReceived,
      paymentsReceived,
      paymentsMade,
    };
  }

  // Get yearly summary
  async getYearlySummary(userId: string, year: number) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const loans = await Loan.find({
      $or: [{ lenderUserId: userId }, { borrowerUserId: userId }],
      dateCreated: { $gte: startDate, $lte: endDate },
    });

    const monthlyData: { [key: string]: MonthlyBreakdown } = {};

    for (let month = 1; month <= 12; month++) {
      const monthKey = `${year}-${String(month).padStart(2, '0')}`;
      monthlyData[monthKey] = {
        month: monthKey,
        totalGiven: 0,
        totalReceived: 0,
        loansGiven: 0,
        loansReceived: 0,
        paymentsReceived: 0,
        paymentsMade: 0,
      };
    }

    for (const loan of loans) {
      const loanMonth = `${loan.dateCreated.getFullYear()}-${String(
        loan.dateCreated.getMonth() + 1
      ).padStart(2, '0')}`;

      if (monthlyData[loanMonth]) {
        if (loan.lenderUserId === userId) {
          monthlyData[loanMonth].totalGiven += loan.amount;
          monthlyData[loanMonth].loansGiven++;
        } else {
          monthlyData[loanMonth].totalReceived += loan.amount;
          monthlyData[loanMonth].loansReceived++;
        }
      }
    }

    return Object.values(monthlyData);
  }

  // Get breakdown by category/reason
  async getCategoryBreakdown(userId: string): Promise<CategoryBreakdown[]> {
    const loans = await Loan.find({
      $or: [{ lenderUserId: userId }, { borrowerUserId: userId }],
    });

    const categories: { [key: string]: CategoryBreakdown } = {};

    for (const loan of loans) {
      const reason = loan.reason || 'Uncategorized';

      if (!categories[reason]) {
        categories[reason] = {
          reason,
          count: 0,
          totalAmount: 0,
        };
      }

      categories[reason].count++;
      categories[reason].totalAmount += loan.amount;
    }

    return Object.values(categories)
      .map((cat) => ({
        ...cat,
        totalAmount: Math.round(cat.totalAmount * 100) / 100,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);
  }
}

export default new AnalyticsService();

