'use client';

import { PageHeader } from '@/components/layout/page-header';
import { StatsCards } from './StatsCards';
import { BusinessOverview } from './BusinessOverview';
import { SalesByChannel } from './SalesByChannel';
import { SalesTrend } from './SalesTrend';
import { SalesOverview } from './SalesOverview';
import { RecentOrders } from './RecentOrders';
import { LowStockProducts } from './LowStockProducts';
import { TopSellingProducts } from './TopSellingProducts';
import { OutstandingSupplierDue } from './OutstandingSupplierDue';
import { Notifications } from './Notifications';
import { QuickActions } from './QuickActions';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here is an overview of your store performance."
      />

      <StatsCards />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <BusinessOverview className="lg:col-span-4" />
        <SalesByChannel className="lg:col-span-3" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <SalesTrend className="lg:col-span-4" />
        <SalesOverview className="lg:col-span-3" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <RecentOrders className="lg:col-span-4" />
        <LowStockProducts className="lg:col-span-3" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <TopSellingProducts className="lg:col-span-4" />
        <OutstandingSupplierDue className="lg:col-span-3" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Notifications />
        <QuickActions />
      </div>
    </div>
  );
}