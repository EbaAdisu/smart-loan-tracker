import * as yup from 'yup';

// Loan form validation schema
export const loanSchema = yup.object({
  personName: yup
    .string()
    .required('Person name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

  amount: yup
    .number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .min(0.01, 'Amount must be at least $0.01')
    .max(1000000, 'Amount cannot exceed $1,000,000')
    .typeError('Please enter a valid amount'),

  loanType: yup
    .string()
    .oneOf(
      ['I_OWE_THEM', 'THEY_OWE_ME'] as const,
      'Please select a valid loan type'
    )
    .required('Loan type is required'),

  description: yup
    .string()
    .optional()
    .max(500, 'Description must be less than 500 characters'),
});

// Update loan schema (for editing existing loans)
export const updateLoanSchema = yup.object({
  personName: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .optional(),

  amount: yup
    .number()
    .positive('Amount must be positive')
    .min(0.01, 'Amount must be at least $0.01')
    .max(1000000, 'Amount cannot exceed $1,000,000')
    .typeError('Please enter a valid amount')
    .optional(),

  loanType: yup
    .string()
    .oneOf(
      ['I_OWE_THEM', 'THEY_OWE_ME'] as const,
      'Please select a valid loan type'
    )
    .optional(),

  description: yup
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
});

// Type definitions for form data
export type LoanFormData = yup.InferType<typeof loanSchema>;
export type UpdateLoanFormData = yup.InferType<typeof updateLoanSchema>;
