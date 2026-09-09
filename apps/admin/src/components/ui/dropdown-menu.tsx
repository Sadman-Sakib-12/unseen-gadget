'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
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
  className?: string;
}

const DropdownMenu = ({
  trigger,
  children,
  align = 'end',
  side = 'bottom',
  className,
}: DropdownMenuProps) => {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const [coords, setCoords] = React.useState<{
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    maxHeight: number;
    transformOrigin: string;
  } | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const close = React.useCallback(() => setOpen(false), []);
  const toggle = React.useCallback(() => setOpen((prev) => !prev), []);

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Prefer opening downwards unless space below is tight (< 220px) AND space above is greater
    const openTop = side === 'top' ? spaceAbove > 140 : spaceBelow < 220 && spaceAbove > spaceBelow;

    let top: number | undefined;
    let bottom: number | undefined;
    let maxHeight = 380;

    if (openTop) {
      bottom = window.innerHeight - rect.top + 6;
      maxHeight = Math.max(160, Math.min(spaceAbove - 20, 420));
    } else {
      top = rect.bottom + 6;
      maxHeight = Math.max(160, Math.min(spaceBelow - 20, 420));
    }

    let left: number | undefined;
    let right: number | undefined;

    if (align === 'start') {
      left = Math.max(8, Math.min(rect.left, window.innerWidth - 220));
    } else if (align === 'center') {
      left = Math.max(8, rect.left + rect.width / 2 - 100);
    } else {
      // align === 'end'
      right = Math.max(8, window.innerWidth - rect.right);
    }

    const transformOrigin = openTop
      ? align === 'end'
        ? 'bottom right'
        : align === 'start'
        ? 'bottom left'
        : 'bottom center'
      : align === 'end'
      ? 'top right'
      : align === 'start'
      ? 'top left'
      : 'top center';

    setCoords({ top, bottom, left, right, maxHeight, transformOrigin });
  }, [align, side]);

  React.useEffect(() => {
    if (!open) return;

    updatePosition();

    const handleScroll = () => {
      updatePosition();
    };

    const handleResize = () => {
      updatePosition();
    };

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [open, updatePosition]);

  return (
    <DropdownMenuContext.Provider value={{ close }}>
      <div
        className="relative inline-block text-left"
        ref={triggerRef}
        onKeyDown={(e) => {
          if (e.key === 'Escape') close();
        }}
      >
        <div onClick={toggle} className="cursor-pointer">
          {trigger}
        </div>

        {open && mounted && typeof document !== 'undefined' &&
          createPortal(
            <>
              {/* Invisible backdrop to dismiss on click outside */}
              <div
                className="fixed inset-0 z-[9998] bg-transparent"
                onClick={close}
                aria-hidden="true"
              />

              {/* Portal-rendered dropdown menu (bypasses table overflow-x-auto clipping) */}
              <div
                style={{
                  top: coords?.top !== undefined ? `${coords.top}px` : undefined,
                  bottom: coords?.bottom !== undefined ? `${coords.bottom}px` : undefined,
                  left: coords?.left !== undefined ? `${coords.left}px` : undefined,
                  right: coords?.right !== undefined ? `${coords.right}px` : undefined,
                  maxHeight: coords?.maxHeight ? `${coords.maxHeight}px` : '380px',
                  transformOrigin: coords?.transformOrigin || 'top right',
                }}
                className={cn(
                  'fixed z-[9999] min-w-[12rem] overflow-y-auto rounded-xl border border-slate-200/90 bg-white/98 p-1.5 shadow-2xl backdrop-blur-md transition-all duration-150 animate-in fade-in zoom-in-95',
                  className
                )}
              >
                {children}
              </div>
            </>,
            document.body
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