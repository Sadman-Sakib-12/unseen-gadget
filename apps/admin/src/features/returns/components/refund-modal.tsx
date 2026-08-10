"use client";
import { X } from "lucide-react";
import { useState } from "react";
import { Return } from "@/features/returns/types";

interface RefundModalProps {
  ret: Return | null;
  onClose: () => void;
  onConfirm: (returnId: string) => void;
}

export function RefundModal({ ret, onClose, onConfirm }: RefundModalProps) {
  if (!ret) return null;
  const [reason, setReason] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(ret.id);
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Process Refund</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <p className="text-sm text-gray-500 mb-4">Refund amount: {ret.refundAmount.toLocaleString()} BDT for {ret.product}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Refund Reason</label>
            <textarea className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} required />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
            <button type="submit" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Confirm Refund</button>
          </div>
        </form>
      </div>
    </div>
  );
}
