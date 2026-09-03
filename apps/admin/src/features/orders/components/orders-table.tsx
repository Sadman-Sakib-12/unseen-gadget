'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchInput } from '@/components/ui/search-input';
import { Select } from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TablePanel } from '@/components/ui/table-panel';
import { Pagination } from '@/components/ui/pagination';
import { cn } from '@/components/ui/utils';
import { formatBDT, formatShortDate } from '@/lib/format';
import type { Order } from '../types';

interface OrdersTableProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onStatusChange: (orderId: string, status: Order['status']) => void;
  onDeleteOrder?: (order: Order) => void;
}

type SortField = 'customerName' | 'amount' | 'date' | 'status';
type SortDirection = 'asc' | 'desc';

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const PAYMENT_OPTIONS = [
  { value: 'ALL', label: 'All payment' },
  { value: 'PAID', label: 'Paid' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'REFUNDED', label: 'Refunded' },
];

const STATUS_ACTIONS: { label: string; value: Order['status'] }[] = [
  { label: 'Mark as Confirmed', value: 'CONFIRMED' },
  { label: 'Mark as Processing', value: 'PROCESSING' },
  { label: 'Mark as Shipped', value: 'SHIPPED' },
  { label: 'Mark as Delivered', value: 'DELIVERED' },
];

function SortIndicator({ active, direction }: { active: boolean; direction: SortDirection }) {
  if (!active) return <ChevronUp className="h-3.5 w-3.5 text-gray-300" />;
  return direction === 'asc' ? (
    <ChevronUp className="h-3.5 w-3.5" />
  ) : (
    <ChevronDown className="h-3.5 w-3.5" />
  );
}

function SortableHeader({
  label,
  field,
  sortField,
  sortDirection,
  onSort,
  align = 'left',
}: {
  label: string;
  field: SortField;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  align?: 'left' | 'right';
}) {
  return (
    <TableHead
      onClick={() => onSort(field)}
      className={cn(
        'cursor-pointer select-none transition-colors hover:text-gray-900',
        align === 'right' && 'text-right'
      )}
    >
      <span
        className={cn(
          'inline-flex items-center gap-1',
          align === 'right' && 'justify-end'
        )}
      >
        {label}
        <SortIndicator active={sortField === field} direction={sortDirection} />
      </span>
    </TableHead>
  );
}

