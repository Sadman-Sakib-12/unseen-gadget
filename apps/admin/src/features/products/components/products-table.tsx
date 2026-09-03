'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
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
import { formatBDT } from '@/lib/load-dashboard-data';
import { cn } from '@/components/ui/utils';
import type { Product } from '../types';

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string | number) => void;
  onView: (product: Product) => void;
}

type SortField = keyof Pick<Product, 'id' | 'name' | 'price' | 'stock' | 'category' | 'status'>;
type SortDirection = 'asc' | 'desc';

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All status' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'OUT_OF_STOCK', label: 'Out of stock' },
];

function SortIndicator({
  active,
  direction,
}: {
  active: boolean;
  direction: SortDirection;
}) {
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
  align?: 'left' | 'right' | 'center';
}) {
  return (
    <TableHead
      onClick={() => onSort(field)}
      className={cn(
        'cursor-pointer select-none transition-colors hover:text-gray-900',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center'
      )}
    >
      <span
        className={cn(
          'inline-flex items-center gap-1',
          align === 'right' && 'justify-end',
          align === 'center' && 'justify-center'
        )}
      >
        {label}
        <SortIndicator
          active={sortField === field}
          direction={sortDirection}
        />
      </span>
    </TableHead>
  );
}

export function ProductsTable({
  products,
  onEdit,
  onDelete,
  onView,
}: ProductsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const categoryOptions = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return [{ value: 'ALL', label: 'All categories' }, ...cats.map((c) => ({ value: c, label: c }))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let result = products.filter((p) => {
      if (
        query &&
        !p.name.toLowerCase().includes(query) &&
        !p.sku.toLowerCase().includes(query) &&
        !p.barcode.includes(query) &&
        !p.brand.toLowerCase().includes(query)
      ) {
        return false;
      }
      if (categoryFilter !== 'ALL' && p.category !== categoryFilter) return false;
      if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      const aVal: string | number = typeof a[sortField] === 'string' ? (a[sortField] as string).toLowerCase() : a[sortField];
      const bVal: string | number = typeof b[sortField] === 'string' ? (b[sortField] as string).toLowerCase() : b[sortField];
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [products, searchQuery, categoryFilter, statusFilter, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice(
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

  return (
    <TablePanel
      title="Products"
      count={filteredProducts.length}
      toolbar={
        <>
          <SearchInput
            value={searchQuery}
            onValueChange={(value) => {
              setSearchQuery(value);
              setCurrentPage(1);
            }}
            placeholder="Search name, SKU, brand..."
          />
          <Select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-44"
            options={categoryOptions}
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
        </>
      }
      footer={
        filteredProducts.length > 0 ? (
          <Pagination
            page={safePage}
            pageCount={totalPages}
            total={filteredProducts.length}
            pageSize={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        ) : null
      }
    >
      {paginatedProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try adjusting your search or filters to find what you are looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <SortableHeader
                label="Category"
                field="category"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={toggleSort}
              />
              <SortableHeader
                label="Price"
                field="price"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={toggleSort}
                align="right"
              />
              <SortableHeader
                label="Stock"
                field="stock"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={toggleSort}
                align="right"
              />
              <SortableHeader
                label="Status"
                field="status"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={toggleSort}
                align="center"
              />
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {product.brand} · {product.sku}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{product.category}</Badge>
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {formatBDT(product.price)}
                  {product.discount > 0 ? (
                    <span className="ml-1.5 text-xs font-semibold text-red-600">
                      −{product.discount}%
                    </span>
                  ) : null}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  <span
                    className={cn(
                      product.stock === 0 && 'font-semibold text-red-600',
                      product.stock > 0 && product.stock < 10 && 'font-semibold text-amber-600',
                      product.stock >= 10 && 'text-gray-700'
                    )}
                  >
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <StatusBadge status={product.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(product)}
                      className="text-gray-600"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View {product.name}</span>
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(product)}
                      aria-label={`Edit ${product.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(product.id)}
                      aria-label={`Delete ${product.name}`}
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