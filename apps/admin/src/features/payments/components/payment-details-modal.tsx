"use client";
import { X } from "lucide-react";
import { Payment } from "@/features/payments/types";

interface PaymentDetailsModalProps {
  payment: Payment | null;
  onClose: () => void;
}

export function PaymentDetailsModal({ payment, onClose }: PaymentDetailsModalProps) {
  if (!payment) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Payment Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Payment ID</p>
              <p className="font-mono text-sm">{payment.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Transaction ID</p>
              <p className="font-mono text-sm">{payment.transactionId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="text-sm">{payment.orderId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="text-sm">{payment.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="text-sm">{payment.amount.toLocaleString()} BDT</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Method</p>
              <p className="text-sm capitalize">{payment.method.replace("_", " ")}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gateway</p>
              <p className="text-sm">{payment.paymentGateway}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="text-sm">{payment.date}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
