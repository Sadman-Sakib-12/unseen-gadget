'use client';

import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, CreditCard, ShieldOff, UserRound } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { CustomersTable } from '@/features/customers/components/customers-table';
import { CustomerDetailsModal } from '@/features/customers/components/customer-details-modal';
import { CustomerEditModal } from '@/features/customers/components/customer-edit-modal';
import type { Customer } from '@/features/customers/types';
import { formatBDT } from '@/lib/format';
import { useAdminCustomers } from '@/hooks/use-admin-queries';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export function CustomersPage() {
  const queryClient = useQueryClient();
  const { data: customersRes } = useAdminCustomers();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);

  const customers = useMemo(() => {
    const raw = (customersRes as any)?.data ?? customersRes;
    return (Array.isArray(raw) ? raw : []) as Customer[];
  }, [customersRes]);

  const active = customers.filter((c) => c.status?.toLowerCase() === 'active').length;
  const blocked = customers.filter((c) => c.status?.toLowerCase() === 'blocked').length;
  const totalSpent = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

  const handleDeleteCustomer = async () => {
    if (!deletingCustomer) return;
    try {
      const res = await api.customers.delete(deletingCustomer.id);
      toast.success(res.message || 'Customer removed / status updated successfully');
      setDeletingCustomer(null);
      void queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete customer');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage your customer base and their order history."
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Total customers"
          value={customers.length}
          icon={UserRound}
          iconClassName="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Active"
          value={active}
          icon={CheckCircle2}
          iconClassName="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Blocked"
          value={blocked}
          icon={ShieldOff}
          iconClassName="bg-red-50 text-red-700"
        />
        <StatCard
          title="Lifetime value"
          value={formatBDT(totalSpent)}
          icon={CreditCard}
          iconClassName="bg-violet-50 text-violet-700"
        />
      </div>

      <CustomersTable
        data={customers}
        onView={(c) => setSelectedCustomer(c)}
        onEdit={(c) => setEditingCustomer(c)}
        onDelete={(c) => setDeletingCustomer(c)}
      />

      {/* Customer Details Modal */}
      <CustomerDetailsModal
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />

      {/* Customer Edit Modal */}
      <CustomerEditModal
        customer={editingCustomer}
        isOpen={editingCustomer !== null}
        onClose={() => setEditingCustomer(null)}
        onSuccess={() => void queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] })}
      />

      {/* Customer Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deletingCustomer !== null}
        onOpenChange={(open) => !open && setDeletingCustomer(null)}
        title="Delete Customer?"
        description={
          deletingCustomer
            ? `Are you sure you want to delete customer "${deletingCustomer.name}"? If this customer has past order records, their status will be set to Blocked to safeguard financial data.`
            : undefined
        }
        confirmLabel="Delete / Block"
        destructive
        onConfirm={() => void handleDeleteCustomer()}
      />
    </div>
  );
}