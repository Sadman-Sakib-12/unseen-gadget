'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { CheckCircle2, Clock, Download, Plus, RefreshCw, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/ui/stat-card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/components/ui/utils';
import { OrdersTable } from './orders-table';
import { OrderDetailsModal } from './order-details-modal';
import allOrders from '@/features/orders/data/orders.json';
import type { Order } from '../types';

function exportOrdersCsv(orders: Order[]) {
  const headers = ['ID', 'Customer', 'Email', 'Product', 'Amount', 'Status', 'Payment', 'Date'];
  const esc = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;
  const rows = orders.map((order) => [
    order.id,
    order.customerName,
    order.email,
    order.product,
    order.total,
    order.status,
    order.paymentStatus,
    order.date,
  ]);
  const csv = [headers.map(esc).join(','), ...rows.map((row) => row.map(esc).join(','))].join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

interface CreateOrderState {
  customerName: string;
  email: string;
  phone: string;
  city: string;
  shippingAddress: string;
  product: string;
  quantity: number;
  price: number;
}

const EMPTY_CREATE_STATE: CreateOrderState = {
  customerName: '',
  email: '',
  phone: '',
  city: '',
  shippingAddress: '',
  product: '',
  quantity: 1,
  price: 0,
};

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(allOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createState, setCreateState] = useState<CreateOrderState>(EMPTY_CREATE_STATE);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleStatusChange = (orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)));
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const total = createState.price * createState.quantity;
    const id = `ORD-${Date.now().toString(36).toUpperCase().slice(-5)}`;
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const newOrder: Order = {
      id,
      customerName: createState.customerName,
      email: createState.email,
      phone: createState.phone,
      city: createState.city || 'Dhaka',
      shippingAddress: createState.shippingAddress || '—',
      product: createState.product,
      amount: total,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      date: today,
      items: [
        {
          id: `I-${Date.now()}`,
          productId: 0,
          productName: createState.product,
          quantity: createState.quantity,
          price: createState.price,
          total,
        },
      ],
      subtotal: total,
      discount: 0,
      shippingCost: 0,
      total,
    };
    setOrders((prev) => [newOrder, ...prev]);
    setIsCreateOpen(false);
    setCreateState(EMPTY_CREATE_STATE);
    toast.success(`Order ${id} created`);
  };

  const counts = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'PENDING').length,
    processing: orders.filter((o) => o.status === 'PROCESSING' || o.status === 'CONFIRMED').length,
    delivered: orders.filter((o) => o.status === 'DELIVERED').length,
  };

  return (
    <div className={cn('space-y-6', selectedOrder && 'lg:pr-[400px] lg:transition-[padding]')}>
      <PageHeader
        title="Orders"
        description="Manage and track all customer orders."
        actions={
          <>
            <Button variant="outline" onClick={() => exportOrdersCsv(orders)}>
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Create Order
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={counts.total}
          icon={ShoppingBag}
          iconClassName="bg-blue-50 text-blue-700"
          change={12.5}
          changeLabel="vs last month"
        />
        <StatCard
          title="Pending"
          value={counts.pending}
          icon={Clock}
          iconClassName="bg-amber-50 text-amber-700"
        />
        <StatCard
          title="Processing"
          value={counts.processing}
          icon={RefreshCw}
          iconClassName="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Delivered"
          value={counts.delivered}
          icon={CheckCircle2}
          iconClassName="bg-emerald-50 text-emerald-700"
        />
      </div>

      <OrdersTable
        orders={orders}
        onViewOrder={handleViewOrder}
        onStatusChange={handleStatusChange}
      />

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onStatusChange={handleStatusChange}
      />

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogHeader close>
          <DialogTitle>Create Order</DialogTitle>
          <DialogDescription>
            Add a new order to the queue. It will be marked as pending.
          </DialogDescription>
        </DialogHeader>
        <DialogContent>
          <form id="create-order-form" onSubmit={handleCreateOrder} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="co-name" className="text-sm font-medium text-gray-700">
                  Customer Name
                </label>
                <Input
                  id="co-name"
                  value={createState.customerName}
                  onChange={(e) => setCreateState({ ...createState, customerName: e.target.value })}
                  placeholder="Jane Cooper"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="co-email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="co-email"
                  type="email"
                  value={createState.email}
                  onChange={(e) => setCreateState({ ...createState, email: e.target.value })}
                  placeholder="jane@example.com"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="co-phone" className="text-sm font-medium text-gray-700">
                  Phone
                </label>
                <Input
                  id="co-phone"
                  value={createState.phone}
                  onChange={(e) => setCreateState({ ...createState, phone: e.target.value })}
                  placeholder="+880 1XXX-XXXXXX"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="co-city" className="text-sm font-medium text-gray-700">
                  City
                </label>
                <Input
                  id="co-city"
                  value={createState.city}
                  onChange={(e) => setCreateState({ ...createState, city: e.target.value })}
                  placeholder="Dhaka"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="co-address" className="text-sm font-medium text-gray-700">
                  Shipping Address
                </label>
                <Input
                  id="co-address"
                  value={createState.shippingAddress}
                  onChange={(e) => setCreateState({ ...createState, shippingAddress: e.target.value })}
                  placeholder="House, Road, Area"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="co-product" className="text-sm font-medium text-gray-700">
                  Product
                </label>
                <Input
                  id="co-product"
                  value={createState.product}
                  onChange={(e) => setCreateState({ ...createState, product: e.target.value })}
                  placeholder="Headphones X"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="co-qty" className="text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <Input
                  id="co-qty"
                  type="number"
                  min={1}
                  value={createState.quantity}
                  onChange={(e) =>
                    setCreateState({ ...createState, quantity: Math.max(1, Number(e.target.value)) })
                  }
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="co-price" className="text-sm font-medium text-gray-700">
                  Unit Price (BDT)
                </label>
                <Input
                  id="co-price"
                  type="number"
                  min={0}
                  value={createState.price}
                  onChange={(e) =>
                    setCreateState({ ...createState, price: Math.max(0, Number(e.target.value)) })
                  }
                  placeholder="1250"
                  required
                />
              </div>
            </div>
          </form>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => setIsCreateOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" form="create-order-form">
            Create Order
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}