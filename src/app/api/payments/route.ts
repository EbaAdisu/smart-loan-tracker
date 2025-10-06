import { auth } from '@/lib/auth';
import { loanService, paymentService } from '@/lib/database';
import { CreatePaymentData } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreatePaymentData = await request.json();
    const { loanId, amount, paymentDate, notes } = body;

    if (!loanId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid payment data' },
        { status: 400 }
      );
    }

    // Verify the loan belongs to the user
    const loan = await loanService.findById(loanId, session.user.id);

    if (!loan) {
      return NextResponse.json({ error: 'Loan not found' }, { status: 404 });
    }

    // Create the payment
    const payment = await paymentService.create({
      loanId,
      amount,
      paymentDate: new Date(paymentDate),
      notes,
    });

    // Update the remaining amount on the loan
    const newRemainingAmount = Number(loan.remainingAmount) - Number(amount);
    await loanService.updateRemainingAmount(loanId, newRemainingAmount);
    
    // Get the updated loan
    const updatedLoan = await loanService.findById(loanId, session.user.id);

    return NextResponse.json({ payment, loan: updatedLoan }, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
