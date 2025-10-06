import { FormikProps } from 'formik';

/**
 * Common form field props interface
 */
export interface FormFieldProps<T = Record<string, unknown>> {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  formik: FormikProps<T>;
}

/**
 * Common form button props interface
 */
export interface FormButtonProps {
  type: 'submit' | 'button';
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

/**
 * Get common input props for Formik fields
 */
export const getInputProps = <T = Record<string, unknown>>(
  formik: FormikProps<T>,
  fieldName: string
) => ({
  name: fieldName,
  value: (formik.values as Record<string, unknown>)[fieldName] || '',
  onChange: formik.handleChange,
  onBlur: formik.handleBlur,
  disabled: formik.isSubmitting,
});

/**
 * Get common textarea props for Formik fields
 */
export const getTextareaProps = <T = Record<string, unknown>>(
  formik: FormikProps<T>,
  fieldName: string
) => ({
  name: fieldName,
  value: (formik.values as Record<string, unknown>)[fieldName] || '',
  onChange: formik.handleChange,
  onBlur: formik.handleBlur,
  disabled: formik.isSubmitting,
});

/**
 * Get common select props for Formik fields
 */
export const getSelectProps = <T = Record<string, unknown>>(
  formik: FormikProps<T>,
  fieldName: string
) => ({
  name: fieldName,
  value: (formik.values as Record<string, unknown>)[fieldName] || '',
  onChange: formik.handleChange,
  onBlur: formik.handleBlur,
  disabled: formik.isSubmitting,
});

/**
 * Handle form submission with error handling
 */
export const handleFormSubmit = async <T = Record<string, unknown>>(
  formik: FormikProps<T>,
  submitFn: (values: T) => Promise<void>
) => {
  try {
    await submitFn(formik.values);
  } catch (error) {
    // Handle submission errors
    if (error instanceof Error) {
      formik.setFieldError('submit', error.message);
    } else {
      formik.setFieldError('submit', 'An unexpected error occurred');
    }
  }
};

/**
 * Common form container classes
 */
export const formClasses = {
  container: 'space-y-4',
  field: 'space-y-1',
  label: 'block text-sm font-medium text-foreground',
  input:
    'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2',
  textarea:
    'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2',
  select:
    'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2',
  error: 'text-sm text-red-600',
  button: {
    primary:
      'w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-primary text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground disabled:opacity-50',
    secondary:
      'w-full flex justify-center py-2 px-4 border border-border rounded-md shadow-sm text-sm font-medium bg-muted text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground disabled:opacity-50',
    danger:
      'w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50',
  },
};
