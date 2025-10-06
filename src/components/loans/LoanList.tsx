'use client';

import { Loan } from '@/types';
import LoanCard from './LoanCard';

interface LoanListProps {
  loans: Loan[];
  onEdit: (loan: Loan) => void;
  onDelete: (loanId: string) => void;
  onAddPayment: (loanId: string) => void;
}

export default function LoanList({
  loans,
  onEdit,
  onDelete,
  onAddPayment,
}: LoanListProps) {
  if (loans.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No loans</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding your first loan.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {loans.map((loan) => (
        <LoanCard
          key={loan.id}
          loan={loan}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddPayment={onAddPayment}
        />
      ))}
    </div>
  );
}

