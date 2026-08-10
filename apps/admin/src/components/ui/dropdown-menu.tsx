'use client';

import * as React from 'react';
import { cn } from '@/components/ui/utils';

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom';
}

const DropdownMenu = ({ trigger, children, align = 'end', side = 'bottom' }: DropdownMenuProps) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignClass = align === 'start' ? 'left-0' : align === 'end' ? 'right-0' : 'left-1/2 -translate-x-1/2';
  const sideClass = side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2';

  return (
    <div className="relative inline-block text-left w-full" ref={ref}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white shadow-md',
            alignClass,
            sideClass
          )}
        >
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
};

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  onSelect?: () => void;
}

const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ className, onSelect, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer', className)}
      onClick={() => {
        onSelect?.();
      }}
      {...props}
    />
  )
);
DropdownMenuItem.displayName = 'DropdownMenuItem';

const DropdownMenuSeparator = () => <div className="my-1 h-px bg-gray-200" />;

interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

const DropdownMenuLabel = React.forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-4 py-2 text-sm font-medium text-gray-500', className)} {...props} />
  )
);
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

export { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel };