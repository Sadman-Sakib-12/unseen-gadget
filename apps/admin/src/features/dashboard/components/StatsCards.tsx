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
import { formatBDT } from '@/lib/load-dashboard-data';
import type { DashboardStats } from '@/features/dashboard/types';

interface StatConfig {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  iconClassName: string;
}

interface StatsCardsProps {
  data: DashboardStats;
}

export function StatsCards({ data }: StatsCardsProps) {
  const averageOrderValue = data.totalOrders > 0 ? Math.round(data.totalSales / data.totalOrders) : 0;

  const stats: StatConfig[] = [
    {
      title: 'Total Sales',
      value: formatBDT(data.totalSales),
      change: data.revenueChange,
      changeLabel: 'vs last month',
      icon: DollarSign,
      iconClassName: 'bg-primary/10 text-primary',
    },
    {
      title: "Today's Sales",
      value: formatBDT(data.todaySales),
      icon: ShoppingCart,
      iconClassName: 'bg-primary/10 text-primary',
    },
    {
      title: 'Gross Profit',
      value: formatBDT(data.grossProfit),
      change: data.profitChange,
      changeLabel: 'vs last month',
      icon: TrendingUp,
      iconClassName: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Total Orders',
      value: data.totalOrders.toString(),
      change: data.ordersChange,
      changeLabel: 'vs last month',
      icon: BarChart2,
      iconClassName: 'bg-blue-50 text-blue-700',
    },
    {
      title: 'Pending Orders',
      value: data.pendingOrders.toString(),
      icon: Clock,
      iconClassName: 'bg-amber-50 text-amber-700',
    },
    {
      title: 'Inventory Value',
      value: formatBDT(data.inventoryValue),
      icon: Warehouse,
      iconClassName: 'bg-primary/10 text-primary',
    },
    {
      title: 'Total Products',
      value: data.totalProducts.toString(),
      icon: Package,
      iconClassName: 'bg-blue-50 text-blue-700',
    },
    {
      title: 'Low Stock',
      value: data.lowStock.toString(),
      icon: AlertTriangle,
      iconClassName: 'bg-amber-50 text-amber-700',
    },
    {
      title: 'Out of Stock',
      value: data.outOfStock.toString(),
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
      value: data.totalCustomers.toString(),
      icon: Users,
      iconClassName: 'bg-gray-100 text-gray-700',
    },
    {
      title: 'Total Expenses',
      value: formatBDT(data.totalExpenses),
      change: data.expensesChange,
      changeLabel: 'vs last month',
      icon: Receipt,
      iconClassName: 'bg-red-50 text-red-700',
    },
  ];

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
