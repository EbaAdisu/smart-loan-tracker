'use client';

import { CreatePaymentData } from '@/types';
import { useState } from 'react';

interface PaymentFormProps {
  loanId: string;
  maxAmount: number;
  onSubmit: (data: CreatePaymentData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function PaymentForm({
  loanId,
  maxAmount,
  onSubmit,
  onCancel,
  isLoading = false,
}: PaymentFormProps) {
  const [formData, setFormData] = useState<CreatePaymentData>({
    loanId,
    amount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount <= 0 || formData.amount > maxAmount) return;

    await onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700"
        >
          Payment Amount ($)
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          max={maxAmount}
          value={formData.amount}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Maximum: ${maxAmount.toFixed(2)}
        </p>
      </div>

      <div>
        <label
          htmlFor="paymentDate"
          className="block text-sm font-medium text-gray-700"
        >
          Payment Date
        </label>
        <input
          id="paymentDate"
          name="paymentDate"
          type="date"
          value={formData.paymentDate}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={
            isLoading || formData.amount <= 0 || formData.amount > maxAmount
          }
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isLoading ? 'Adding...' : 'Add Payment'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

