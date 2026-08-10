"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Payment } from "@/features/payments/types";

const statusVariants: Record<string, string> = {
  completed: "success",
  pending: "warning",
  failed: "destructive",
  refunded: "secondary",
};

export function PaymentsTable({ data }: { data: Payment[] }) {
  const [search, setSearch] = useState("");
  const filtered = data.filter((p) =>
    p.customerName.toLowerCase().includes(search.toLowerCase()) ||
    p.transactionId.toLowerCase().includes(search.toLowerCase()) ||
    p.orderId.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search payments..."
        className="w-full max-w-sm rounded-md border border-gray-200 px-3 py-2 text-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">ID</th>
              <th className="px-4 py-3 text-left font-medium">Transaction</th>
              <th className="px-4 py-3 text-left font-medium">Customer</th>
              <th className="px-4 py-3 text-left font-medium">Amount</th>
              <th className="px-4 py-3 text-left font-medium">Method</th>
              <th className="px-4 py-3 text-left font-medium">Gateway</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs">{payment.id}</td>
                <td className="px-4 py-3 font-mono text-xs">{payment.transactionId}</td>
                <td className="px-4 py-3">{payment.customerName}</td>
                <td className="px-4 py-3">{payment.amount.toLocaleString()}</td>
                <td className="px-4 py-3 capitalize">{payment.method.replace("_", " ")}</td>
                <td className="px-4 py-3">{payment.paymentGateway}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariants[payment.status] as any}>{payment.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500">Showing {filtered.length} of {data.length} payments</p>
    </div>
  );
}
