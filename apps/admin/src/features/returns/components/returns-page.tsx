"use client";
import { useState } from "react";
import { ReturnsTable } from "@/features/returns/components/returns-table";
import { ReturnDetailsModal } from "@/features/returns/components/return-details-modal";
import { RefundModal } from "@/features/returns/components/refund-modal";
import initialReturns from "@/features/returns/data/returns.json";
import { Return } from "@/features/returns/types";

export function ReturnsPage() {
  const [returns, setReturns] = useState<Return[]>(initialReturns);
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
  const [refundModal, setRefundModal] = useState<Return | null>(null);

  const handleRefund = (returnId: string) => {
    setReturns(returns.map((r) => (r.id === returnId ? { ...r, status: "refunded", resolvedDate: new Date().toISOString().split("T")[0] } : r)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Returns</h1>
        <p className="text-gray-500">Manage product returns and refunds</p>
      </div>
      <ReturnsTable data={returns} />
      <ReturnDetailsModal ret={selectedReturn} onClose={() => setSelectedReturn(null)} />
      <RefundModal ret={refundModal} onClose={() => setRefundModal(null)} onConfirm={handleRefund} />
    </div>
  );
}
