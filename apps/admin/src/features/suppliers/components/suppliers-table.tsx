"use client";

import { useMemo, useState } from "react";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { StatusBadge } from "@/components/ui/status-badge";
import { TablePanel } from "@/components/ui/table-panel";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBDT } from "@/lib/format";
import { Supplier } from "@/features/suppliers/types";

interface SuppliersTableProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
}

const PAGE_SIZE = 10;

export function SuppliersTable({ suppliers, onEdit }: SuppliersTableProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return suppliers;
    return suppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.company.toLowerCase().includes(query) ||
        s.phone.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query)
    );
  }, [suppliers, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <TablePanel
      title="Suppliers"
      count={filtered.length}
      toolbar={
        <SearchInput
          value={search}
          onValueChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Search name, company, phone..."
        />
      }
      footer={
        filtered.length > 0 ? (
          <Pagination
            page={safePage}
            pageCount={totalPages}
            total={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        ) : null
      }
    >
      {rows.length === 0 ? (
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
            {rows.map((supplier) => (
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
    </TablePanel>
  );
}