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
    if (loan.status === 'PAID') return 'bg-green-100 text-green-800';
    if (loan.loanType === 'THEY_OWE_ME') return 'bg-blue-100 text-blue-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusText = () => {
    if (loan.status === 'PAID') return 'Paid';
    if (loan.loanType === 'THEY_OWE_ME') return 'They owe me';
    return 'I owe them';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {loan.personName}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {formatCurrency(loan.amount)} loan
          </p>
          {loan.description && (
            <p className="text-sm text-gray-500 mt-1">{loan.description}</p>
          )}
        </div>

        <div className="flex flex-col items-end space-y-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}
          >
            {getStatusText()}
          </span>

          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(loan.remainingAmount)}
            </p>
            <p className="text-xs text-gray-500">remaining</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-xs text-gray-500">
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
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex space-x-2">
            {loan.status === 'ACTIVE' && (
              <button
                onClick={() => onAddPayment(loan.id)}
                className="flex-1 bg-green-600 text-white py-2 px-3 rounded-md text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Add Payment
              </button>
            )}
            <button
              onClick={() => onEdit(loan)}
              className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(loan.id)}
              className="flex-1 bg-red-600 text-white py-2 px-3 rounded-md text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

