"use client";
import { useState } from "react";
import { Users } from "lucide-react";
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
import type { Admin } from "@/features/admin-management/types";

export function AdminsTable({ data }: { data: Admin[] }) {
  const [search, setSearch] = useState("");
  const filtered = data.filter((a) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return a.name.toLowerCase().includes(query) || a.email.toLowerCase().includes(query);
  });
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-gray-900">
          Admins <span className="text-gray-400">({filtered.length})</span>
        </p>
        <SearchInput
          value={search}
          onValueChange={setSearch}
          placeholder="Search name, email..."
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No admins found"
          description="Try adjusting your search to find what you are looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>
                  <span className="font-mono text-xs text-gray-500">{admin.id}</span>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-gray-900">{admin.name}</p>
                </TableCell>
                <TableCell className="text-gray-600">{admin.email}</TableCell>
                <TableCell className="text-gray-600">{admin.role}</TableCell>
                <TableCell className="whitespace-nowrap text-sm text-gray-500">
                  {admin.lastLogin || "Never"}
                </TableCell>
                <TableCell>
                  <StatusBadge status={admin.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="border-t border-gray-100 px-4 py-3">
        <p className="text-sm text-gray-500">
          Showing {filtered.length} of {data.length} admins
        </p>
      </div>
    </div>
  );
}