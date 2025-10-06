'use client';

import { Loan } from '@/types';
import { useState } from 'react';

interface LoanCardProps {
  loan: Loan;
  onEdit: (loan: Loan) => void;
  onDelete: (loanId: string) => void;
  onAddPayment: (loanId: string) => void;
}

export default function LoanCard({
  loan,
  onEdit,
  onDelete,
  onAddPayment,
}: LoanCardProps) {
  const [showActions, setShowActions] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = () => {
    // Monochrome badges
    return 'bg-muted text-foreground';
  };

  const getStatusText = () => {
    if (loan.status === 'PAID') return 'Paid';
    if (loan.loanType === 'THEY_OWE_ME') return 'They owe me';
    return 'I owe them';
  };

  return (
    <div className="bg-background rounded-lg shadow-sm border border-border p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">
            {loan.personName}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {formatCurrency(loan.amount)} loan
          </p>
          {loan.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {loan.description}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end space-y-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}
          >
            {getStatusText()}
          </span>

          <div className="text-right">
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(loan.remainingAmount)}
            </p>
            <p className="text-xs text-muted-foreground">remaining</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          Created {new Date(loan.createdAt).toLocaleDateString()}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setShowActions(!showActions)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      {showActions && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex space-x-2">
            {loan.status === 'ACTIVE' && (
              <button
                onClick={() => onAddPayment(loan.id)}
                className="flex-1 bg-primary text-primary-foreground py-2 px-3 rounded-md text-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-foreground"
              >
                Add Payment
              </button>
            )}
            <button
              onClick={() => onEdit(loan)}
              className="flex-1 bg-primary text-primary-foreground py-2 px-3 rounded-md text-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-foreground"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(loan.id)}
              className="flex-1 bg-accent text-accent-foreground py-2 px-3 rounded-md text-sm hover:bg-muted focus:outline-none focus:ring-2 focus:ring-foreground"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
