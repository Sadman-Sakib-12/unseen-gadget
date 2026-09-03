'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatBDT, formatShortDate } from '@/lib/format';
import { apiRequest } from '@/lib/api';
import {
  CreditCard,
  Check,
  X,
  Copy,
  Receipt,
  ShoppingBag,
  User,
  Calendar,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import type { Payment } from '@/features/payments/types';

interface PaymentDetailsModalProps {
  payment: Payment | null;
  onClose: () => void;
  onStatusUpdated?: (paymentId: string, newStatus: string) => void;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? 'Copied to clipboard' : 'Copy'}
      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
    >
      {copied ? (
        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
          <Check className="h-3 w-3" /> Copied
        </span>
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

function mapMethod(method: string) {
  const map: Record<string, string> = {
    bKash: 'bKash',
    Nagad: 'Nagad',
    CARD: 'Card',
    MOBILE_BANKING: 'Mobile Banking',
    CASH_ON_DELIVERY: 'Cash on Delivery',
    COD: 'Cash on Delivery',
    BANK_TRANSFER: 'Bank Transfer',
  };
  return map[method] || method;
}

function mapStatus(status: string) {
  const map: Record<string, string> = {
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    PAID: 'Paid',
    FAILED: 'Failed',
    REFUNDED: 'Refunded',
  };
  return map[status] || status;
}

export function PaymentDetailsModal({
  payment,
  onClose,
  onStatusUpdated,
}: PaymentDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const handleAction = async (action: 'approve' | 'reject') => {
    if (!payment) return;
    setLoading(true);
    setActionType(action);
    try {
      await apiRequest(`/admin/payments/${payment.id}/${action}`, {
        method: 'PATCH',
      });
      const newStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';
      onStatusUpdated?.(payment.id, newStatus);
      onClose();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      alert(errorObj.message || `Failed to ${action} payment`);
    } finally {
      setLoading(false);
      setActionType(null);
    }
  };

  const isPending = payment?.status?.toUpperCase() === 'PENDING';

  return (
    <Dialog open={payment !== null} onOpenChange={onClose} size="xl" className="max-w-xl">
      {payment ? (
        <>
          <DialogHeader close className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-slate-900">Payment Details</DialogTitle>
                <p className="text-xs text-slate-500">Transaction & order verification</p>
              </div>
            </div>
          </DialogHeader>

          <DialogContent className="space-y-4 px-6 py-5">
            {/* Top Summary Card: Amount, Status & Method */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100/60 p-4 sm:p-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Payment Amount
                </span>
                <div className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {formatBDT(payment.amount)}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <StatusBadge status={mapStatus(payment.status)} />
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs border border-slate-200">
                  <CreditCard className="h-3.5 w-3.5 text-primary" />
                  {mapMethod(payment.method)}
                </span>
              </div>
            </div>

            {/* Information 2-Column Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Transaction Box */}
              <div className="space-y-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-bold text-slate-700">
                  <Receipt className="h-4 w-4 text-slate-400" />
                  Transaction Info
                </div>

                <div>
                  <span className="text-[11px] font-medium text-slate-400">Transaction ID</span>
                  <div className="mt-0.5 flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800 break-all">
                      {payment.transactionId || 'N/A'}
                    </span>
                    {payment.transactionId ? <CopyButton text={payment.transactionId} /> : null}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-slate-400">Payment ID</span>
                  <div className="mt-0.5 flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] text-slate-600 break-all">
                      {payment.id}
                    </span>
                    <CopyButton text={payment.id} />
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-slate-400">Gateway / Provider</span>
                  <div className="mt-0.5 text-xs font-semibold text-slate-800">
                    {payment.paymentGateway || mapMethod(payment.method)}
                  </div>
                </div>
              </div>

              {/* Order & Customer Box */}
              <div className="space-y-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-bold text-slate-700">
                  <ShoppingBag className="h-4 w-4 text-slate-400" />
                  Order & Customer
                </div>

                <div>
                  <span className="text-[11px] font-medium text-slate-400">Order ID</span>
                  <div className="mt-0.5 flex items-center justify-between gap-2">
                    <Link
                      href={`/orders/${payment.orderId}`}
                      className="font-mono text-xs font-bold text-primary hover:underline flex items-center gap-1 break-all"
                    >
                      {payment.orderId}
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </Link>
                    <CopyButton text={payment.orderId} />
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-slate-400">Customer</span>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate">{payment.customerName || 'Walk-in Customer'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-slate-400">Transaction Date</span>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{formatShortDate(payment.date)}</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>

          {/* Dialog Footer Actions */}
          <DialogFooter className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-2xs hover:bg-slate-50 transition"
            >
              Close
            </button>

            {isPending ? (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleAction('reject')}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 shadow-2xs transition hover:bg-red-100 hover:border-red-300 disabled:opacity-50"
                >
                  {loading && actionType === 'reject' ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <X className="h-3.5 w-3.5" />
                  )}
                  Reject Payment
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleAction('approve')}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  {loading && actionType === 'approve' ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                  )}
                  Approve Payment
                </button>
              </div>
            ) : null}
          </DialogFooter>
        </>
      ) : null}
    </Dialog>
  );
}