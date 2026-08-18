'use client';

import * as React from 'react';
import { TriangleAlert } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  children?: React.ReactNode;
}

/**
 * Styled replacement for `window.confirm`. Preserves the app's bottom-sheet
 * dialog pattern and gives destructive actions a consistent red accent.
 */
function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive,
  onConfirm,
  children,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader close>
        <DialogTitle>{title}</DialogTitle>
        {description ? <DialogDescription>{description}</DialogDescription> : null}
      </DialogHeader>
      <DialogContent>
        {destructive ? (
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
              <TriangleAlert className="h-5 w-5" />
            </div>
            <div className="text-sm leading-relaxed text-gray-600">
              {children ?? (
                <p>This action cannot be undone. Please confirm you want to continue.</p>
              )}
            </div>
          </div>
        ) : (
          children
        )}
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          {cancelLabel}
        </Button>
        <Button variant={destructive ? 'destructive' : 'default'} onClick={handleConfirm}>
          {confirmLabel}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export { ConfirmDialog };