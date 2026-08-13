'use client';

import { useState } from 'react';
import { CheckCircle2, CreditCard, Plus, ShieldOff, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { CustomersTable } from '@/features/customers/components/customers-table';
import { CustomerDetailsModal } from '@/features/customers/components/customer-details-modal';
import initialCustomers from '@/features/customers/data/customers.json';
import type { Customer } from '@/features/customers/types';
import { formatBDT } from '@/lib/load-dashboard-data';

export function CustomersPage() {
  const [customers] = useState<Customer[]>(initialCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const active = customers.filter((c) => c.status === 'active').length;
  const blocked = customers.filter((c) => c.status === 'blocked').length;
  const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage your customer base and their order history."
        actions={
          <Button onClick={() => {}}>
            <Plus className="h-4 w-4" />
            Add Customer
          </Button>
        }
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

      <CustomersTable data={customers} onView={(c) => setSelectedCustomer(c)} />
      <CustomerDetailsModal
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </div>
  );
}