"use client";
import { TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import { formatBDT } from "@/lib/load-dashboard-data";
import type { SalesReportData } from "@/features/reports/types";

export function SalesReport({ data }: { data: SalesReportData[] }) {
  if (!data.length) {
    return (
      <Card>
        <EmptyState
          icon={TrendingUp}
          title="No sales data available"
          description="Sales reports will appear here once you have recorded sales."
        />
      </Card>
    );
  }
  const report = data[0];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Total Sales"
          value={formatBDT(report.totalSales)}
          icon={TrendingUp}
          iconClassName="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Total Orders"
          value={report.totalOrders}
          icon={TrendingUp}
          iconClassName="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Customers"
          value={report.totalCustomers}
          icon={TrendingUp}
          iconClassName="bg-violet-50 text-violet-700"
        />
        <StatCard
          title="Avg Order Value"
          value={formatBDT(report.averageOrderValue)}
          icon={TrendingUp}
          iconClassName="bg-amber-50 text-amber-700"
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Daily Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={report.dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#111827" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.topProducts.map((p, i) => (
              <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                <span className="text-sm text-gray-700">{p.name}</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatBDT(p.revenue)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sales by Channel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.salesByChannel.map((c, i) => (
              <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                <span className="text-sm text-gray-700">{c.channel}</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatBDT(c.revenue)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}