export function OrdersTable({ orders, onViewOrder, onStatusChange, onDeleteOrder }: OrdersTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const itemsPerPage = 10;

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let result = (orders || []).filter((order) => {
      if (!order) return false;
      const id = String(order.id || '').toLowerCase();
      const customerName = String(order.customerName || '').toLowerCase();
      const email = String(order.email || order.customerEmail || '').toLowerCase();
      const product = String(
        order.product ||
          order.items?.[0]?.productName ||
          (order.items && order.items.length > 0 ? order.items.map((i) => i.productName).join(' ') : '') ||
          ''
      ).toLowerCase();

      if (
        query &&
        !id.includes(query) &&
        !customerName.includes(query) &&
        !email.includes(query) &&
        !product.includes(query)
      ) {
        return false;
      }
      if (statusFilter !== 'ALL' && order.status !== statusFilter) return false;
      if (paymentFilter !== 'ALL' && order.paymentStatus !== paymentFilter) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';

      if (sortField === 'amount') {
        aVal = a.total ?? a.amount ?? 0;
        bVal = b.total ?? b.amount ?? 0;
      } else if (sortField === 'date') {
        aVal = new Date(a.date || a.createdAt || 0).getTime();
        bVal = new Date(b.date || b.createdAt || 0).getTime();
      } else if (sortField === 'customerName') {
        aVal = (a.customerName || '').toLowerCase();
        bVal = (b.customerName || '').toLowerCase();
      } else if (sortField === 'status') {
        aVal = (a.status || '').toLowerCase();
        bVal = (b.status || '').toLowerCase();
      }

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [orders, searchQuery, statusFilter, paymentFilter, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedOrders = filteredOrders.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleSelectAll = () => {
    if (selectedOrders.size === paginatedOrders.length && paginatedOrders.length > 0) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(paginatedOrders.map((o) => o.id)));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <TablePanel
      title="Orders"
      count={filteredOrders.length}
      toolbar={
        <>
          <SearchInput
            value={searchQuery}
            onValueChange={(value) => {
              setSearchQuery(value);
              setCurrentPage(1);
            }}
            placeholder="Search order ID, customer..."
          />
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-40"
            options={STATUS_OPTIONS}
          />
          <Select
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-40"
            options={PAYMENT_OPTIONS}
          />
        </>
      }
      section={
        selectedOrders.size > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-blue-50/40 px-3 py-2">
            <p className="text-sm font-medium text-gray-700">
              {selectedOrders.size} selected
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedOrders(new Set())}
            >
              Clear selection
            </Button>
          </div>
        ) : null
      }
      footer={
        filteredOrders.length > 0 ? (
          <Pagination
            page={safePage}
            pageCount={totalPages}
            total={filteredOrders.length}
            pageSize={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        ) : null
      }
    >
      {paginatedOrders.length === 0 ? (
          <EmptyState
            title="No orders found"
            description="Try adjusting your search or filters to find what you are looking for."
          />
        ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded accent-primary border-slate-300 transition-colors cursor-pointer"
                      checked={selectedOrders.size === paginatedOrders.length && paginatedOrders.length > 0}
                      onChange={toggleSelectAll}
                      aria-label="Select all orders"
                    />
                  </TableHead>
                  <TableHead className="w-28">Order</TableHead>
                  <SortableHeader
                    label="Customer"
                    field="customerName"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={toggleSort}
                  />
                  <TableHead>Product</TableHead>
                  <SortableHeader
                    label="Amount"
                    field="amount"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={toggleSort}
                    align="right"
                  />
                  <TableHead className="text-center w-28">Payment</TableHead>
                  <SortableHeader
                    label="Status"
                    field="status"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={toggleSort}
                  />
                  <SortableHeader
                    label="Date"
                    field="date"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={toggleSort}
                  />
                  <TableHead className="text-right w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => {
                  const isSelected = selectedOrders.has(order.id);
                  const itemsCount =
                    order.items && order.items.length > 0
                      ? order.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
                      : order.quantity || 1;
                  const displayProduct =
                    order.product ||
                    order.items?.[0]?.productName ||
                    (order.items && order.items.length > 0 ? order.items[0].productName : '—');
                  const extraItemsCount = order.items && order.items.length > 1 ? order.items.length - 1 : 0;
                  const displayEmail = order.email || order.customerEmail || '—';
                  const displayTotal = order.total ?? order.amount ?? 0;
                  const displayDate = order.date || order.createdAt || '';

                  return (
                    <TableRow
                      key={order.id}
                      data-state={isSelected ? 'selected' : undefined}
                      className={cn(isSelected && 'bg-blue-50/60')}
                    >
                      <TableCell>
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded accent-primary border-slate-300 transition-colors cursor-pointer"
                          checked={isSelected}
                          onChange={() => toggleSelect(order.id)}
                          aria-label={`Select order ${order.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-xs font-semibold text-slate-800">
                          {order.id}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="min-w-0 max-w-[14rem]">
                          <p className="truncate font-semibold text-slate-900 text-sm">
                            {order.customerName}
                          </p>
                          <p className="truncate text-xs text-slate-500">{displayEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="min-w-0 max-w-[14rem]">
                          <p className="truncate font-medium text-slate-900 text-sm" title={displayProduct}>
                            {displayProduct}
                            {extraItemsCount > 0 && (
                              <span className="ml-1.5 inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                                +{extraItemsCount}
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-500 font-medium">
                            Qty: <span className="text-slate-700">{itemsCount}</span>
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold tabular-nums text-slate-900">
                        {formatBDT(displayTotal)}
                      </TableCell>
                      <TableCell className="text-center">
                        <StatusBadge status={order.paymentStatus || 'PENDING'} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.status || 'PENDING'} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap tabular-nums text-slate-600 text-xs font-medium">
                        {formatShortDate(displayDate)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs font-semibold text-primary hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                            onClick={() => onViewOrder(order)}
                          >
                            View
                          </Button>
                          <DropdownMenu
                            align="end"
                            trigger={
                              <button
                                type="button"
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none"
                                aria-label={`Update status of ${order.id}`}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            }
                          >
                            <DropdownMenuLabel>Update status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {STATUS_ACTIONS.map((action) => (
                              <DropdownMenuItem
                                key={action.value}
                                onSelect={() => onStatusChange(order.id, action.value)}
                              >
                                {action.label}
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onSelect={() => onStatusChange(order.id, 'CANCELLED')}
                              className="text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold"
                            >
                              Cancel order
                            </DropdownMenuItem>
                            {onDeleteOrder && (
                              <DropdownMenuItem
                                onSelect={() => onDeleteOrder(order)}
                                className="text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold"
                              >
                                Delete order
                              </DropdownMenuItem>
                            )}
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
      </TablePanel>
    );
  }