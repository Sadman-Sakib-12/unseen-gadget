'use client';

import * as React from 'react';
import { cn } from '@/components/ui/utils';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Shared form field wrapper: label + control + optional hint/error, with the
 * exact spacing (space-y-1.5, text-sm font-medium label) used across every
 * admin form. Replaces the copy-pasted `Field` helpers in seven files.
 */
function FormField({
  label,
  htmlFor,
  hint,
  error,
  required,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required ? <span className="ml-0.5 text-red-600">*</span> : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export { FormField };