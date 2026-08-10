"use client";

import { StatsCards } from "./StatsCards";
import { BusinessOverview } from "./BusinessOverview";
import { SalesByChannel } from "./SalesByChannel";
import { SalesTrend } from "./SalesTrend";
import { RecentOrders } from "./RecentOrders";
import { LowStockProducts } from "./LowStockProducts";
import { TopSellingProducts } from "./TopSellingProducts";
import { OutstandingSupplierDue } from "./OutstandingSupplierDue";
import { Notifications } from "./Notifications";
import { QuickActions } from "./QuickActions";

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here is an overview of your store.
        </p>
      </div>

      <StatsCards />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <BusinessOverview className="lg:col-span-4" />
        <SalesByChannel className="lg:col-span-3" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <SalesTrend className="lg:col-span-4" />
        <SalesByChannel className="lg:col-span-3" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <RecentOrders className="lg:col-span-4" />
        <LowStockProducts className="lg:col-span-3" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <TopSellingProducts className="lg:col-span-4" />
        <OutstandingSupplierDue className="lg:col-span-3" />
      </div>

      <Notifications />

      <QuickActions />
    </div>
  );
}
