'use client';

import FormError from '@/components/ui/FormError';
import FormField from '@/components/ui/FormField';
import FormSelect from '@/components/ui/FormSelect';
import FormSubmitButton from '@/components/ui/FormSubmitButton';
import FormTextarea from '@/components/ui/FormTextarea';
import { LoanFormData, loanSchema } from '@/lib/validation/schemas/loanSchemas';
import { CreateLoanData } from '@/types';
import { Formik, FormikHelpers } from 'formik';

interface LoanFormProps {
  onSubmit: (data: CreateLoanData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const loanTypeOptions = [
  { value: 'THEY_OWE_ME', label: 'They owe me' },
  { value: 'I_OWE_THEM', label: 'I owe them' },
];

export default function LoanForm({ onSubmit, onCancel }: LoanFormProps) {
  const initialValues: LoanFormData = {
    personName: '',
    amount: 0,
    loanType: 'THEY_OWE_ME',
    description: '',
  };

  const handleSubmit = async (
    values: LoanFormData,
    { setSubmitting, setFieldError }: FormikHelpers<LoanFormData>
  ) => {
    try {
      await onSubmit(values);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      setFieldError('submit', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={loanSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <FormField
            name="personName"
            label="Person's Name"
            type="text"
            required
            formik={formik}
          />

          <FormField
            name="amount"
            label="Amount ($)"
            type="number"
            step="0.01"
            min="0"
            required
            formik={formik}
          />

          <FormSelect
            name="loanType"
            label="Loan Type"
            options={loanTypeOptions}
            required
            formik={formik}
          />

          <FormTextarea
            name="description"
            label="Description (Optional)"
            rows={3}
            formik={formik}
          />

          <FormError formik={formik} />

          <div className="flex space-x-3">
            <div className="flex-1">
              <FormSubmitButton formik={formik}>Add Loan</FormSubmitButton>
            </div>
            <button
              type="button"
              onClick={onCancel}
              disabled={formik.isSubmitting}
              className="flex-1 bg-muted text-foreground py-2 px-4 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-foreground disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
}
