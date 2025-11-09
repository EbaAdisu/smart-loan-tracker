// Loan routes
import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middleware/auth.middleware';
import LoanController from '../controllers/loan.controller';
import { LoanStatus } from '../models/Loan';

export const loanRoutes = new Elysia({ prefix: '/loans' })
  .use(authMiddleware)

  // Create new loan
  .post(
    '/',
    async (context: any) => {
      return LoanController.createLoan(context);
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
  .get(
    '/',
    async (context: any) => {
      return LoanController.getUserLoans(context);
    },
    {
      query: t.Object({
        status: t.Optional(t.String()),
        role: t.Optional(t.String()),
      }),
    }
  )

  // Get loan by ID
  .get('/:loanId', async (context: any) => {
    return LoanController.getLoanById(context);
  })

  // Update loan
  .put(
    '/:loanId',
    async (context: any) => {
      return LoanController.updateLoan(context);
    },
    {
      body: t.Object({
        status: t.Optional(t.Enum(LoanStatus)),
        amount: t.Optional(t.Number({ minimum: 0 })),
        reason: t.Optional(t.String()),
        dueDate: t.Optional(t.String()),
        balanceRemaining: t.Optional(t.Number({ minimum: 0 })),
      }),
    }
  )

  // Accept loan request
  .post('/:loanId/accept', async (context: any) => {
    return LoanController.acceptLoan(context);
  })

  // Record payment
  .post(
    '/:loanId/payments',
    async (context: any) => {
      return LoanController.recordPayment(context);
    },
    {
      body: t.Object({
        amount: t.Number({ minimum: 0.01 }),
      }),
    }
  )

  // Get payment history for a loan
  .get('/:loanId/payments', async (context: any) => {
    return LoanController.getPaymentHistory(context);
  })

  // Delete loan (soft delete)
  .delete('/:loanId', async (context: any) => {
    return LoanController.deleteLoan(context);
  });

export default loanRoutes;
