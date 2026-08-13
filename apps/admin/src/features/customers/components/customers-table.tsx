'use client';

import { useState } from 'react';
import { BatteryCharging } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchInput } from '@/components/ui/search-input';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Customer } from '@/features/customers/types';
import { formatBDT } from '@/lib/load-dashboard-data';

interface CustomersTableProps {
  data: Customer[];
  onView?: (customer: Customer) => void;
}

export function CustomersTable({ data, onView }: CustomersTableProps) {
  const [search, setSearch] = useState('');

  const filtered = data.filter((customer) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.id.toLowerCase().includes(query) ||
      customer.city.toLowerCase().includes(query)
    );
  });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-gray-900">
          Customers <span className="text-gray-400">({filtered.length})</span>
        </p>
        <SearchInput
          value={search}
          onValueChange={setSearch}
          placeholder="Search name, email, ID..."
        />
      </div>

      {filtered.length === 0 ? (
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((customer) => (
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
                  {customer.joinDate}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="border-t border-gray-100 px-4 py-3">
        <p className="text-sm text-gray-500">
          Showing {filtered.length} of {data.length} customers
        </p>
      </div>
    </div>
  );
}