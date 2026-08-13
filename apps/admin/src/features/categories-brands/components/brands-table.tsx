"use client";
import { useState } from "react";
import { Building2 } from "lucide-react";
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
import type { Brand } from "@/features/categories-brands/types";

export function BrandsTable({ data }: { data: Brand[] }) {
  const [search, setSearch] = useState("");
  const filtered = data.filter((b) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return b.name.toLowerCase().includes(query) || b.slug.toLowerCase().includes(query);
  });
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-gray-900">
          Brands <span className="text-gray-400">({filtered.length})</span>
        </p>
        <SearchInput
          value={search}
          onValueChange={setSearch}
          placeholder="Search name, slug..."
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No brands found"
          description="Try adjusting your search to find what you are looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell>
                  <span className="font-mono text-xs text-gray-500">{brand.id}</span>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-gray-900">{brand.name}</p>
                </TableCell>
                <TableCell className="text-gray-600">{brand.slug}</TableCell>
                <TableCell className="max-w-sm truncate text-gray-600">
                  {brand.description}
                </TableCell>
                <TableCell>
                  <StatusBadge status={brand.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="border-t border-gray-100 px-4 py-3">
        <p className="text-sm text-gray-500">
          Showing {filtered.length} of {data.length} brands
        </p>
      </div>
    </div>
  );
}