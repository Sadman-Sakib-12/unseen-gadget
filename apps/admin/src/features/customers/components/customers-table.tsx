"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Customer } from "@/features/customers/types";

const statusVariants: Record<string, string> = {
  active: "success",
  inactive: "secondary",
  blocked: "destructive",
};

export function CustomersTable({ data, onView }: { data: Customer[]; onView?: (c: Customer) => void }) {
  const [search, setSearch] = useState("");
  const filtered = data.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search customers..."
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
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">City</th>
              <th className="px-4 py-3 text-left font-medium">Orders</th>
              <th className="px-4 py-3 text-left font-medium">Spent</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onView?.(customer)}>
                <td className="px-4 py-3 font-mono text-xs">{customer.id}</td>
                <td className="px-4 py-3 font-medium">{customer.name}</td>
                <td className="px-4 py-3">{customer.email}</td>
                <td className="px-4 py-3">{customer.city}</td>
                <td className="px-4 py-3">{customer.totalOrders}</td>
                <td className="px-4 py-3">{customer.totalSpent.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariants[customer.status] as any}>{customer.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500">Showing {filtered.length} of {data.length} customers</p>
    </div>
  );
}
