'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/components/ui/utils';
import type { Delivery } from '@/features/delivery/types';

interface TrackingModalProps {
  delivery: Delivery | null;
  onClose: () => void;
}

const STEPS = ['pending', 'picked_up', 'in_transit', 'delivered'];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-right text-sm font-medium text-gray-900">{value}</dd>
    </div>
  );
}

export function TrackingModal({ delivery, onClose }: TrackingModalProps) {
  const currentStep = delivery ? STEPS.indexOf(delivery.status) : -1;
  const cancelled = delivery?.status === 'cancelled';

  return (
    <Dialog open={delivery !== null} onOpenChange={onClose}>
      {delivery ? (
        <>
          <DialogHeader>
            <DialogTitle>Tracking Information</DialogTitle>
            <DialogDescription>
              {delivery.orderId} · {delivery.customerName}
            </DialogDescription>
          </DialogHeader>
          <DialogContent>
            <div className="space-y-6">
              <dl className="divide-y divide-gray-100 border-t border-gray-100">
                <Row label="Tracking number" value={delivery.trackingNumber} />
                <Row label="Courier" value={delivery.courier} />
                <Row
                  label="Estimated delivery"
                  value={delivery.estimatedDelivery}
                />
                <Row label="Shipping cost" value={`${delivery.shippingCost} BDT`} />
              </dl>

              <section>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Delivery status
                  </h4>
                  <StatusBadge status={delivery.status} />
                </div>

                {cancelled ? (
                  <div className="mt-4 rounded-lg border border-red-100 bg-red-50/60 p-4 text-sm font-medium text-red-700">
                    This delivery was cancelled.
                  </div>
                ) : (
                  <ol className="mt-4 flex items-center">
                    {STEPS.map((step, idx) => {
                      const done = idx <= currentStep;
                      const isLast = idx === STEPS.length - 1;
                      return (
                        <li
                          key={step}
                          className={cn('flex flex-col items-center', !isLast && 'flex-1')}
                        >
                          <div className="flex w-full items-center">
                            {!isLast ? (
                              <div
                                className={cn(
                                  'h-0.5 flex-1',
                                  idx < currentStep ? 'bg-primary' : 'bg-gray-200'
                                )}
                              />
                            ) : null}
                            <div
                              className={cn(
                                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold',
                                done
                                  ? 'border-primary bg-primary text-white'
                                  : 'border-gray-200 bg-white text-gray-400'
                              )}
                            >
                              {idx + 1}
                            </div>
                          </div>
                          <span
                            className={cn(
                              'mt-1.5 text-xs capitalize',
                              done ? 'font-medium text-gray-900' : 'text-gray-400'
                            )}
                          >
                            {step.replace('_', ' ')}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </section>
            </div>
          </DialogContent>
        </>
      ) : null}
    </Dialog>
  );
}