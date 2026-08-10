"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Admin } from "@/features/admin-management/types";

const statusVariants: Record<string, string> = {
  active: "success",
  inactive: "secondary",
};

export function AdminsTable({ data }: { data: Admin[] }) {
  const [search, setSearch] = useState("");
  const filtered = data.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search admins..."
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
              <th className="px-4 py-3 text-left font-medium">Role</th>
              <th className="px-4 py-3 text-left font-medium">Last Login</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs">{admin.id}</td>
                <td className="px-4 py-3 font-medium">{admin.name}</td>
                <td className="px-4 py-3">{admin.email}</td>
                <td className="px-4 py-3">{admin.role}</td>
                <td className="px-4 py-3">{admin.lastLogin}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariants[admin.status] as any}>{admin.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500">Showing {filtered.length} of {data.length} admins</p>
    </div>
  );
}
