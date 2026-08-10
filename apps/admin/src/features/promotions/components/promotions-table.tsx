"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Promotion } from "@/features/promotions/types";

const statusVariants: Record<string, string> = {
  active: "success",
  scheduled: "warning",
  ended: "secondary",
};

export function PromotionsTable({ data }: { data: Promotion[] }) {
  const [search, setSearch] = useState("");
  const filtered = data.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search promotions..."
        className="w-full max-w-sm rounded-md border border-gray-200 px-3 py-2 text-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">ID</th>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Type</th>
              <th className="px-4 py-3 text-left font-medium">Discount</th>
              <th className="px-4 py-3 text-left font-medium">Applicable To</th>
              <th className="px-4 py-3 text-left font-medium">Duration</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((promo) => (
              <tr key={promo.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs">{promo.id}</td>
                <td className="px-4 py-3 font-medium">{promo.name}</td>
                <td className="px-4 py-3 capitalize">{promo.type.replace("_", " ")}</td>
                <td className="px-4 py-3">
                  {promo.discountType === "percentage" ? promo.discountValue + "%" : promo.discountValue + " BDT"}
                </td>
                <td className="px-4 py-3 capitalize">{promo.applicableTo}</td>
                <td className="px-4 py-3">{promo.startDate} - {promo.endDate}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariants[promo.status] as any}>{promo.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500">Showing {filtered.length} of {data.length} promotions</p>
    </div>
  );
}
