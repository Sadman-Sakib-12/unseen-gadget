"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/features/categories-brands/types";

const statusVariants: Record<string, string> = {
  active: "success",
  inactive: "secondary",
};

export function CategoriesTable({ data }: { data: Category[] }) {
  const [search, setSearch] = useState("");
  const filtered = data.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search categories..."
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
              <th className="px-4 py-3 text-left font-medium">Slug</th>
              <th className="px-4 py-3 text-left font-medium">Parent</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs">{cat.id}</td>
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3">{cat.slug}</td>
                <td className="px-4 py-3">{cat.parentId || "None"}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariants[cat.status] as any}>{cat.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500">Showing {filtered.length} of {data.length} categories</p>
    </div>
  );
}
