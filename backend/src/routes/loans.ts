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
      const { user, body, set } = context;
      const result = await LoanController.createLoan(user.id, {
        lenderUserId: body.lenderUserId,
        borrowerUserId: body.borrowerUserId,
        lenderName: body.lenderName,
        borrowerName: body.borrowerName,
        amount: body.amount,
        reason: body.reason,
        dueDate: new Date(body.dueDate),
      });
      
      if (!result.success) {
        set.status = 400;
      }
      
      return result;
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
      const { user, query } = context;
      return LoanController.getUserLoans(user.id, {
        status: query.status,
        role: query.role,
      });
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
    const { user, params, set } = context;
    const result = await LoanController.getLoanById(params.loanId, user.id);
    
    if (!result.success) {
      set.status = result.error === 'Loan not found' ? 404 : 403;
    }
    
    return result;
  })

  // Update loan
  .put(
    '/:loanId',
    async (context: any) => {
      const { user, params, body, set } = context;
      const result = await LoanController.updateLoan(params.loanId, user.id, {
        status: body.status,
        amount: body.amount,
        reason: body.reason,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        balanceRemaining: body.balanceRemaining,
      });
      
      if (!result.success) {
        set.status = result.error === 'Loan not found' ? 404 : 403;
      }
      
      return result;
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
    const { user, params, set } = context;
    const result = await LoanController.acceptLoan(params.loanId, user.id);
    
    if (!result.success) {
      set.status = 400;
    }
    
    return result;
  })

  // Record payment
  .post(
    '/:loanId/payments',
    async (context: any) => {
      const { user, params, body, set } = context;
      const result = await LoanController.recordPayment(
        params.loanId,
        user.id,
        body.amount
      );
      
      if (!result.success) {
        set.status = 400;
      }
      
      return result;
    },
    {
      body: t.Object({
        amount: t.Number({ minimum: 0.01 }),
      }),
    }
  )

  // Get payment history for a loan
  .get('/:loanId/payments', async (context: any) => {
    const { user, params, set } = context;
    const result = await LoanController.getPaymentHistory(params.loanId, user.id);
    
    if (!result.success) {
      set.status = result.error === 'Loan not found' ? 404 : 403;
    }
    
    return result;
  })

  // Delete loan (soft delete)
  .delete('/:loanId', async (context: any) => {
    const { user, params, set } = context;
    const result = await LoanController.deleteLoan(params.loanId, user.id);
    
    if (!result.success) {
      set.status = result.error === 'Loan not found' ? 404 : 403;
    }
    
    return result;
  });

export default loanRoutes;
