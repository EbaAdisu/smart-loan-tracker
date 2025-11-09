// Loan Controller
import loanService from '../services/loan.service';
import notificationService from '../services/notification.service';
import { LoanStatus } from '../models/Loan';
import { asyncHandler, NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors';

export class LoanController {
  // Create new loan
  static createLoan = asyncHandler(async (context: any) => {
    const { user, body, set } = context;

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
  });

  // Get all loans for user
  static getUserLoans = asyncHandler(async (context: any) => {
    const { user, query } = context;

    const loans = await loanService.getUserLoans(user.id, {
      status: query.status as LoanStatus | undefined,
      role: query.role as 'lender' | 'borrower' | 'all' | undefined,
    });

    return {
      success: true,
      data: loans,
    };
  });

  // Get loan by ID
  static getLoanById = asyncHandler(async (context: any) => {
    const { user, params } = context;

    const loan = await loanService.getLoanById(params.loanId);

    if (!loan) {
      throw new NotFoundError('Loan not found');
    }

    // Check authorization
    if (loan.lenderUserId !== user.id && loan.borrowerUserId !== user.id) {
      throw new ForbiddenError('Not authorized to view this loan');
    }

    return {
      success: true,
      data: loan,
    };
  });

  // Update loan
  static updateLoan = asyncHandler(async (context: any) => {
    const { user, params, body } = context;

    const loan = await loanService.getLoanById(params.loanId);

    if (!loan) {
      throw new NotFoundError('Loan not found');
    }

    // Check authorization
    if (loan.lenderUserId !== user.id && loan.borrowerUserId !== user.id) {
      throw new ForbiddenError('Not authorized to update this loan');
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

    return {
      success: true,
      data: updatedLoan,
    };
  });

  // Accept loan request
  static acceptLoan = asyncHandler(async (context: any) => {
    const { user, params } = context;

    const loan = await loanService.getLoanById(params.loanId);

    if (!loan) {
      throw new NotFoundError('Loan not found');
    }

    // Only borrower can accept
    if (loan.borrowerUserId !== user.id) {
      throw new ForbiddenError('Only borrower can accept loan');
    }

    if (loan.status !== LoanStatus.PENDING) {
      throw new BadRequestError('Loan is not pending');
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

    return {
      success: true,
      data: updatedLoan,
    };
  });

  // Record payment
  static recordPayment = asyncHandler(async (context: any) => {
    const { user, params, body, set } = context;

    const loan = await loanService.getLoanById(params.loanId);

    if (!loan) {
      throw new NotFoundError('Loan not found');
    }

    // Check authorization
    if (loan.lenderUserId !== user.id && loan.borrowerUserId !== user.id) {
      throw new ForbiddenError('Not authorized to record payment for this loan');
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
  });

  // Get payment history
  static getPaymentHistory = asyncHandler(async (context: any) => {
    const { user, params } = context;

    const loan = await loanService.getLoanById(params.loanId);

    if (!loan) {
      throw new NotFoundError('Loan not found');
    }

    // Check authorization
    if (loan.lenderUserId !== user.id && loan.borrowerUserId !== user.id) {
      throw new ForbiddenError('Not authorized to view payment history');
    }

    const payments = await loanService.getPaymentHistory(params.loanId);

    return {
      success: true,
      data: payments,
    };
  });

  // Delete loan
  static deleteLoan = asyncHandler(async (context: any) => {
    const { user, params } = context;

    const loan = await loanService.getLoanById(params.loanId);

    if (!loan) {
      throw new NotFoundError('Loan not found');
    }

    // Check authorization
    if (loan.lenderUserId !== user.id && loan.borrowerUserId !== user.id) {
      throw new ForbiddenError('Not authorized to delete this loan');
    }

    await loanService.deleteLoan(params.loanId);

    return {
      success: true,
      message: 'Loan deleted successfully',
    };
  });
}

export default LoanController;
