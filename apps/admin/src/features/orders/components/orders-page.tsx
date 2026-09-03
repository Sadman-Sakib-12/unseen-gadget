'use client';

import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { CheckCircle2, Clock, Download, Plus, RefreshCw, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { cn } from '@/components/ui/utils';
import { OrdersTable } from './orders-table';
import { OrderDetailsModal } from './order-details-modal';
import type { Order } from '../types';
import {
  useAdminOrders,
  useUpdateAdminOrderStatus,
  useCreateAdminOrder,
  useDeleteAdminOrder,
} from '@/hooks/use-admin-queries';

function exportOrdersCsv(orders: Order[]) {
  const headers = ['ID', 'Customer', 'Email', 'Phone', 'Product', 'Amount', 'Status', 'Payment', 'Date'];
  const esc = (value: string | number | undefined | null) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const rows = orders.map((order) => [
    order.id,
    order.customerName,
    order.email || order.customerEmail || '',
    order.phone || order.customerPhone || '',
    order.product || order.items?.[0]?.productName || '',
    order.total ?? order.amount ?? 0,
    order.status,
    order.paymentStatus,
    order.date || order.createdAt || '',
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

const ORDER_STATUS_META: Record<string, { label: string; value: Order['status']; description: string }> = {
  pending: { label: 'Pending Orders', value: 'PENDING', description: 'View and manage pending customer orders.' },
  confirmed: { label: 'Confirmed Orders', value: 'CONFIRMED', description: 'Orders confirmed by the team and waiting to be processed.' },
  processing: { label: 'Processing Orders', value: 'PROCESSING', description: 'Orders currently being picked, packed and prepared.' },
  shipped: { label: 'Shipped Orders', value: 'SHIPPED', description: 'Orders handed over to the delivery partner.' },
  delivered: { label: 'Delivered Orders', value: 'DELIVERED', description: 'Orders successfully delivered to customers.' },
  cancelled: { label: 'Cancelled Orders', value: 'CANCELLED', description: 'Orders that were cancelled before delivery.' },
  returned: { label: 'Returned Orders', value: 'RETURNED', description: 'Orders returned by customers.' },
};

export function OrdersPage({ status, orderId }: { status?: string; orderId?: string }) {
  const { data: ordersRes } = useAdminOrders();
  const updateOrderStatusMutation = useUpdateAdminOrderStatus();
  const createOrderMutation = useCreateAdminOrder();
  const deleteOrderMutation = useDeleteAdminOrder();
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);

  const orders = useMemo(() => {
    const raw = (ordersRes as any)?.data ?? ordersRes;
    return (Array.isArray(raw) ? raw : []) as Order[];
  }, [ordersRes]);

  const statusMeta = status ? ORDER_STATUS_META[status] : undefined;
  const visibleOrders = useMemo(() => {
    if (orderId) {
      const matched = orders.filter((o) => o.id === orderId || (o as any).orderNumber === orderId);
      if (matched.length > 0) return matched;
    }
    return statusMeta ? orders.filter((o) => o.status === statusMeta.value) : orders;
  }, [orders, statusMeta, orderId]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId && orders.length > 0) {
      const found = orders.find((o) => o.id === orderId || (o as any).orderNumber === orderId);
      if (found) setSelectedOrder(found);
    }
  }, [orderId, orders]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createState, setCreateState] = useState<CreateOrderState>(EMPTY_CREATE_STATE);

  const handleDeleteOrder = (order: Order) => {
    setDeleteTarget(order);
  };

  const confirmDeleteOrder = async () => {
    if (deleteTarget) {
      try {
        await deleteOrderMutation.mutateAsync(String(deleteTarget.id));
        toast.success(`Order #${(deleteTarget as any).orderNumber || deleteTarget.id} deleted successfully`);
        if (selectedOrder && selectedOrder.id === deleteTarget.id) {
          setSelectedOrder(null);
        }
        setDeleteTarget(null);
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete order');
      }
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderStatusMutation.mutateAsync({ id: orderId, status });
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status } : null));
      }
      toast.success(`Order status updated to ${status}`);
    } catch {
      toast.error('Failed to update order status');
    }
  };

  const handlePaymentStatusChange = async (orderId: string, paymentStatus: string) => {
    try {
      await updateOrderStatusMutation.mutateAsync({ id: orderId, paymentStatus });
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, paymentStatus } : null));
      }
      toast.success(`Payment marked as ${paymentStatus}`);
    } catch {
      toast.error('Failed to update payment status');
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrderMutation.mutateAsync({
        customerName: createState.customerName,
        email: createState.email,
        phone: createState.phone,
        city: createState.city,
        shippingAddress: createState.shippingAddress,
        product: createState.product,
        quantity: createState.quantity,
        price: createState.price,
        status: 'PENDING',
        paymentStatus: 'PENDING',
      });
      toast.success('Order created successfully');
      setIsCreateOpen(false);
      setCreateState(EMPTY_CREATE_STATE);
    } catch {
      toast.error('Failed to create order');
    }
  };

  const counts = {
    total: visibleOrders.length,
    pending: visibleOrders.filter((o) => o.status === 'PENDING').length,
    processing: visibleOrders.filter((o) => o.status === 'PROCESSING' || o.status === 'CONFIRMED').length,
    delivered: visibleOrders.filter((o) => o.status === 'DELIVERED').length,
  };

  return (
    <div className={cn('space-y-6', selectedOrder && 'lg:pr-[400px] lg:transition-[padding]')}>
      <PageHeader
        title={statusMeta?.label ?? 'Orders'}
        description={statusMeta?.description ?? 'Manage and track all customer orders.'}
        actions={
          <>
            <Button variant="outline" onClick={() => exportOrdersCsv(visibleOrders)}>
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
          iconClassName="bg-blue-50 text-blue-500"
        />
        <StatCard
          title="Delivered"
          value={counts.delivered}
          icon={CheckCircle2}
          iconClassName="bg-emerald-50 text-emerald-700"
        />
      </div>

      <OrdersTable
        orders={visibleOrders}
        onViewOrder={handleViewOrder}
        onStatusChange={handleStatusChange}
        onDeleteOrder={handleDeleteOrder}
      />

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onStatusChange={handleStatusChange}
        onPaymentStatusChange={handlePaymentStatusChange}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={confirmDeleteOrder}
        title="Delete Order"
        description={`Are you sure you want to permanently delete order #${(deleteTarget as any)?.orderNumber || deleteTarget?.id}? This action cannot be undone.`}
        confirmLabel="Delete Order"
        destructive
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