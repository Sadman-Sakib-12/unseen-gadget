'use client';

import { useAdminDashboard } from '@/hooks/use-admin-queries';
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
  const { data: dashboardRes, isLoading: loading } = useAdminDashboard();
  const d = (dashboardRes?.data ?? {}) as any;

  const stats = d.stats ?? null;
  const salesOverview = d.salesOverview ?? [];
  const salesTrend = d.salesTrend ?? [];
  const salesByChannel = d.salesByChannel ?? [];
  const recentOrders = d.recentOrders ?? [];
  const lowStockProducts = d.lowStockProducts ?? [];
  const topSellingProducts = d.topSellingProducts ?? [];
  const supplierDues = d.supplierDues ?? [];
  const notifications = d.notifications ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here is an overview of your store performance."
      />

      {loading ? (
        <div className="flex items-center justify-center py-12 text-sm text-gray-500">Loading dashboard...</div>
      ) : (
        <>
          {stats && <StatsCards data={stats} />}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <BusinessOverview className="lg:col-span-4" data={salesOverview} />
            <SalesByChannel className="lg:col-span-3" data={salesByChannel} />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <SalesTrend className="lg:col-span-4" data={salesTrend} />
            <SalesOverview className="lg:col-span-3" data={salesOverview} />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <RecentOrders className="lg:col-span-4" data={recentOrders} />
            <LowStockProducts className="lg:col-span-3" data={lowStockProducts} />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <TopSellingProducts className="lg:col-span-4" data={topSellingProducts} />
            <OutstandingSupplierDue className="lg:col-span-3" data={supplierDues} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Notifications data={notifications} />
            <QuickActions />
          </div>
        </>
      )}
    </div>
  );
}
