'use client';

import { CreateLoanData } from '@/types';
import { useState } from 'react';

interface LoanFormProps {
  onSubmit: (data: CreateLoanData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function LoanForm({
  onSubmit,
  onCancel,
  isLoading = false,
}: LoanFormProps) {
  const [formData, setFormData] = useState<CreateLoanData>({
    personName: '',
    amount: 0,
    loanType: 'THEY_OWE_ME',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount <= 0) return;

    await onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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
          htmlFor="personName"
          className="block text-sm font-medium text-foreground"
        >
          Person&apos;s Name
        </label>
        <input
          id="personName"
          name="personName"
          type="text"
          value={formData.personName}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-foreground"
        />
      </div>

      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-foreground"
        >
          Amount ($)
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-foreground"
        />
      </div>

      <div>
        <label
          htmlFor="loanType"
          className="block text-sm font-medium text-foreground"
        >
          Loan Type
        </label>
        <select
          id="loanType"
          name="loanType"
          value={formData.loanType}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-foreground"
        >
          <option value="THEY_OWE_ME">They owe me</option>
          <option value="I_OWE_THEM">I owe them</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-foreground"
        >
          Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-foreground"
        />
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={isLoading || formData.amount <= 0}
          className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-foreground disabled:opacity-50"
        >
          {isLoading ? 'Adding...' : 'Add Loan'}
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
