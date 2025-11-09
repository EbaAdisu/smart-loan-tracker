// Loan Controller
import loanService from '../services/loan.service';
import notificationService from '../services/notification.service';
import { LoanStatus } from '../models/Loan';
import logger from '../utils/logger';

export class LoanController {
  // Create new loan
  static async createLoan(context: any) {
    const { user, body, set } = context;

    try {
      const loan = await loanService.createLoan({
        lenderUserId: body.lenderUserId,
        borrowerUserId: body.borrowerUserId,
        lenderName: body.lenderName,
        borrowerName: body.borrowerName,
        amount: body.amount,
        reason: body.reason,
        dueDate: new Date(body.dueDate),
      });

      // Notify the other party
      const otherUserId = body.lenderUserId === user.id ? body.borrowerUserId : body.lenderUserId;
      await notificationService.notifyStatusChange(
        otherUserId,
        loan.loanId,
        'A new loan has been created'
      );

      set.status = 201;
      return {
        success: true,
        data: loan,
      };
    } catch (error: any) {
      logger.error('Error creating loan:', error);
      set.status = 500;
      return {
        success: false,
        error: error.message || 'Failed to create loan',
      };
    }
  }

  // Get all loans for user
  static async getUserLoans(context: any) {
    const { user, query, set } = context;

    try {
      const loans = await loanService.getUserLoans(user.id, {
        status: query.status as LoanStatus | undefined,
        role: query.role as 'lender' | 'borrower' | 'all' | undefined,
      });

      set.status = 200;
      return {
        success: true,
        data: loans,
      };
    } catch (error: any) {
      logger.error('Error getting user loans:', error);
      set.status = 500;
      return {
        success: false,
        error: error.message || 'Failed to get loans',
      };
    }
  }

  // Get loan by ID
  static async getLoanById(context: any) {
    const { user, params, set } = context;

    try {
      const loan = await loanService.getLoanById(params.loanId);

      if (!loan) {
        set.status = 404;
        return {
          success: false,
          error: 'Loan not found',
        };
      }

      // Check authorization
      if (loan.lenderUserId !== user.id && loan.borrowerUserId !== user.id) {
        set.status = 403;
        return {
          success: false,
          error: 'Not authorized to view this loan',
        };
      }

      set.status = 200;
      return {
        success: true,
        data: loan,
      };
    } catch (error: any) {
      logger.error('Error getting loan:', error);
      set.status = 500;
      return {
        success: false,
        error: error.message || 'Failed to get loan',
      };
    }
  }

  // Update loan
  static async updateLoan(context: any) {
    const { user, params, body, set } = context;

    try {
      const loan = await loanService.getLoanById(params.loanId);

      if (!loan) {
        set.status = 404;
        return {
          success: false,
          error: 'Loan not found',
        };
      }

      // Check authorization
      if (loan.lenderUserId !== user.id && loan.borrowerUserId !== user.id) {
        set.status = 403;
        return {
          success: false,
          error: 'Not authorized to update this loan',
        };
      }

      const updateData = {
        status: body.status,
        amount: body.amount,
        reason: body.reason,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        balanceRemaining: body.balanceRemaining,
      };
      const updatedLoan = await loanService.updateLoan(params.loanId, updateData);

      // Notify the other party
      const otherUserId = loan.lenderUserId === user.id ? loan.borrowerUserId : loan.lenderUserId;
      if (body.status) {
        await notificationService.notifyStatusChange(
          otherUserId,
          params.loanId,
          `Loan status changed to ${body.status}`
        );
      }

      set.status = 200;
      return {
        success: true,
        data: updatedLoan,
      };
    } catch (error: any) {
      logger.error('Error updating loan:', error);
      set.status = 500;
      return {
        success: false,
        error: error.message || 'Failed to update loan',
      };
    }
  }

