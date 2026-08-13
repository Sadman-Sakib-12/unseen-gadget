"use client";

import { useState } from "react";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { formatBDT } from "@/lib/load-dashboard-data";
import { Supplier } from "@/features/suppliers/types";

interface SuppliersTableProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
}

export function SuppliersTable({ suppliers, onEdit }: SuppliersTableProps) {
  const [search, setSearch] = useState("");

  const filtered = suppliers.filter((s) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      s.name.toLowerCase().includes(query) ||
      s.company.toLowerCase().includes(query) ||
      s.phone.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query)
    );
  });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-gray-900">
          Suppliers <span className="text-gray-400">({filtered.length})</span>
        </p>
        <SearchInput
          value={search}
          onValueChange={setSearch}
          placeholder="Search name, company, phone..."
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="No suppliers found"
          description="Try adjusting your search to find what you are looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Total Purchases</TableHead>
              <TableHead className="text-right">Due Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>
                  <p className="font-medium text-gray-900">{supplier.name}</p>
                  <p className="text-xs text-gray-500">{supplier.address}</p>
                </TableCell>
                <TableCell className="text-gray-700">{supplier.company}</TableCell>
                <TableCell className="text-gray-500">{supplier.phone}</TableCell>
                <TableCell className="text-gray-500">{supplier.email}</TableCell>
                <TableCell className="text-right font-semibold tabular-nums text-gray-900">
                  {formatBDT(supplier.totalPurchases)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  <span
                    className={
                      supplier.dueAmount > 0 ? "font-medium text-red-600" : "text-gray-600"
                    }
                  >
                    {formatBDT(supplier.dueAmount)}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={supplier.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(supplier)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="border-t border-gray-100 px-4 py-3">
        <p className="text-sm text-gray-500">
          Showing {filtered.length} of {suppliers.length} suppliers
        </p>
      </div>
    </div>
  );
}