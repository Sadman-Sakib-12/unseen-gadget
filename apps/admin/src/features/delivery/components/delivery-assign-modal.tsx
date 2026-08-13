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
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { Delivery } from '@/features/delivery/types';

interface DeliveryAssignModalProps {
  delivery: Delivery | null;
  onClose: () => void;
  onAssign: (deliveryId: string, courier: string, tracking: string) => void;
}

const COURIER_OPTIONS = [
  { value: 'Pathao', label: 'Pathao' },
  { value: 'Steadfast', label: 'Steadfast' },
  { value: 'RedX', label: 'RedX' },
  { value: 'eCourier', label: 'eCourier' },
];

export function DeliveryAssignModal({ delivery, onClose, onAssign }: DeliveryAssignModalProps) {
  const [courier, setCourier] = useState(delivery?.courier ?? 'Pathao');
  const [tracking, setTracking] = useState(delivery?.trackingNumber ?? '');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (delivery && tracking.trim()) {
      onAssign(delivery.id, courier, tracking.trim());
      onClose();
    }
  };

  return (
    <Dialog open={delivery !== null} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle>Assign Courier</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <form id="assign-courier" onSubmit={handleSubmit} className="space-y-4">
          {delivery ? (
            <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-3.5 text-sm">
              <p className="font-medium text-gray-900">{delivery.orderId}</p>
              <p className="mt-0.5 text-gray-500">
                {delivery.customerName} · {delivery.city}
              </p>
            </div>
          ) : null}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Courier</label>
            <Select
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
              options={COURIER_OPTIONS}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Tracking number
            </label>
            <Input
              type="text"
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="e.g. STE-93847291"
              required
            />
          </div>
        </form>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" form="assign-courier">
          Assign
        </Button>
      </DialogFooter>
    </Dialog>
  );
}