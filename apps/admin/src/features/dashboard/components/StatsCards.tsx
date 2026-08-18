'use client';

import {
  AlertTriangle,
  BarChart2,
  Clock,
  CreditCard,
  DollarSign,
  Package,
  Receipt,
  ShoppingCart,
  TrendingUp,
  Users,
  Warehouse,
  XCircle,
} from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { dashboardStats } from '@/features/dashboard/data';
import { formatBDT } from '@/lib/load-dashboard-data';

interface StatConfig {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  iconClassName: string;
}

const averageOrderValue = Math.round(dashboardStats.totalSales / dashboardStats.totalOrders);

const stats: StatConfig[] = [
  {
    title: 'Total Sales',
    value: formatBDT(dashboardStats.totalSales),
    change: dashboardStats.revenueChange,
    changeLabel: 'vs last month',
    icon: DollarSign,
    iconClassName: 'bg-primary/10 text-primary',
  },
  {
    title: "Today's Sales",
    value: formatBDT(dashboardStats.todaySales),
    icon: ShoppingCart,
    iconClassName: 'bg-primary/10 text-primary',
  },
  {
    title: 'Gross Profit',
    value: formatBDT(dashboardStats.grossProfit),
    change: dashboardStats.profitChange,
    changeLabel: 'vs last month',
    icon: TrendingUp,
    iconClassName: 'bg-emerald-50 text-emerald-700',
  },
  {
    title: 'Total Orders',
    value: dashboardStats.totalOrders.toString(),
    change: dashboardStats.ordersChange,
    changeLabel: 'vs last month',
    icon: BarChart2,
    iconClassName: 'bg-blue-50 text-blue-700',
  },
  {
    title: 'Pending Orders',
    value: dashboardStats.pendingOrders.toString(),
    icon: Clock,
    iconClassName: 'bg-amber-50 text-amber-700',
  },
  {
    title: 'Inventory Value',
    value: formatBDT(dashboardStats.inventoryValue),
    icon: Warehouse,
    iconClassName: 'bg-primary/10 text-primary',
  },
  {
    title: 'Total Products',
    value: dashboardStats.totalProducts.toString(),
    icon: Package,
    iconClassName: 'bg-blue-50 text-blue-700',
  },
  {
    title: 'Low Stock',
    value: dashboardStats.lowStock.toString(),
    icon: AlertTriangle,
    iconClassName: 'bg-amber-50 text-amber-700',
  },
  {
    title: 'Out of Stock',
    value: dashboardStats.outOfStock.toString(),
    icon: XCircle,
    iconClassName: 'bg-red-50 text-red-700',
  },
  {
    title: 'Avg Order Value',
    value: formatBDT(averageOrderValue),
    icon: CreditCard,
    iconClassName: 'bg-primary/10 text-primary',
  },
  {
    title: 'Total Customers',
    value: dashboardStats.totalCustomers.toString(),
    icon: Users,
    iconClassName: 'bg-gray-100 text-gray-700',
  },
  {
    title: 'Total Expenses',
    value: formatBDT(dashboardStats.totalExpenses),
    change: dashboardStats.expensesChange,
    changeLabel: 'vs last month',
    icon: Receipt,
    iconClassName: 'bg-red-50 text-red-700',
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          iconClassName={stat.iconClassName}
          change={stat.change}
          changeLabel={stat.changeLabel}
          className="min-w-0"
        />
      ))}
    </div>
  );
}