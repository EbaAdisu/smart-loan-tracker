import { FormikErrors, FormikTouched } from 'formik';

/**
 * Utility function to get field error message
 */
export const getFieldError = <T = Record<string, unknown>>(
  fieldName: string,
  errors: FormikErrors<T>,
  touched: FormikTouched<T>
): string | undefined => {
  return touched[fieldName as keyof FormikTouched<T>] &&
    errors[fieldName as keyof FormikErrors<T>]
    ? String(errors[fieldName as keyof FormikErrors<T>])
    : undefined;
};

/**
 * Utility function to check if field has error
 */
export const hasFieldError = <T = Record<string, unknown>>(
  fieldName: string,
  errors: FormikErrors<T>,
  touched: FormikTouched<T>
): boolean => {
  return !!(
    touched[fieldName as keyof FormikTouched<T>] &&
    errors[fieldName as keyof FormikErrors<T>]
  );
};

/**
 * Utility function to get field CSS classes based on validation state
 */
export const getFieldClasses = <T = Record<string, unknown>>(
  fieldName: string,
  errors: FormikErrors<T>,
  touched: FormikTouched<T>,
  baseClasses: string = ''
): string => {
  const hasError = hasFieldError(fieldName, errors, touched);
  const errorClasses = hasError
    ? 'border-red-500 focus:ring-red-500'
    : 'border-border focus:ring-foreground';

  return `${baseClasses} ${errorClasses}`.trim();
};

/**
 * Utility function to format currency values
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

/**
 * Utility function to parse currency input
 */
export const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned) || 0;
};

/**
 * Utility function to format date for input fields
 */
export const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Utility function to parse date from input
 */
export const parseDateFromInput = (dateString: string): Date => {
  return new Date(dateString);
};
