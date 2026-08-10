"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Coupon } from "@/features/coupons/types";

const statusVariants: Record<string, string> = {
  active: "success",
  inactive: "secondary",
  expired: "destructive",
};

export function CouponsTable({ data }: { data: Coupon[] }) {
  const [search, setSearch] = useState("");
  const filtered = data.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search coupons..."
        className="w-full max-w-sm rounded-md border border-gray-200 px-3 py-2 text-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">ID</th>
              <th className="px-4 py-3 text-left font-medium">Code</th>
              <th className="px-4 py-3 text-left font-medium">Discount</th>
              <th className="px-4 py-3 text-left font-medium">Min Order</th>
              <th className="px-4 py-3 text-left font-medium">Used</th>
              <th className="px-4 py-3 text-left font-medium">Expiry</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs">{coupon.id}</td>
                <td className="px-4 py-3 font-mono font-medium">{coupon.code}</td>
                <td className="px-4 py-3">
                  {coupon.discountType === "percentage" ? coupon.discountValue + "%" : coupon.discountValue + " BDT"}
                </td>
                <td className="px-4 py-3">{coupon.minimumOrder.toLocaleString()}</td>
                <td className="px-4 py-3">{coupon.usedCount} / {coupon.usageLimit}</td>
                <td className="px-4 py-3">{coupon.expiryDate}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariants[coupon.status] as any}>{coupon.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500">Showing {filtered.length} of {data.length} coupons</p>
    </div>
  );
}
