"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardStats } from "@/features/dashboard/data";
import { formatBDT } from "@/lib/load-dashboard-data";

const stats = [
  { title: "Total Sales", value: formatBDT(dashboardStats.totalSales), change: dashboardStats.revenueChange, showChange: true },
  { title: "Todays Sales", value: formatBDT(dashboardStats.todaySales), change: dashboardStats.revenueChange, showChange: true },
  { title: "Gross Profit", value: formatBDT(dashboardStats.grossProfit), change: dashboardStats.profitChange, showChange: true },
  { title: "Total Orders", value: dashboardStats.totalOrders.toString(), change: dashboardStats.ordersChange, showChange: true },
  { title: "Pending Orders", value: dashboardStats.pendingOrders.toString(), change: null, showChange: false },
  { title: "Inventory Value", value: formatBDT(dashboardStats.inventoryValue), change: null, showChange: false },
  { title: "Total Products", value: dashboardStats.totalProducts.toString(), change: null, showChange: false },
  { title: "Low Stock", value: dashboardStats.lowStock.toString(), change: null, showChange: false },
  { title: "Out of Stock", value: dashboardStats.outOfStock.toString(), change: null, showChange: false },
  { title: "Total Suppliers", value: dashboardStats.totalSuppliers.toString(), change: null, showChange: false },
  { title: "Total Customers", value: dashboardStats.totalCustomers.toString(), change: null, showChange: false },
  { title: "Total Expenses", value: formatBDT(dashboardStats.totalExpenses), change: dashboardStats.expensesChange, showChange: true },
  { title: "Total Revenue", value: formatBDT(dashboardStats.totalRevenue), change: dashboardStats.revenueChange, showChange: true },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.showChange && stat.change !== null && (
              <p className="text-xs text-gray-500">
                <span className={stat.change >= 0 ? "text-green-600" : "text-red-600"}>
                  {stat.change >= 0 ? "+" : ""}{stat.change}%
                </span>
                {" from last month"}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
