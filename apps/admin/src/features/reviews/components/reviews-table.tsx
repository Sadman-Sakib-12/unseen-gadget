"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Review } from "@/features/reviews/types";

const statusVariants: Record<string, string> = {
  pending: "warning",
  approved: "success",
  rejected: "destructive",
};

export function ReviewsTable({ data }: { data: Review[] }) {
  const [search, setSearch] = useState("");
  const filtered = data.filter((r) =>
    r.productName.toLowerCase().includes(search.toLowerCase()) ||
    r.customerName.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search reviews..."
        className="w-full max-w-sm rounded-md border border-gray-200 px-3 py-2 text-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">ID</th>
              <th className="px-4 py-3 text-left font-medium">Product</th>
              <th className="px-4 py-3 text-left font-medium">Customer</th>
              <th className="px-4 py-3 text-left font-medium">Rating</th>
              <th className="px-4 py-3 text-left font-medium">Comment</th>
              <th className="px-4 py-3 text-left font-medium">Helpful</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((review) => (
              <tr key={review.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs">{review.id}</td>
                <td className="px-4 py-3 font-medium">{review.productName}</td>
                <td className="px-4 py-3">{review.customerName}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span>{review.rating}</span>
                  </div>
                </td>
                <td className="px-4 py-3 max-w-xs truncate">{review.comment}</td>
                <td className="px-4 py-3">{review.helpful}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariants[review.status] as any}>{review.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500">Showing {filtered.length} of {data.length} reviews</p>
    </div>
  );
}