  // Accept loan request
  static async acceptLoan(context: any) {
    const { user, params, set } = context;

    try {
      const loan = await loanService.getLoanById(params.loanId);

      if (!loan) {
        set.status = 404;
        return {
          success: false,
          error: 'Loan not found',
        };
      }

      // Only borrower can accept
      if (loan.borrowerUserId !== user.id) {
        set.status = 403;
        return {
          success: false,
          error: 'Only borrower can accept loan',
        };
      }

      if (loan.status !== LoanStatus.PENDING) {
        set.status = 400;
        return {
          success: false,
          error: 'Loan is not pending',
        };
      }

      const updatedLoan = await loanService.updateLoan(params.loanId, {
        status: LoanStatus.ACTIVE,
      });

      // Notify lender
      await notificationService.notifyStatusChange(
        loan.lenderUserId,
        params.loanId,
        'Loan has been accepted'
      );

      set.status = 200;
      return {
        success: true,
        data: updatedLoan,
      };
    } catch (error: any) {
      logger.error('Error accepting loan:', error);
      set.status = 500;
      return {
        success: false,
        error: error.message || 'Failed to accept loan',
      };
    }
  }

  // Record payment
  static async recordPayment(context: any) {
    const { user, params, body, set } = context;

    try {
      const loan = await loanService.getLoanById(params.loanId);

      if (!loan) {
        set.status = 404;
        return {
          success: false,
          error: 'Loan not found',
        };
      }

      // Check authorization
      if (loan.lenderUserId !== user.id && loan.borrowerUserId !== user.id) {
        set.status = 403;
        return {
          success: false,
          error: 'Not authorized to record payment for this loan',
        };
      }

      await loanService.addPayment(params.loanId, body.amount);
      const payments = await loanService.getPaymentHistory(params.loanId);
      const payment = payments[0]; // Get the most recent payment

      // Notify the other party
      const otherUserId = loan.lenderUserId === user.id ? loan.borrowerUserId : loan.lenderUserId;
      await notificationService.notifyPaymentReceived(
        otherUserId,
        params.loanId,
        body.amount
      );

      set.status = 201;
      return {
        success: true,
        data: payment,
      };
    } catch (error: any) {
      logger.error('Error recording payment:', error);
      set.status = 500;
      return {
        success: false,
        error: error.message || 'Failed to record payment',
      };
    }
  }

  // Get payment history
  static async getPaymentHistory(context: any) {
    const { user, params, set } = context;

    try {
      const loan = await loanService.getLoanById(params.loanId);

      if (!loan) {
        set.status = 404;
        return {
          success: false,
          error: 'Loan not found',
        };
      }

      // Check authorization
      if (loan.lenderUserId !== user.id && loan.borrowerUserId !== user.id) {
        set.status = 403;
        return {
          success: false,
          error: 'Not authorized to view payment history',
        };
      }

      const payments = await loanService.getPaymentHistory(params.loanId);

      set.status = 200;
      return {
        success: true,
        data: payments,
      };
    } catch (error: any) {
      logger.error('Error getting payment history:', error);
      set.status = 500;
      return {
        success: false,
        error: error.message || 'Failed to get payment history',
      };
    }
  }

  // Delete loan
  static async deleteLoan(context: any) {
    const { user, params, set } = context;

    try {
      const loan = await loanService.getLoanById(params.loanId);

      if (!loan) {
        set.status = 404;
        return {
          success: false,
          error: 'Loan not found',
        };
      }

      // Check authorization
      if (loan.lenderUserId !== user.id && loan.borrowerUserId !== user.id) {
        set.status = 403;
        return {
          success: false,
          error: 'Not authorized to delete this loan',
        };
      }

      await loanService.deleteLoan(params.loanId);

      set.status = 200;
      return {
        success: true,
        message: 'Loan deleted successfully',
      };
    } catch (error: any) {
      logger.error('Error deleting loan:', error);
      set.status = 500;
      return {
        success: false,
        error: error.message || 'Failed to delete loan',
      };
    }
  }
}

export default LoanController;
