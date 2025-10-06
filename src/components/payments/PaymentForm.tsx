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
          className="block text-sm font-medium text-foreground"
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
          className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-foreground"
        />
        <p className="mt-1 text-sm text-muted-foreground">
          Maximum: ${maxAmount.toFixed(2)}
        </p>
      </div>

      <div>
        <label
          htmlFor="paymentDate"
          className="block text-sm font-medium text-foreground"
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
          className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-foreground"
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-foreground"
        >
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-foreground"
        />
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={
            isLoading || formData.amount <= 0 || formData.amount > maxAmount
          }
          className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-foreground disabled:opacity-50"
        >
          {isLoading ? 'Adding...' : 'Add Payment'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-muted text-foreground py-2 px-4 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
