"use client";
import { useState } from "react";
import { Tags } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Category } from "@/features/categories-brands/types";

export function CategoriesTable({ data }: { data: Category[] }) {
  const [search, setSearch] = useState("");
  const filtered = data.filter((c) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return c.name.toLowerCase().includes(query) || c.slug.toLowerCase().includes(query);
  });
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-gray-900">
          Categories <span className="text-gray-400">({filtered.length})</span>
        </p>
        <SearchInput
          value={search}
          onValueChange={setSearch}
          placeholder="Search name, slug..."
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Tags}
          title="No categories found"
          description="Try adjusting your search to find what you are looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>
                  <span className="font-mono text-xs text-gray-500">{cat.id}</span>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-gray-900">{cat.name}</p>
                </TableCell>
                <TableCell className="text-gray-600">{cat.slug}</TableCell>
                <TableCell className="text-gray-600">{cat.parentId || "None"}</TableCell>
                <TableCell>
                  <StatusBadge status={cat.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="border-t border-gray-100 px-4 py-3">
        <p className="text-sm text-gray-500">
          Showing {filtered.length} of {data.length} categories
        </p>
      </div>
    </div>
  );
}