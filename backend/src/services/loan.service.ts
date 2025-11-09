// Loan Service
import { Loan, LoanStatus, ILoan } from '../models/Loan';
import { Payment } from '../models/Payment';
import { NotFoundError, BadRequestError } from '../utils/errors';
import logger from '../utils/logger';

export interface CreateLoanData {
  lenderUserId: string;
  borrowerUserId: string;
  lenderName: string;
  borrowerName: string;
  amount: number;
  reason?: string;
  dueDate: Date;
}

export interface UpdateLoanData {
  amount?: number;
  reason?: string;
  dueDate?: Date;
  status?: LoanStatus;
  balanceRemaining?: number;
}

export class LoanService {
  // Create new loan
  async createLoan(data: CreateLoanData): Promise<ILoan> {
    try {
      const loan = new Loan({
        ...data,
        balanceRemaining: data.amount,
        status: LoanStatus.ACTIVE,
        dateCreated: new Date(),
      });

      await loan.save();
      logger.success(`Created loan: ${loan.loanId}`);
      return loan;
    } catch (error) {
      logger.error('Failed to create loan', error);
      throw error;
    }
  }

  // Get loan by ID
  async getLoanById(loanId: string): Promise<ILoan> {
    const loan = await Loan.findOne({ loanId });
    if (!loan) {
      throw new NotFoundError('Loan not found');
    }
    return loan;
  }

  // Get all loans for a user
  async getUserLoans(
    userId: string,
    filters?: {
      status?: LoanStatus;
      role?: 'lender' | 'borrower' | 'all';
    }
  ): Promise<ILoan[]> {
    const query: any = {};

    // Role filter
    if (filters?.role === 'lender') {
      query.lenderUserId = userId;
    } else if (filters?.role === 'borrower') {
      query.borrowerUserId = userId;
    } else {
      query.$or = [{ lenderUserId: userId }, { borrowerUserId: userId }];
    }

    // Status filter
    if (filters?.status) {
      query.status = filters.status;
    }

    const loans = await Loan.find(query).sort({ createdAt: -1 });
    return loans;
  }

  // Update loan
  async updateLoan(loanId: string, data: UpdateLoanData): Promise<ILoan> {
    const loan = await this.getLoanById(loanId);

    if (data.amount !== undefined) loan.amount = data.amount;
    if (data.reason !== undefined) loan.reason = data.reason;
    if (data.dueDate !== undefined) loan.dueDate = data.dueDate;
    if (data.status !== undefined) loan.status = data.status;
    if (data.balanceRemaining !== undefined) loan.balanceRemaining = data.balanceRemaining;

    await loan.save();
    logger.success(`Updated loan: ${loanId}`);
    return loan;
  }

  // Delete loan (soft delete by setting status to cancelled)
  async deleteLoan(loanId: string): Promise<void> {
    const loan = await this.getLoanById(loanId);
    loan.status = LoanStatus.CANCELLED;
    await loan.save();
    logger.success(`Deleted loan: ${loanId}`);
  }

  // Add payment to loan
  async addPayment(loanId: string, amount: number): Promise<ILoan> {
    const loan = await this.getLoanById(loanId);

    if (amount <= 0) {
      throw new BadRequestError('Payment amount must be positive');
    }

    if (amount > loan.balanceRemaining) {
      throw new BadRequestError('Payment amount exceeds remaining balance');
    }

    // Create payment record
    const payment = new Payment({
      loanId,
      amount,
      timestamp: new Date(),
    });
    await payment.save();

    // Update loan balance
    loan.updateBalance(amount);
    await loan.save();

    logger.success(`Added payment of ${amount} to loan: ${loanId}`);
    return loan;
  }

  // Get payment history for a loan
  async getPaymentHistory(loanId: string) {
    const payments = await Payment.find({ loanId }).sort({ timestamp: -1 });
    return payments;
  }

  // Check for overdue loans
  async checkOverdueLoans(): Promise<ILoan[]> {
    const now = new Date();
    const overdueLoans = await Loan.find({
      dueDate: { $lt: now },
      status: { $in: [LoanStatus.ACTIVE, LoanStatus.PENDING] },
    });

    // Update status to overdue
    for (const loan of overdueLoans) {
      loan.status = LoanStatus.OVERDUE;
      await loan.save();
    }

    return overdueLoans;
  }

  // Get loans due soon (within days)
  async getLoansDueSoon(days: number = 3): Promise<ILoan[]> {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const loans = await Loan.find({
      dueDate: { $gte: now, $lte: futureDate },
      status: LoanStatus.ACTIVE,
    });

    return loans;
  }

  // Calculate loan statistics for a user
  async getUserLoanStats(userId: string) {
    const loans = await this.getUserLoans(userId);

    const stats = {
      totalGiven: 0,
      totalReceived: 0,
      activeLoansCount: 0,
      completedLoansCount: 0,
      overdueLoansCount: 0,
      totalOutstanding: 0,
    };

    for (const loan of loans) {
      if (loan.lenderUserId === userId) {
        stats.totalGiven += loan.amount;
        if (loan.status !== LoanStatus.COMPLETED) {
          stats.totalOutstanding += loan.balanceRemaining;
        }
      } else {
        stats.totalReceived += loan.amount;
      }

      if (loan.status === LoanStatus.ACTIVE) stats.activeLoansCount++;
      if (loan.status === LoanStatus.COMPLETED) stats.completedLoansCount++;
      if (loan.status === LoanStatus.OVERDUE) stats.overdueLoansCount++;
    }

    stats.totalOutstanding = Math.round(stats.totalOutstanding * 100) / 100;

    return stats;
  }
}

export default new LoanService();

