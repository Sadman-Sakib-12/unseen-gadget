'use client';

import { useState, type FormEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatBDT } from '@/lib/load-dashboard-data';
import type { Return } from '@/features/returns/types';

interface RefundModalProps {
  ret: Return | null;
  onClose: () => void;
  onConfirm: (returnId: string) => void;
}

export function RefundModal({ ret, onClose, onConfirm }: RefundModalProps) {
  const [reason, setReason] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (ret && reason.trim()) {
      onConfirm(ret.id);
      onClose();
    }
  };

  return (
    <Dialog open={ret !== null} onOpenChange={onClose}>
      <DialogHeader close>
        <DialogTitle>Process Refund</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <form id="refund-form" onSubmit={handleSubmit} className="space-y-4">
          {ret ? (
            <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-3.5 text-sm">
              <p className="font-medium text-gray-900">{ret.product}</p>
              <p className="mt-0.5 text-gray-500">
                Refund amount: {formatBDT(ret.refundAmount)} · {ret.orderId}
              </p>
            </div>
          ) : null}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Refund reason
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
              placeholder="Provide a short reason for this refund…"
            />
          </div>
        </form>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" form="refund-form" variant="destructive">
          Confirm Refund
        </Button>
      </DialogFooter>
    </Dialog>
  );
}