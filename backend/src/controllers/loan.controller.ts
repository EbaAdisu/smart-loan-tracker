// Loan Controller
import loanService from '../services/loan.service';
import notificationService from '../services/notification.service';
import { LoanStatus } from '../models/Loan';
import logger from '../utils/logger';

export class LoanController {
  // Create new loan
  static async createLoan(
    userId: string,
    data: {
      lenderUserId: string;
      borrowerUserId: string;
      lenderName: string;
      borrowerName: string;
      amount: number;
      reason?: string;
      dueDate: Date;
    }
  ) {
    try {
      const loan = await loanService.createLoan(data);

      // Notify the other party
      const otherUserId = data.lenderUserId === userId ? data.borrowerUserId : data.lenderUserId;
      await notificationService.notifyStatusChange(
        otherUserId,
        loan.loanId,
        'A new loan has been created'
      );

      return {
        success: true,
        data: loan,
      };
    } catch (error: any) {
      logger.error('Error creating loan:', error);
      return {
        success: false,
        error: error.message || 'Failed to create loan',
      };
    }
  }

  // Get all loans for user
  static async getUserLoans(userId: string, filters: { status?: string; role?: string }) {
    try {
      const { status, role } = filters;
      const loans = await loanService.getUserLoans(userId, {
        status: status as LoanStatus | undefined,
        role: role as 'lender' | 'borrower' | 'all' | undefined,
      });

      return {
        success: true,
        data: loans,
      };
    } catch (error: any) {
      logger.error('Error getting user loans:', error);
      return {
        success: false,
        error: error.message || 'Failed to get loans',
      };
    }
  }

  // Get loan by ID
  static async getLoanById(loanId: string, userId: string) {
    try {
      const loan = await loanService.getLoanById(loanId);

      if (!loan) {
        return {
          success: false,
          error: 'Loan not found',
        };
      }

      // Check authorization
      if (loan.lenderUserId !== userId && loan.borrowerUserId !== userId) {
        return {
          success: false,
          error: 'Not authorized to view this loan',
        };
      }

      return {
        success: true,
        data: loan,
      };
    } catch (error: any) {
      logger.error('Error getting loan:', error);
      return {
        success: false,
        error: error.message || 'Failed to get loan',
      };
    }
  }

  // Update loan
  static async updateLoan(
    loanId: string,
    userId: string,
    data: {
      status?: LoanStatus;
      amount?: number;
      reason?: string;
      dueDate?: Date;
      balanceRemaining?: number;
    }
  ) {
    try {
      const loan = await loanService.getLoanById(loanId);

      if (!loan) {
        return {
          success: false,
          error: 'Loan not found',
        };
      }

      // Check authorization
      if (loan.lenderUserId !== userId && loan.borrowerUserId !== userId) {
        return {
          success: false,
          error: 'Not authorized to update this loan',
        };
      }

      const updateData = {
        ...data,
        dueDate: data.dueDate,
      };
      const updatedLoan = await loanService.updateLoan(loanId, updateData);

      // Notify the other party
      const otherUserId = loan.lenderUserId === userId ? loan.borrowerUserId : loan.lenderUserId;
      if (data.status) {
        await notificationService.notifyStatusChange(
          otherUserId,
          loanId,
          `Loan status changed to ${data.status}`
        );
      }

      return {
        success: true,
        data: updatedLoan,
      };
    } catch (error: any) {
      logger.error('Error updating loan:', error);
      return {
        success: false,
        error: error.message || 'Failed to update loan',
      };
    }
  }

  // Accept loan request
  static async acceptLoan(loanId: string, userId: string) {
    try {
      const loan = await loanService.getLoanById(loanId);

      if (!loan) {
        return {
          success: false,
          error: 'Loan not found',
        };
      }

      // Only borrower can accept
      if (loan.borrowerUserId !== userId) {
        return {
          success: false,
          error: 'Only borrower can accept loan',
        };
      }

      if (loan.status !== LoanStatus.PENDING) {
        return {
          success: false,
          error: 'Loan is not pending',
        };
      }

      const updatedLoan = await loanService.updateLoan(loanId, {
        status: LoanStatus.ACTIVE,
      });

      // Notify lender
      await notificationService.notifyStatusChange(
        loan.lenderUserId,
        loanId,
        'Loan has been accepted'
      );

      return {
        success: true,
        data: updatedLoan,
      };
    } catch (error: any) {
      logger.error('Error accepting loan:', error);
      return {
        success: false,
        error: error.message || 'Failed to accept loan',
      };
    }
  }

  // Record payment
  static async recordPayment(loanId: string, userId: string, amount: number) {
    try {
      const loan = await loanService.getLoanById(loanId);

      if (!loan) {
        return {
          success: false,
          error: 'Loan not found',
        };
      }

      // Check authorization
      if (loan.lenderUserId !== userId && loan.borrowerUserId !== userId) {
        return {
          success: false,
          error: 'Not authorized to record payment for this loan',
        };
      }

      await loanService.addPayment(loanId, amount);
      const payments = await loanService.getPaymentHistory(loanId);
      const payment = payments[0]; // Get the most recent payment

      // Notify the other party
      const otherUserId = loan.lenderUserId === userId ? loan.borrowerUserId : loan.lenderUserId;
      await notificationService.notifyPaymentReceived(
        otherUserId,
        loanId,
        amount
      );

      return {
        success: true,
        data: payment,
      };
    } catch (error: any) {
      logger.error('Error recording payment:', error);
      return {
        success: false,
        error: error.message || 'Failed to record payment',
      };
    }
  }

  // Get payment history
  static async getPaymentHistory(loanId: string, userId: string) {
    try {
      const loan = await loanService.getLoanById(loanId);

      if (!loan) {
        return {
          success: false,
          error: 'Loan not found',
        };
      }

      // Check authorization
      if (loan.lenderUserId !== userId && loan.borrowerUserId !== userId) {
        return {
          success: false,
          error: 'Not authorized to view payment history',
        };
      }

      const payments = await loanService.getPaymentHistory(loanId);

      return {
        success: true,
        data: payments,
      };
    } catch (error: any) {
      logger.error('Error getting payment history:', error);
      return {
        success: false,
        error: error.message || 'Failed to get payment history',
      };
    }
  }

  // Delete loan
  static async deleteLoan(loanId: string, userId: string) {
    try {
      const loan = await loanService.getLoanById(loanId);

      if (!loan) {
        return {
          success: false,
          error: 'Loan not found',
        };
      }

      // Check authorization
      if (loan.lenderUserId !== userId && loan.borrowerUserId !== userId) {
        return {
          success: false,
          error: 'Not authorized to delete this loan',
        };
      }

      await loanService.deleteLoan(loanId);

      return {
        success: true,
        message: 'Loan deleted successfully',
      };
    } catch (error: any) {
      logger.error('Error deleting loan:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete loan',
      };
    }
  }
}

export default LoanController;

