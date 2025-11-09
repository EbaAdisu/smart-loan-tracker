// Loan routes
import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middleware/auth.middleware';
import loanService from '../services/loan.service';
import { LoanStatus } from '../models/Loan';
import notificationService from '../services/notification.service';

export const loanRoutes = new Elysia({ prefix: '/loans' })
  .use(authMiddleware)

  // Create new loan
  .post(
    '/',
    async (context: any) => {
      const { user, body, set, params, query, headers, request } = context;
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

        return {
          success: true,
          data: loan,
        };
      } catch (error: any) {
        set.status = 400;
        return {
          success: false,
          error: error.message || 'Failed to create loan',
        };
      }
    },
    {
      body: t.Object({
        lenderUserId: t.String({ minLength: 1 }),
        borrowerUserId: t.String({ minLength: 1 }),
        lenderName: t.String({ minLength: 1 }),
        borrowerName: t.String({ minLength: 1 }),
        amount: t.Number({ minimum: 0 }),
        reason: t.Optional(t.String()),
        dueDate: t.String(), // ISO date string
      }),
    }
  )

  // Get all loans for current user
  .get('/', async (context: any) => {
    const { user, body, set, params, query, headers, request } = context;
    try {
      const { status, role } = query;

      const loans = await loanService.getUserLoans(user.id, {
        status: status as LoanStatus,
        role: role as 'lender' | 'borrower' | 'all',
      });

      return {
        success: true,
        data: loans,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get loans',
      };
    }
  })

  // Get loan by ID
  .get('/:loanId', async (context: any) => {
    const { user, body, set, params, query, headers, request } = context;
    try {
      const loan = await loanService.getLoanById(params.loanId);

      // Check if user is authorized to view this loan
      if (loan.lenderUserId !== user.id && loan.borrowerUserId !== user.id) {
        set.status = 403;
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
      set.status = 404;
      return {
        success: false,
        error: error.message || 'Loan not found',
      };
    }
  })

  // Update loan
  .put(
    '/:loanId',
    async (context: any) => {
      const { user, body, set, params, query, headers, request } = context;
    try {
        const loan = await loanService.getLoanById(params.loanId);

        // Check if user is authorized to update this loan
        if (loan.lenderUserId !== user.id && loan.borrowerUserId !== user.id) {
          set.status = 403;
          return {
            success: false,
            error: 'Not authorized to update this loan',
          };
        }

        const updateData = {
          ...body,
          dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        };
        const updatedLoan = await loanService.updateLoan(params.loanId, updateData);

        // Notify the other party
        const otherUserId = loan.lenderUserId === user.id ? loan.borrowerUserId : loan.lenderUserId;
        if (body.status) {
          await notificationService.notifyStatusChange(
            otherUserId,
            loan.loanId,
            body.status
          );
        }

        return {
          success: true,
          data: updatedLoan,
        };
      } catch (error: any) {
        set.status = 400;
        return {
          success: false,
          error: error.message || 'Failed to update loan',
        };
      }
    },
    {
      body: t.Object({
        amount: t.Optional(t.Number({ minimum: 0 })),
        reason: t.Optional(t.String()),
        dueDate: t.Optional(t.String()),
        status: t.Optional(t.Enum(LoanStatus)),
        balanceRemaining: t.Optional(t.Number({ minimum: 0 })),
      }),
    }
  )

  // Delete loan (soft delete)
  .delete('/:loanId', async (context: any) => {
    const { user, body, set, params, query, headers, request } = context;
    try {
      const loan = await loanService.getLoanById(params.loanId);

      // Check if user is authorized to delete this loan
      if (loan.lenderUserId !== user.id && loan.borrowerUserId !== user.id) {
        set.status = 403;
        return {
          success: false,
          error: 'Not authorized to delete this loan',
        };
      }

      await loanService.deleteLoan(params.loanId);

      return {
        success: true,
        message: 'Loan deleted successfully',
      };
    } catch (error: any) {
      set.status = 400;
      return {
        success: false,
        error: error.message || 'Failed to delete loan',
      };
    }
  })

  // Add payment to loan
  .post(
    '/:loanId/payments',
    async (context: any) => {
      const { user, body, set, params, query, headers, request } = context;
    try {
        const loan = await loanService.getLoanById(params.loanId);

        // Check if user is authorized
        if (loan.lenderUserId !== user.id && loan.borrowerUserId !== user.id) {
          set.status = 403;
          return {
            success: false,
            error: 'Not authorized to add payment to this loan',
          };
        }

        const updatedLoan = await loanService.addPayment(params.loanId, body.amount);

        // Notify the lender about payment received
        await notificationService.notifyPaymentReceived(
          loan.lenderUserId,
          loan.loanId,
          body.amount
        );

        return {
          success: true,
          data: updatedLoan,
        };
      } catch (error: any) {
        set.status = 400;
        return {
          success: false,
          error: error.message || 'Failed to add payment',
        };
      }
    },
    {
      body: t.Object({
        amount: t.Number({ minimum: 0.01 }),
      }),
    }
  )

  // Get payment history for a loan
  .get('/:loanId/payments', async (context: any) => {
    const { user, body, set, params, query, headers, request } = context;
    try {
      const loan = await loanService.getLoanById(params.loanId);

      // Check if user is authorized
      if (loan.lenderUserId !== user.id && loan.borrowerUserId !== user.id) {
        set.status = 403;
        return {
          success: false,
          error: 'Not authorized to view payments for this loan',
        };
      }

      const payments = await loanService.getPaymentHistory(params.loanId);

      return {
        success: true,
        data: payments,
      };
    } catch (error: any) {
      set.status = 404;
      return {
        success: false,
        error: error.message || 'Failed to get payment history',
      };
    }
  });

export default loanRoutes;

