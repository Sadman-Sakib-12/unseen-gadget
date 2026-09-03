"use client";
import { useMemo, useState } from "react";
import { Pencil, Users } from "lucide-react";
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
import { formatShortDate } from "@/lib/format";
import type { Admin } from "@/features/admin-management/types";

interface AdminsTableProps {
  data: Admin[];
  onEdit?: (admin: Admin) => void;
}

const PAGE_SIZE = 10;

export function AdminsTable({ data, onEdit }: AdminsTableProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data;
    return data.filter(
      (a) =>
        a.name.toLowerCase().includes(query) || a.email.toLowerCase().includes(query)
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <TablePanel
      title="Admins"
      count={filtered.length}
      toolbar={
        <SearchInput
          value={search}
          onValueChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Search name, email..."
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
              {onEdit ? <TableHead className="text-right">Actions</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((admin) => {
              const roleName =
                typeof admin.role === "object" && admin.role !== null
                  ? (admin.role as { name?: string }).name || "Admin"
                  : typeof admin.role === "string"
                  ? admin.role
                  : "Admin";

              return (
                <TableRow key={admin.id}>
                  <TableCell>
                    <span className="font-mono text-xs text-gray-500">{admin.id}</span>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-gray-900">{admin.name}</p>
                  </TableCell>
                  <TableCell className="text-gray-600">{admin.email}</TableCell>
                  <TableCell className="text-gray-600 font-medium">{roleName}</TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-gray-500">
                    {admin.lastLogin ? formatShortDate(admin.lastLogin) : "Never"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={admin.status} />
                  </TableCell>
                  {onEdit ? (
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(admin)}
                        aria-label={`Edit admin ${admin.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  ) : null}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </TablePanel>
  );
}