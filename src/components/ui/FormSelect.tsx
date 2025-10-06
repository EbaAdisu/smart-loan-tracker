'use client';

import { formClasses } from '@/lib/formik/formHelpers';
import {
  getFieldClasses,
  getFieldError,
} from '@/lib/validation/validationUtils';
import { FormikProps } from 'formik';

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps<T = Record<string, unknown>> {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  formik: FormikProps<T>;
  className?: string;
}

export default function FormSelect<T = Record<string, unknown>>({
  name,
  label,
  options,
  placeholder,
  required = false,
  disabled = false,
  formik,
  className = '',
}: FormSelectProps<T>) {
  const error = getFieldError(name, formik.errors, formik.touched);
  const selectClasses = getFieldClasses(
    name,
    formik.errors,
    formik.touched,
    `${formClasses.select} ${className}`
  );

  return (
    <div className={formClasses.field}>
      <label htmlFor={name} className={formClasses.label}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={String((formik.values as Record<string, unknown>)[name] || '')}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        disabled={disabled || formik.isSubmitting}
        required={required}
        className={selectClasses}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className={formClasses.error}>{error}</div>}
    </div>
  );
}
