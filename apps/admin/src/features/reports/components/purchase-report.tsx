"use client";
import { PackageSearch } from "lucide-react";
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
import { chartAxis, chartColors, chartGridStroke, chartTooltip } from "@/lib/chart-theme";
import type { PurchaseReportData } from "@/features/reports/types";

export function PurchaseReport({ data }: { data: PurchaseReportData[] }) {
  if (!data.length) {
    return (
      <Card>
        <EmptyState
          icon={PackageSearch}
          title="No purchase data available"
          description="Purchase reports will appear here once you have recorded purchases."
        />
      </Card>
    );
  }
  const report = data[0];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Total Purchases"
          value={formatBDT(report.totalPurchases)}
          icon={PackageSearch}
          iconClassName="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Suppliers"
          value={report.totalSuppliers}
          icon={PackageSearch}
          iconClassName="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Products Purchased"
          value={report.totalProductsPurchased}
          icon={PackageSearch}
          iconClassName="bg-violet-50 text-violet-700"
        />
        <StatCard
          title="Avg Purchase"
          value={formatBDT(report.averagePurchaseValue)}
          icon={PackageSearch}
          iconClassName="bg-amber-50 text-amber-700"
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Monthly Purchases</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={report.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
              <XAxis dataKey="month" tick={{ fill: chartAxis.tickFill, fontSize: chartAxis.fontSize }} stroke={chartAxis.stroke} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: chartAxis.tickFill, fontSize: chartAxis.fontSize }} stroke={chartAxis.stroke} tickLine={false} axisLine={false} />
              <Tooltip
                {...chartTooltip}
                formatter={(value) => formatBDT(Number(value))}
              />
              <Bar dataKey="amount" fill={chartColors.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Suppliers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.topSuppliers.map((s, i) => (
              <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                <span className="text-sm text-gray-700">{s.name}</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatBDT(s.amount)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.categoryBreakdown.map((c, i) => (
              <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                <span className="text-sm text-gray-700">{c.category}</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatBDT(c.amount)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}