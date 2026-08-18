'use client';

import * as React from 'react';
import { cn } from '@/components/ui/utils';

interface DropdownMenuContextValue {
  close: () => void;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | undefined>(undefined);

const useDropdownMenuContext = () => {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error('DropdownMenuItem must be used within a DropdownMenu');
  }
  return context;
};

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom';
}

const DropdownMenu = ({ trigger, children, align = 'end', side = 'bottom' }: DropdownMenuProps) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const close = React.useCallback(() => setOpen(false), []);
  const toggle = React.useCallback(() => setOpen((prev) => !prev), []);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const alignClass = align === 'start' ? 'left-0' : align === 'end' ? 'right-0' : 'left-1/2 -translate-x-1/2';
  const sideClass = side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2';

  return (
    <DropdownMenuContext.Provider value={{ close }}>
      <div className="relative inline-block text-left" ref={ref}>
        <div onClick={toggle}>{trigger}</div>
        {open && (
          <div
            className={cn(
              'absolute z-50 min-w-[9rem] overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg',
              alignClass,
              sideClass
            )}
          >
            {children}
          </div>
        )}
      </div>
    </DropdownMenuContext.Provider>
  );
};

type DropdownMenuItemProps = React.HTMLAttributes<HTMLDivElement> & { onSelect?: () => void };

const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ className, onSelect, ...props }, ref) => {
    const { close } = useDropdownMenuContext();
    return (
      <div
        ref={ref}
        className={cn(
          'flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900',
          className
        )}
        onClick={() => {
          close();
          onSelect?.();
        }}
        {...props}
      />
    );
  }
);
DropdownMenuItem.displayName = 'DropdownMenuItem';

const DropdownMenuSeparator = () => <div className="my-1 h-px bg-gray-200" />;

type DropdownMenuLabelProps = React.HTMLAttributes<HTMLDivElement>;

const DropdownMenuLabel = React.forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500',
        className
      )}
      {...props}
    />
  )
);
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

export { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel };