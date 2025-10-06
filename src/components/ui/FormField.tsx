'use client';

import { formClasses } from '@/lib/formik/formHelpers';
import {
  getFieldClasses,
  getFieldError,
} from '@/lib/validation/validationUtils';
import { FormikProps } from 'formik';

interface FormFieldProps<T = Record<string, unknown>> {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | 'url';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  formik: FormikProps<T>;
  className?: string;
}

export default function FormField<T = Record<string, unknown>>({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  min,
  max,
  step,
  formik,
  className = '',
}: FormFieldProps<T>) {
  const error = getFieldError(name, formik.errors, formik.touched);
  const inputClasses = getFieldClasses(
    name,
    formik.errors,
    formik.touched,
    `${formClasses.input} ${className}`
  );

  return (
    <div className={formClasses.field}>
      <label htmlFor={name} className={formClasses.label}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={String((formik.values as Record<string, unknown>)[name] || '')}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        disabled={disabled || formik.isSubmitting}
        required={required}
        min={min}
        max={max}
        step={step}
        className={inputClasses}
      />
      {error && <div className={formClasses.error}>{error}</div>}
    </div>
  );
}
