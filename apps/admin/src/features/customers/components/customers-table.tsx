'use client';

import { useMemo, useState } from 'react';
import { BatteryCharging, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchInput } from '@/components/ui/search-input';
import { StatusBadge } from '@/components/ui/status-badge';
import { TablePanel } from '@/components/ui/table-panel';
import { Pagination } from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatBDT, formatShortDate } from '@/lib/format';
import type { Customer } from '@/features/customers/types';

interface CustomersTableProps {
  data: Customer[];
  onView?: (customer: Customer) => void;
}

const PAGE_SIZE = 10;

export function CustomersTable({ data, onView }: CustomersTableProps) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data;
    return data.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.id.toLowerCase().includes(query) ||
        customer.city.toLowerCase().includes(query)
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <TablePanel
      title="Customers"
      count={filtered.length}
      toolbar={
        <SearchInput
          value={search}
          onValueChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Search name, email, ID..."
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
          icon={BatteryCharging}
          title="No customers found"
          description="Try adjusting your search to find who you are looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>City</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead className="text-right">Total spent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              {onView ? <TableHead className="text-right">Actions</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((customer) => (
              <TableRow
                key={customer.id}
                onClick={() => onView?.(customer)}
                className={onView ? 'cursor-pointer' : undefined}
              >
                <TableCell>
                  <span className="font-mono text-xs text-gray-500">{customer.id}</span>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-gray-900">{customer.name}</p>
                </TableCell>
                <TableCell className="text-gray-600">{customer.email}</TableCell>
                <TableCell className="text-gray-600">{customer.city}</TableCell>
                <TableCell className="text-right tabular-nums text-gray-900">
                  {customer.totalOrders}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums text-gray-900">
                  {formatBDT(customer.totalSpent)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={customer.status} />
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm text-gray-500">
                  {formatShortDate(customer.joinDate)}
                </TableCell>
                {onView ? (
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(customer)}
                      className="text-gray-600"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View {customer.name}</span>
                      View
                    </Button>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TablePanel>
  );
}