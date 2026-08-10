"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Delivery } from "@/features/delivery/types";

const statusVariants: Record<string, string> = {
  pending: "secondary",
  picked_up: "warning",
  in_transit: "default",
  delivered: "success",
  cancelled: "destructive",
};

export function DeliveriesTable({ data }: { data: Delivery[] }) {
  const [search, setSearch] = useState("");
  const filtered = data.filter((d) =>
    d.customerName.toLowerCase().includes(search.toLowerCase()) ||
    d.orderId.toLowerCase().includes(search.toLowerCase()) ||
    d.trackingNumber.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search deliveries..."
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
              <th className="px-4 py-3 text-left font-medium">Courier</th>
              <th className="px-4 py-3 text-left font-medium">Tracking</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((delivery) => (
              <tr key={delivery.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs">{delivery.id}</td>
                <td className="px-4 py-3">{delivery.orderId}</td>
                <td className="px-4 py-3">{delivery.customerName}</td>
                <td className="px-4 py-3">{delivery.courier}</td>
                <td className="px-4 py-3 font-mono text-xs">{delivery.trackingNumber}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariants[delivery.status] as any}>{delivery.status.replace("_", " ")}</Badge>
                </td>
                <td className="px-4 py-3">{delivery.shippingCost} BDT</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500">Showing {filtered.length} of {data.length} deliveries</p>
    </div>
  );
}
