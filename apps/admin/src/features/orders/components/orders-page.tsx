"use client";

import { useState } from "react";
import { Download, Plus, ShoppingBag, Clock, RefreshCw, CheckCircle2, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { OrdersTable } from "./orders-table";
import { OrderDetailsModal } from "./order-details-modal";
import allOrders from "@/features/orders/data/orders.json";
import type { Order } from "../types";

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(allOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleStatusChange = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const handleDetailsClose = () => {
    setIsDetailsOpen(false);
    setTimeout(() => setSelectedOrder(null), 300); // delay to allow animation
  };

  return (
    <div className={`space-y-8 pb-8 transition-all duration-300 ease-in-out ${isDetailsOpen ? 'lg:pr-[380px]' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track all customer orders</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium shadow-sm transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button 
            onClick={() => alert("Create order functionality will be implemented soon.")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm shadow-blue-200 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Order
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Orders Card */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-500 mb-4">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <svg className="w-16 h-8 text-blue-200" viewBox="0 0 100 30" fill="none">
                <path d="M0 25C20 25 30 15 50 15C70 15 80 5 100 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</h3>
              <div className="flex items-center gap-1 mt-2 text-xs font-medium text-green-600 bg-green-50 w-fit px-2 py-0.5 rounded-full">
                <TrendingUp className="h-3 w-3" />
                12.5% from last month
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Card */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-50 text-orange-500 mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <svg className="w-16 h-8 text-orange-200" viewBox="0 0 100 30" fill="none">
                <path d="M0 15C20 15 30 5 50 5C70 5 80 25 100 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{orders.filter(o => o.status === "PENDING").length}</h3>
              <div className="flex items-center gap-1 mt-2 text-xs font-medium text-orange-600 bg-orange-50 w-fit px-2 py-0.5 rounded-full">
                Needs action
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processing Card */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-50 text-purple-500 mb-4">
                <RefreshCw className="h-6 w-6" />
              </div>
              <svg className="w-16 h-8 text-purple-200" viewBox="0 0 100 30" fill="none">
                <path d="M0 20C20 20 30 10 50 10C70 10 80 15 100 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Processing</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{orders.filter(o => o.status === "PROCESSING").length}</h3>
              <div className="flex items-center gap-1 mt-2 text-xs font-medium text-purple-600 bg-purple-50 w-fit px-2 py-0.5 rounded-full">
                In progress
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivered Card */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-green-500 mb-4">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <svg className="w-16 h-8 text-green-200" viewBox="0 0 100 30" fill="none">
                <path d="M0 10C20 10 30 20 50 20C70 20 80 5 100 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Delivered</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{orders.filter(o => o.status === "DELIVERED").length}</h3>
              <div className="flex items-center gap-1 mt-2 text-xs font-medium text-green-600 bg-green-50 w-fit px-2 py-0.5 rounded-full">
                Completed
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <OrdersTable
        orders={orders}
        onViewOrder={handleViewOrder}
        onStatusChange={handleStatusChange}
      />

      <OrderDetailsModal
        isOpen={isDetailsOpen}
        onClose={handleDetailsClose}
        order={selectedOrder}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
