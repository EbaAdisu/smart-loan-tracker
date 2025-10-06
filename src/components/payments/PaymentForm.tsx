'use client';

import FormError from '@/components/ui/FormError';
import FormField from '@/components/ui/FormField';
import FormSubmitButton from '@/components/ui/FormSubmitButton';
import FormTextarea from '@/components/ui/FormTextarea';
import {
  CreatePaymentFormData,
  createPaymentSchema,
} from '@/lib/validation/schemas/paymentSchemas';
import { CreatePaymentData } from '@/types';
import { Formik, FormikHelpers } from 'formik';

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
}: PaymentFormProps) {
  const initialValues: CreatePaymentFormData = {
    amount: 0,
    paymentDate: new Date(),
    notes: '',
  };

  const handleSubmit = async (
    values: CreatePaymentFormData,
    { setSubmitting, setFieldError }: FormikHelpers<CreatePaymentFormData>
  ) => {
    try {
      const paymentData: CreatePaymentData = {
        loanId,
        amount: values.amount,
        paymentDate: values.paymentDate,
        notes: values.notes,
      };
      await onSubmit(paymentData);
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
      validationSchema={createPaymentSchema(maxAmount)}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <FormField
              name="amount"
              label="Payment Amount ($)"
              type="number"
              step="0.01"
              min="0"
              max={maxAmount}
              required
              formik={formik}
            />
            <p className="mt-1 text-sm text-muted-foreground">
              Maximum: ${maxAmount.toFixed(2)}
            </p>
          </div>

          <FormField
            name="paymentDate"
            label="Payment Date"
            type="date"
            required
            formik={formik}
          />

          <FormTextarea
            name="notes"
            label="Notes (Optional)"
            rows={3}
            formik={formik}
          />

          <FormError formik={formik} />

          <div className="flex space-x-3">
            <div className="flex-1">
              <FormSubmitButton formik={formik}>Add Payment</FormSubmitButton>
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
