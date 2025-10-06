import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CreateLoanData } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const loans = await prisma.loan.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        payments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(loans);
  } catch (error) {
    console.error('Error fetching loans:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateLoanData = await request.json();
    const { personName, amount, loanType, description } = body;

    if (!personName || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid loan data' }, { status: 400 });
    }

    const loan = await prisma.loan.create({
      data: {
        userId: session.user.id,
        personName,
        amount,
        remainingAmount: amount,
        loanType,
        description,
      },
    });

    return NextResponse.json(loan, { status: 201 });
  } catch (error) {
    console.error('Error creating loan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

