'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/components/ui/utils';

interface DialogContextValue {
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | undefined>(undefined);

const useDialogContext = () => {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog components must be used within a Dialog');
  }
  return context;
};

type DialogSize = 'md' | 'xl' | '2xl' | '3xl';

const DIALOG_SIZE_CLASSES: Record<DialogSize, string> = {
  md: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
};

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  size?: DialogSize;
}

const Dialog = ({ open, onOpenChange, children, className, size = 'md' }: DialogProps) => {
  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <DialogContext.Provider value={{ onOpenChange }}>
      <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
        <div
          className="fixed inset-0 bg-gray-950/50 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
          aria-hidden="true"
        />
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            'relative z-50 flex max-h-[calc(100vh-2rem)] w-full flex-col overflow-hidden rounded-xl bg-white shadow-xl',
            DIALOG_SIZE_CLASSES[size],
            className
          )}
        >
          {children}
        </div>
      </div>
    </DialogContext.Provider>
  );
};

type DialogContentProps = React.HTMLAttributes<HTMLDivElement>;

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex-1 overflow-y-auto px-6 py-4', className)} {...props} />
  )
);
DialogContent.displayName = 'DialogContent';

type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement> & { close?: boolean };

const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, close, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative flex flex-col gap-1.5 border-b border-gray-100 px-6 py-5', className)}
      {...props}
    >
      {children}
      {close ? <DialogClose className="absolute right-4 top-4" /> : null}
    </div>
  )
);
DialogHeader.displayName = 'DialogHeader';

type DialogTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight text-gray-900', className)}
      {...props}
    />
  )
);
DialogTitle.displayName = 'DialogTitle';

type DialogDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-gray-500', className)} {...props} />
  )
);
DialogDescription.displayName = 'DialogDescription';

type DialogFooterProps = React.HTMLAttributes<HTMLDivElement>;

const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'mt-auto flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50/60 px-6 py-4 sm:flex-row sm:justify-end sm:gap-2',
        className
      )}
      {...props}
    />
  )
);
DialogFooter.displayName = 'DialogFooter';

type DialogCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ className, ...props }, ref) => {
    const { onOpenChange } = useDialogContext();
    return (
      <button
        ref={ref}
        type="button"
        aria-label="Close"
        className={cn(
          'inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
          className
        )}
        onClick={() => onOpenChange(false)}
        {...props}
      >
        <X className="h-4 w-4" />
      </button>
    );
  }
);
DialogClose.displayName = 'DialogClose';

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
};