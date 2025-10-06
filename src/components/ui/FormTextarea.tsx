'use client';

import { formClasses } from '@/lib/formik/formHelpers';
import {
  getFieldClasses,
  getFieldError,
} from '@/lib/validation/validationUtils';
import { FormikProps } from 'formik';

interface FormTextareaProps<T = Record<string, unknown>> {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  formik: FormikProps<T>;
  className?: string;
}

export default function FormTextarea<T = Record<string, unknown>>({
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  rows = 3,
  formik,
  className = '',
}: FormTextareaProps<T>) {
  const error = getFieldError(name, formik.errors, formik.touched);
  const textareaClasses = getFieldClasses(
    name,
    formik.errors,
    formik.touched,
    `${formClasses.textarea} ${className}`
  );

  return (
    <div className={formClasses.field}>
      <label htmlFor={name} className={formClasses.label}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={String((formik.values as Record<string, unknown>)[name] || '')}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        disabled={disabled || formik.isSubmitting}
        required={required}
        rows={rows}
        className={textareaClasses}
      />
      {error && <div className={formClasses.error}>{error}</div>}
    </div>
  );
}
