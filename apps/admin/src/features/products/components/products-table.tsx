"use client";

import { useState, useMemo } from "react";
import { Search, Filter, ChevronUp, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatBDT } from "@/lib/load-dashboard-data";
import type { Product } from "../types";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
  onView: (product: Product) => void;
}

type SortField = "id" | "name" | "price" | "stock" | "category" | "status";
type SortDirection = "asc" | "desc";

function SortIcon({ field, sortField, sortDirection }: { field: SortField; sortField: SortField; sortDirection: SortDirection }) {
  if (sortField !== field) return null;
  return sortDirection === "asc" ? (
    <ChevronUp className="h-4 w-4" />
  ) : (
    <ChevronDown className="h-4 w-4" />
  );
}

export function ProductsTable({ products, onEdit, onDelete, onView }: ProductsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return ["ALL", ...cats];
  }, [products]);

  const statuses = ["ALL", "ACTIVE", "INACTIVE", "OUT_OF_STOCK"];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.barcode.includes(query) ||
          p.brand.toLowerCase().includes(query)
      );
    }

    if (categoryFilter !== "ALL") {
      result = result.filter((p) => p.category === categoryFilter);
    }

    if (statusFilter !== "ALL") {
      result = result.filter((p) => p.status === statusFilter);
    }

    result.sort((a, b) => {
      let aVal: string | number = a[sortField];
      let bVal: string | number = b[sortField];

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [products, searchQuery, categoryFilter, statusFilter, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-black focus:outline-none"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                className="rounded-lg border border-gray-200 py-2 pl-10 pr-8 text-sm focus:border-black focus:outline-none appearance-none bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "ALL" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="rounded-lg border border-gray-200 py-2 px-3 text-sm focus:border-black focus:outline-none appearance-none bg-white"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "ALL" ? "All Status" : status.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="pb-3 text-left font-medium">
                  <div className="flex items-center gap-1">Image</div>
                </th>
                <th
                  className="pb-3 text-left font-medium cursor-pointer"
                  onClick={() => toggleSort("name")}
                >
                  <div className="flex items-center gap-1">Name <SortIcon field="name" sortField={sortField} sortDirection={sortDirection} /></div>
                </th>
                <th
                  className="pb-3 text-left font-medium cursor-pointer"
                  onClick={() => toggleSort("category")}
                >
                  <div className="flex items-center gap-1">Category <SortIcon field="category" sortField={sortField} sortDirection={sortDirection} /></div>
                </th>
                <th
                  className="pb-3 text-right font-medium cursor-pointer"
                  onClick={() => toggleSort("price")}
                >
                  <div className="flex items-center justify-end gap-1">Price <SortIcon field="price" sortField={sortField} sortDirection={sortDirection} /></div>
                </th>
                <th
                  className="pb-3 text-right font-medium cursor-pointer"
                  onClick={() => toggleSort("stock")}
                >
                  <div className="flex items-center justify-end gap-1">Stock <SortIcon field="stock" sortField={sortField} sortDirection={sortDirection} /></div>
                </th>
                <th
                  className="pb-3 text-center font-medium cursor-pointer"
                  onClick={() => toggleSort("status")}
                >
                  <div className="flex items-center justify-center gap-1">Status <SortIcon field="status" sortField={sortField} sortDirection={sortDirection} /></div>
                </th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-3">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.brand}</p>
                    </div>
                  </td>
                  <td className="py-3">{product.category}</td>
                  <td className="py-3 text-right">{formatBDT(product.price)}</td>
                  <td className="py-3 text-right">
                    <span className={product.stock < 10 ? "text-red-600 font-medium" : ""}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <Badge
                      variant={
                        product.status === "ACTIVE"
                          ? "success"
                          : product.status === "INACTIVE"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {product.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onView(product)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onEdit(product)}
                        className="text-sm text-gray-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{" "}
            {filteredProducts.length} products
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-gray-200 px-3 py-1 text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-gray-200 px-3 py-1 text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
