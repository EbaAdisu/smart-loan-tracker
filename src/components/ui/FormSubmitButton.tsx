'use client';

import { formClasses } from '@/lib/formik/formHelpers';
import { FormikProps } from 'formik';

interface FormSubmitButtonProps<T = Record<string, unknown>> {
  children: React.ReactNode;
  formik: FormikProps<T>;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  disabled?: boolean;
}

export default function FormSubmitButton<T = Record<string, unknown>>({
  children,
  formik,
  variant = 'primary',
  className = '',
  disabled = false,
}: FormSubmitButtonProps<T>) {
  const isDisabled = disabled || formik.isSubmitting || !formik.isValid;
  const buttonClasses = `${formClasses.button[variant]} ${className}`.trim();

  return (
    <button type="submit" disabled={isDisabled} className={buttonClasses}>
      {formik.isSubmitting ? (
        <div className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
}
