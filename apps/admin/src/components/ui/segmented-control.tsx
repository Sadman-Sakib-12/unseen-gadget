'use client';

import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/components/ui/utils';

export interface SegmentedOption {
  value: string;
  label: React.ReactNode;
  icon?: LucideIcon;
  iconOnly?: boolean;
}

interface SegmentedControlProps {
  options: SegmentedOption[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  'aria-label'?: string;
}

/**
 * Shared segmented control. Uses the same white-pill-on-gray language as Tabs
 * so view toggles and tab bars never read as two different systems.
 */
function SegmentedControl({
  options,
  value,
  onValueChange,
  className,
  'aria-label': ariaLabel,
}: SegmentedControlProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center rounded-lg bg-gray-100 p-1 shadow-sm',
        className
      )}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onValueChange(option.value)}
            className={cn(
              'inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
              isActive
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            )}
          >
            {Icon ? <Icon className="h-4 w-4" /> : null}
            {option.iconOnly ? null : option.label}
          </button>
        );
      })}
    </div>
  );
}

export { SegmentedControl };