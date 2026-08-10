"use client";
import { X } from "lucide-react";
import { Return } from "@/features/returns/types";

interface ReturnDetailsModalProps {
  ret: Return | null;
  onClose: () => void;
}

export function ReturnDetailsModal({ ret, onClose }: ReturnDetailsModalProps) {
  if (!ret) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Return Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Return ID</p>
              <p className="font-mono text-sm">{ret.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="text-sm">{ret.orderId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="text-sm">{ret.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Product</p>
              <p className="text-sm">{ret.product}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Reason</p>
              <p className="text-sm">{ret.reason}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Refund Amount</p>
              <p className="text-sm">{ret.refundAmount.toLocaleString()} BDT</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-sm capitalize">{ret.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Request Date</p>
              <p className="text-sm">{ret.requestDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Resolved Date</p>
              <p className="text-sm">{ret.resolvedDate || "Pending"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
