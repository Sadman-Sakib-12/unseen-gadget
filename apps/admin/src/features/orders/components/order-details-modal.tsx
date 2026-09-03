'use client';

import { useEffect } from 'react';
import { Calendar, MapPin, Printer, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/components/ui/utils';
import { formatBDT, formatShortDate } from '@/lib/format';
import type { Order } from '../types';

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
  onStatusChange: (orderId: string, status: Order['status']) => void;
  onPaymentStatusChange?: (orderId: string, paymentStatus: string) => void;
}

const STATUS_ACTIONS: { label: string; value: Order['status'] }[] = [
  { label: 'Mark as Confirmed', value: 'CONFIRMED' },
  { label: 'Mark as Processing', value: 'PROCESSING' },
  { label: 'Mark as Shipped', value: 'SHIPPED' },
  { label: 'Mark as Delivered', value: 'DELIVERED' },
];

const PAYMENT_STATUS_ACTIONS: { label: string; value: string }[] = [
  { label: 'Mark as Paid (Cash/Online Received)', value: 'PAID' },
  { label: 'Mark as Approved', value: 'APPROVED' },
  { label: 'Mark as Pending', value: 'PENDING' },
  { label: 'Mark as Refunded', value: 'REFUNDED' },
];

const TIMELINE: { label: string; activeStatuses: string[] }[] = [
  { label: 'Order Placed', activeStatuses: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] },
  { label: 'Payment Confirmed', activeStatuses: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
  { label: 'Processing', activeStatuses: ['PROCESSING', 'SHIPPED', 'DELIVERED'] },
  { label: 'Shipped', activeStatuses: ['SHIPPED', 'DELIVERED'] },
  { label: 'Delivered', activeStatuses: ['DELIVERED'] },
];

function printInvoice(order: Order) {
  const items = order.items && order.items.length > 0 ? order.items : [
    {
      productName: order.product || 'Order Item',
      quantity: order.quantity || 1,
      total: order.total ?? order.amount ?? 0,
    }
  ];

  const row = (item: { productName: string; quantity: number; total: number }) =>
    `<tr>
      <td style="padding:8px 12px;border:1px solid #e5e7eb;font-size:13px">${item.productName || 'Product'}</td>
      <td style="padding:8px 12px;border:1px solid #e5e7eb;font-size:13px;text-align:center">${item.quantity || 1}</td>
      <td style="padding:8px 12px;border:1px solid #e5e7eb;font-size:13px;text-align:right">${formatBDT(item.total || 0)}</td>
    </tr>`;

  const email = order.email || order.customerEmail || '—';
  const phone = order.phone || order.customerPhone || '—';
  const address = [order.shippingAddress, order.city].filter(Boolean).join(', ') || '—';
  const subtotal = order.subtotal ?? order.total ?? order.amount ?? 0;
  const discount = order.discount ?? 0;
  const shippingCost = order.shippingCost ?? 0;
  const total = order.total ?? order.amount ?? 0;

  const invoiceHtml = `<!doctype html><html><head><title>Invoice ${order.id}</title></head>
<body style="margin:0;font-family:Inter,Arial,sans-serif;padding:0;background:#f8fafc">
  <div style="max-width:640px;margin:32px auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
    <div style="padding:24px 32px;border-bottom:1px solid #e5e7eb">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <p style="margin:0;font-size:18px;font-weight:700;color:#111827">Unseen Gadget</p>
          <p style="margin:2px 0 0;font-size:12px;color:#6b7280">Admin Portal · Invoice</p>
        </div>
        <p style="margin:0;font-size:14px;font-weight:600;color:#1c2b6e">#${order.id}</p>
      </div>
    </div>
    <div style="padding:24px 32px">
      <p style="margin:0 0 4px;font-size:13px;color:#6b7280">Billed to</p>
      <p style="margin:0;font-size:15px;font-weight:600;color:#111827">${order.customerName}</p>
      <p style="margin:2px 0;font-size:13px;color:#374151">${email} · ${phone}</p>
      <p style="margin:0;font-size:13px;color:#374151">${address}</p>
      <table style="width:100%;border-collapse:collapse;margin-top:20px">
        <thead><tr>
          <th style="padding:8px 12px;border:1px solid #e5e7eb;text-align:left;font-size:12px;color:#6b7280">Item</th>
          <th style="padding:8px 12px;border:1px solid #e5e7eb;text-align:center;font-size:12px;color:#6b7280">Qty</th>
          <th style="padding:8px 12px;border:1px solid #e5e7eb;text-align:right;font-size:12px;color:#6b7280">Total</th>
        </tr></thead>
        <tbody>${items.map(row).join('')}</tbody>
      </table>
      <div style="margin-top:16px;display:flex;justify-content:flex-end">
        <div style="font-size:13px;color:#374151">
          <p style="margin:0 0 4px;display:flex;justify-content:space-between;gap:32px">Subtotal <span>${formatBDT(subtotal)}</span></p>
          <p style="margin:0 0 4px;display:flex;justify-content:space-between;gap:32px">Discount <span>-${formatBDT(discount)}</span></p>
          <p style="margin:0 0 4px;display:flex;justify-content:space-between;gap:32px">Shipping <span>${formatBDT(shippingCost)}</span></p>
          <p style="margin:12px 0 0;padding-top:12px;border-top:1px dashed #e5e7eb;display:flex;justify-content:space-between;gap:32px;font-weight:700;color:#111827">Total <span>${formatBDT(total)}</span></p>
        </div>
      </div>
    </div>
    <div style="padding:16px 32px;border-top:1px solid #e5e7eb;text-align:center;font-size:12px;color:#9ca3af">Thank you for shopping with Unseen Gadget</div>
  </div>
</body></html>`;
  const win = window.open('', '_blank', 'width=760,height=640');
  if (!win) return;
  win.document.write(invoiceHtml);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 250);
}

