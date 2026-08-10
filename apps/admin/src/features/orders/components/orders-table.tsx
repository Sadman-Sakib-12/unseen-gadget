"use client";

import { useState, useMemo } from "react";
import { Search, Filter, ChevronUp, ChevronDown, Calendar, RefreshCcw, Printer, Download, Trash2, List, Grid, MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "./status-badge";
import type { Order } from "../types";

interface OrdersTableProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onStatusChange: (orderId: string, status: Order["status"]) => void;
}

type SortField = "id" | "customerName" | "amount" | "date" | "status";
type SortDirection = "asc" | "desc";

export function OrdersTable({ orders, onViewOrder, onStatusChange }: OrdersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());

  const statuses = ["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.email.toLowerCase().includes(query) ||
          order.product.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "ALL") {
      result = result.filter((order) => order.status === statusFilter);
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
  }, [orders, searchQuery, statusFilter, sortField, sortDirection]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleSelectAll = () => {
    if (selectedOrders.size === filteredOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders.map(o => o.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedOrders(newSelected);
  };

  return (
    <Card className="border-0 shadow-sm shadow-blue-900/5 rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        
        {/* Filters Section */}
        <div className="flex flex-col lg:flex-row gap-5 p-5 lg:items-center bg-white border-b border-gray-100">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID, customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
          
          <div className="flex flex-wrap lg:flex-nowrap gap-3 items-center">
            <div className="relative min-w-[140px]">
              <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-medium text-gray-500">Status</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none appearance-none bg-white"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "ALL" ? "All Status" : status}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative min-w-[140px]">
              <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-medium text-gray-500">Payment</span>
              <select className="w-full rounded-lg border border-gray-200 py-2.5 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none appearance-none bg-white">
                <option value="ALL">All Payment</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative min-w-[160px]">
              <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-medium text-gray-500">Date Range</span>
              <div className="flex items-center rounded-lg border border-gray-200 py-2.5 pl-3 pr-8 text-sm bg-white cursor-pointer hover:border-gray-300 transition-colors">
                <span>This Month</span>
              </div>
              <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <button className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              <RefreshCcw className="h-4 w-4" />
              Clear
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm transition-colors">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Toolbar & Bulk Actions */}
        <div className="flex flex-wrap items-center justify-between gap-5 p-5 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-bold text-gray-900">Orders ({filteredOrders.length})</h2>
            
            {selectedOrders.size > 0 && (
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm font-medium text-gray-600">{selectedOrders.size} selected</span>
                <div className="h-4 w-px bg-gray-300 mx-1"></div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                  <RefreshCcw className="h-4 w-4" /> Update Status
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                  <Printer className="h-4 w-4" /> Print Invoice
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                  <Download className="h-4 w-4" /> Export Selected
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors">
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <RefreshCcw className="h-4 w-4 rotate-90" />
              <span>Sort by:</span>
              <select className="border-none bg-transparent outline-none cursor-pointer font-bold text-gray-900">
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>Highest Amount</option>
              </select>
            </div>
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
              <button className="p-1.5 bg-white shadow-sm rounded-md text-blue-600">
                <List className="h-4 w-4" />
              </button>
              <button className="p-1.5 text-gray-500 hover:text-gray-900">
                <Grid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
              <tr>
                <th className="py-4 pl-5 pr-2 font-medium w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    checked={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="py-4 px-4 font-medium">Order ID</th>
                <th className="py-4 px-4 font-medium">Customer</th>
                <th className="py-4 px-4 font-medium">Product</th>
                <th className="py-4 px-4 font-medium">Amount</th>
                <th className="py-4 px-4 font-medium">Payment</th>
                <th className="py-4 px-4 font-medium">Status</th>
                <th className="py-4 px-4 font-medium">Date</th>
                <th className="py-4 px-5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const isSelected = selectedOrders.has(order.id);
                return (
                  <tr key={order.id} className={`border-b border-gray-50 transition-colors hover:bg-gray-50/80 ${isSelected ? 'bg-blue-50/30' : 'bg-white'}`}>
                    <td className="py-4 pl-5 pr-2">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                        checked={isSelected}
                        onChange={() => toggleSelect(order.id)}
                      />
                    </td>
                    <td className="py-4 px-4 font-bold text-blue-600">{order.id}</td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-gray-900">{order.customerName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{order.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.product}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Qty: 1</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-gray-900">
                      {order.amount.toLocaleString()} BDT
                    </td>
                    <td className="py-4 px-4 text-gray-400 font-medium">
                      —
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-gray-900 font-medium">{order.date}</p>
                        <p className="text-xs text-gray-500 mt-0.5">10:30 AM</p>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewOrder(order)}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                        >
                          View
                        </button>
                        <DropdownMenu
                          align="end"
                          trigger={
                            <button className="p-1.5 text-gray-400 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          }
                        >
                          <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onSelect={() => onStatusChange(order.id, 'PROCESSING')}>Mark as Processing</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => onStatusChange(order.id, 'SHIPPED')}>Mark as Shipped</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => onStatusChange(order.id, 'DELIVERED')}>Mark as Delivered</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onSelect={() => onStatusChange(order.id, 'CANCELLED')} className="text-red-600 focus:bg-red-50">Cancel Order</DropdownMenuItem>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 bg-white">
          <div className="text-sm text-gray-500">
            Showing 1 to {Math.min(10, filteredOrders.length)} of {filteredOrders.length} orders
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                &lt;
              </button>
              <button className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-600 text-white font-medium">
                1
              </button>
              <button className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">
                2
              </button>
              <button className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50">
                &gt;
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show</span>
              <select className="border border-gray-200 rounded-md py-1 px-2 font-medium outline-none">
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
              <span>per page</span>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
