'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/components/ui/utils';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: string) => void;
  containerClassName?: string;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    { className, containerClassName, value, onValueChange, placeholder = 'Search...', ...props },
    ref
  ) => {
    return (
      <div className={cn('relative w-full sm:w-72', containerClassName)}>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={ref}
          className={cn('pl-9 pr-9', className)}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onValueChange?.(event.target.value)}
          {...props}
        />
        {value ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onValueChange?.('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
    );
  }
);
SearchInput.displayName = 'SearchInput';

export { SearchInput };