"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Return } from "@/features/returns/types";

const statusVariants: Record<string, string> = {
  pending: "warning",
  approved: "success",
  rejected: "destructive",
  refunded: "secondary",
};

export function ReturnsTable({ data }: { data: Return[] }) {
  const [search, setSearch] = useState("");
  const filtered = data.filter((r) =>
    r.customerName.toLowerCase().includes(search.toLowerCase()) ||
    r.orderId.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search returns..."
        className="w-full max-w-sm rounded-md border border-gray-200 px-3 py-2 text-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">ID</th>
              <th className="px-4 py-3 text-left font-medium">Order</th>
              <th className="px-4 py-3 text-left font-medium">Customer</th>
              <th className="px-4 py-3 text-left font-medium">Product</th>
              <th className="px-4 py-3 text-left font-medium">Reason</th>
              <th className="px-4 py-3 text-left font-medium">Refund</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((ret) => (
              <tr key={ret.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs">{ret.id}</td>
                <td className="px-4 py-3">{ret.orderId}</td>
                <td className="px-4 py-3">{ret.customerName}</td>
                <td className="px-4 py-3">{ret.product}</td>
                <td className="px-4 py-3">{ret.reason}</td>
                <td className="px-4 py-3">{ret.refundAmount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariants[ret.status] as any}>{ret.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500">Showing {filtered.length} of {data.length} returns</p>
    </div>
  );
}
