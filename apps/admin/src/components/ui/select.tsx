'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/components/ui/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  /** Render a consistent chevron instead of the native arrow. Opt-in so existing
   *  callers (including the untouched auth forms) keep their native appearance. */
  showChevron?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, showChevron, ...props }, ref) => {
    const select = (
      <select
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
          showChevron && 'cursor-pointer appearance-none pr-9',
          className
        )}
        {...props}
      >
        {options.map((option, index) => (
          <option key={`${option.value}-${index}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );

    if (!showChevron) return select;

    return (
      <div className="relative w-full">
        {select}
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };