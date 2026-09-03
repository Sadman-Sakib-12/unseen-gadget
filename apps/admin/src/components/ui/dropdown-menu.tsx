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
  const [computedSide, setComputedSide] = React.useState<'top' | 'bottom'>(side);
  const ref = React.useRef<HTMLDivElement>(null);

  const close = React.useCallback(() => setOpen(false), []);
  const toggle = React.useCallback(() => setOpen((prev) => !prev), []);

  React.useEffect(() => {
    if (open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // If less than 240px below and enough space above, open upwards
      if (spaceBelow < 240 && rect.top > 200) {
        setComputedSide('top');
      } else {
        setComputedSide(side);
      }
    }
  }, [open, side]);
  const alignClass =
    align === 'start'
      ? 'left-0'
      : align === 'end'
      ? 'right-0'
      : 'left-1/2 -translate-x-1/2';
  const sideClass =
    computedSide === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5';

  return (
    <DropdownMenuContext.Provider value={{ close }}>
      <div className="relative inline-block text-left" ref={ref} onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}>
        <div onClick={toggle} className="cursor-pointer">{trigger}</div>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div
              className={cn(
              'absolute z-50 min-w-[10.5rem] rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-1.5 shadow-xl transition-all duration-150 animate-in fade-in zoom-in-95',
              alignClass,
              sideClass
            )}
          >
              {children}
            </div>
          </>
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
          'flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 select-none',
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

const DropdownMenuSeparator = () => <div className="my-1 h-px bg-slate-100" />;

type DropdownMenuLabelProps = React.HTMLAttributes<HTMLDivElement>;

const DropdownMenuLabel = React.forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 select-none',
        className
      )}
      {...props}
    />
  )
);
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

export { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel };