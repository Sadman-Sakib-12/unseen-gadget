"use client";
import { useMemo, useState } from "react";
import { Building2, Pencil, Trash2 } from "lucide-react";
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
import type { Brand } from "@/features/categories-brands/types";
import { BrandLogo } from "./brand-logo";

interface BrandsTableProps {
  data: Brand[];
  onEdit: (brand: Brand) => void;
  onDelete: (brandId: string) => void;
}

const PAGE_SIZE = 10;

export function BrandsTable({ data, onEdit, onDelete }: BrandsTableProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data;
    return data.filter(
      (b) =>
        b.name.toLowerCase().includes(query) || b.slug.toLowerCase().includes(query)
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <TablePanel
      title="Brands"
      count={filtered.length}
      toolbar={
        <SearchInput
          value={search}
          onValueChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Search name, slug..."
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell>
                  <span className="font-mono text-xs text-gray-500">{brand.id}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <BrandLogo name={brand.name} logo={brand.logo} />
                    <p className="min-w-0 font-medium text-gray-900">{brand.name}</p>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{brand.slug}</TableCell>
                <TableCell className="max-w-sm truncate text-gray-600">
                  {brand.description}
                </TableCell>
                <TableCell>
                  <StatusBadge status={brand.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(brand)}
                      aria-label={`Edit ${brand.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(brand.id)}
                      aria-label={`Delete ${brand.name}`}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TablePanel>
  );
}