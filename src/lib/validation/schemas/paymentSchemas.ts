import * as yup from 'yup';

// Payment form validation schema
export const paymentSchema = yup.object({
  amount: yup
    .number()
    .required('Payment amount is required')
    .positive('Amount must be positive')
    .min(0.01, 'Amount must be at least $0.01')
    .max(1000000, 'Amount cannot exceed $1,000,000')
    .typeError('Please enter a valid amount'),

  paymentDate: yup
    .date()
    .required('Payment date is required')
    .max(new Date(), 'Payment date cannot be in the future')
    .typeError('Please enter a valid date'),

  notes: yup
    .string()
    .optional()
    .max(500, 'Notes must be less than 500 characters'),
});

// Payment form with loan context (includes maxAmount validation)
export const createPaymentSchema = (maxAmount: number) =>
  yup.object({
    amount: yup
      .number()
      .required('Payment amount is required')
      .positive('Amount must be positive')
      .min(0.01, 'Amount must be at least $0.01')
      .max(maxAmount, `Payment amount cannot exceed $${maxAmount.toFixed(2)}`)
      .typeError('Please enter a valid amount'),

    paymentDate: yup
      .date()
      .required('Payment date is required')
      .max(new Date(), 'Payment date cannot be in the future')
      .typeError('Please enter a valid date'),

    notes: yup
      .string()
      .optional()
      .max(500, 'Notes must be less than 500 characters'),
  });

// Type definitions for form data
export type PaymentFormData = yup.InferType<typeof paymentSchema>;
export type CreatePaymentFormData = yup.InferType<
  ReturnType<typeof createPaymentSchema>
>;