export function OrderDetailsModal({ order, onClose, onStatusChange, onPaymentStatusChange }: OrderDetailsModalProps) {
  useEffect(() => {
    if (!order) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [order, onClose]);

  const items =
    order?.items && order.items.length > 0
      ? order.items
      : order
      ? [
          {
            id: 'default',
            productName: order.product || 'Standard Product',
            quantity: order.quantity || 1,
            price: order.total ?? order.amount ?? 0,
            total: order.total ?? order.amount ?? 0,
          },
        ]
      : [];

  const subtotal = order ? order.subtotal ?? order.total ?? order.amount ?? 0 : 0;
  const discount = order?.discount ?? 0;
  const shippingCost = order?.shippingCost ?? 0;
  const total = order ? order.total ?? order.amount ?? 0 : 0;
  const email = order?.email || order?.customerEmail || '—';
  const phone = order?.phone || order?.customerPhone || '—';
  const date = order?.date || order?.createdAt || '';

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-30 bg-gray-950/40 backdrop-blur-sm transition-opacity duration-300',
          order ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={order === null}
        className={cn(
          'fixed bottom-0 right-0 top-16 z-40 flex w-full flex-col border-l border-gray-200 bg-white shadow-xl transition-transform duration-300 ease-in-out sm:max-w-[400px] lg:top-0',
          order ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {order ? (
          <>
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold tracking-tight text-gray-900">
                    Order {order.id}
                  </h2>
                  <StatusBadge status={order.status || 'PENDING'} />
                </div>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
                  <Calendar className="h-3.5 w-3.5" />
                  Placed on {formatShortDate(date)}
                </p>
                <div className="mt-3">
                  <DropdownMenu
                    align="end"
                    trigger={
                      <Button variant="outline" size="sm">
                        Update status
                      </Button>
                    }
                  >
                    <DropdownMenuLabel>Update status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {STATUS_ACTIONS.map((action) => (
                      <DropdownMenuItem
                        key={action.value}
                        onSelect={() => onStatusChange(order.id, action.value)}
                      >
                        {action.label}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => onStatusChange(order.id, 'CANCELLED')}
                      className="text-red-600"
                    >
                      Cancel order
                    </DropdownMenuItem>
                  </DropdownMenu>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="shrink-0" onClick={onClose} aria-label="Close details">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 space-y-7 overflow-y-auto px-5 py-5">
              <section>
                <h3 className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <User className="h-4 w-4 text-gray-400" />
                  Customer
                </h3>
                <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-3.5">
                  <p className="text-sm font-semibold text-gray-900">{order.customerName || '—'}</p>
                  <p className="mt-0.5 text-sm text-gray-500">{email}</p>
                  <p className="mt-0.5 text-sm text-gray-500">{phone}</p>
                </div>
              </section>

              <section>
                <h3 className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  Shipping Address
                </h3>
                <p className="rounded-lg border border-gray-100 bg-gray-50/50 p-3.5 text-sm leading-relaxed text-gray-600">
                  {order.shippingAddress || 'No shipping address provided'}
                  {order.city ? (
                    <>
                      <br />
                      {order.city}
                    </>
                  ) : null}
                </p>
              </section>

              <section>
                <h3 className="mb-2.5 text-sm font-semibold text-gray-900">Order Items</h3>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50/60">
                      <tr className="border-b border-gray-100">
                        <th className="px-3 py-2 text-left font-medium text-gray-500">Item</th>
                        <th className="px-3 py-2 text-right font-medium text-gray-500">Qty</th>
                        <th className="px-3 py-2 text-right font-medium text-gray-500">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => (
                        <tr key={item.id || idx} className="border-b border-gray-100 last:border-0">
                          <td className="px-3 py-2 font-medium text-gray-900">{item.productName}</td>
                          <td className="px-3 py-2 text-right tabular-nums text-gray-700">{item.quantity}</td>
                          <td className="px-3 py-2 text-right tabular-nums text-gray-900">{formatBDT(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <dt>Subtotal</dt>
                    <dd className="font-medium text-gray-900">{formatBDT(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <dt>Discount</dt>
                    <dd className="font-medium text-emerald-600">−{formatBDT(discount)}</dd>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <dt>Shipping</dt>
                    <dd className="font-medium text-gray-900">{formatBDT(shippingCost)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-dashed border-gray-200 pt-2">
                    <dt className="font-semibold text-gray-900">Total</dt>
                    <dd className="font-bold text-primary">{formatBDT(total)}</dd>
                  </div>
                </dl>
              </section>

              <section>
                <div className="mb-2.5 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Payment Information</h3>
                  {onPaymentStatusChange && order.paymentStatus !== 'PAID' && (
                    <Button
                      size="sm"
                      variant="default"
                      className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => onPaymentStatusChange(order.id, 'PAID')}
                    >
                      Mark as Paid (Cash Received)
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-y-3 rounded-lg border border-gray-100 bg-gray-50/50 p-3.5 text-sm">
                  <span className="text-gray-500">Payment Status</span>
                  <div className="flex items-center justify-end gap-2">
                    <StatusBadge status={order.paymentStatus || 'PENDING'} />
                    {onPaymentStatusChange && (
                      <DropdownMenu
                        align="end"
                        trigger={
                          <Button variant="ghost" size="sm" className="h-6 px-1.5 text-xs text-gray-500">
                            Change
                          </Button>
                        }
                      >
                        <DropdownMenuLabel>Update Payment</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {PAYMENT_STATUS_ACTIONS.map((action) => (
                          <DropdownMenuItem
                            key={action.value}
                            onSelect={() => onPaymentStatusChange(order.id, action.value)}
                          >
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenu>
                    )}
                  </div>
                  <span className="text-gray-500">Payment Method</span>
                  <span className="text-right font-medium text-gray-900 capitalize">
                    {order.paymentMethod ? order.paymentMethod.replace(/_/g, ' ').toLowerCase() : 'Cash on Delivery'}
                  </span>
                  <span className="text-gray-500">Amount</span>
                  <span className="text-right font-medium text-gray-900">{formatBDT(total)}</span>
                </div>
              </section>

              <section>
                <h3 className="mb-4 text-sm font-semibold text-gray-900">Order Timeline</h3>
                <div className="relative ml-1.5 space-y-5 border-l border-gray-200 pl-5">
                  {TIMELINE.map((step, idx) => {
                    const isCompleted = step.activeStatuses.includes(order.status.toUpperCase());
                    return (
                      <div key={idx} className="relative">
                        <span
                          className={cn(
                            'absolute -left-[26px] top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white',
                            isCompleted ? 'bg-emerald-500' : 'bg-gray-300'
                          )}
                        />
                        <p
                          className={cn(
                            'text-sm font-semibold',
                            isCompleted ? 'text-gray-900' : 'text-gray-400'
                          )}
                        >
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            <div className="flex shrink-0 justify-end border-t border-gray-100 bg-gray-50/60 px-5 py-4">
              <Button variant="outline" onClick={() => printInvoice(order)}>
                <Printer className="h-4 w-4" />
                Print Invoice
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}