"use client";
import { CircleDollarSign } from "lucide-react";
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
import type { ProfitReportData } from "@/features/reports/types";

export function ProfitReport({ data }: { data: ProfitReportData[] }) {
  if (!data.length) {
    return (
      <Card>
        <EmptyState
          icon={CircleDollarSign}
          title="No profit data available"
          description="Profit reports will appear here once you have recorded revenue and costs."
        />
      </Card>
    );
  }
  const report = data[0];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatBDT(report.totalRevenue)}
          icon={CircleDollarSign}
          iconClassName="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Total Cost"
          value={formatBDT(report.totalCost)}
          icon={CircleDollarSign}
          iconClassName="bg-orange-50 text-orange-700"
        />
        <StatCard
          title="Net Profit"
          value={<span className="text-emerald-600">{formatBDT(report.netProfit)}</span>}
          icon={CircleDollarSign}
          iconClassName="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Profit Margin"
          value={`${report.profitMargin}%`}
          icon={CircleDollarSign}
          iconClassName="bg-violet-50 text-violet-700"
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Monthly Profit Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={report.monthlyBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
              <XAxis dataKey="month" tick={{ fill: chartAxis.tickFill, fontSize: chartAxis.fontSize }} stroke={chartAxis.stroke} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: chartAxis.tickFill, fontSize: chartAxis.fontSize }} stroke={chartAxis.stroke} tickLine={false} axisLine={false} />
              <Tooltip
                {...chartTooltip}
                formatter={(value) => formatBDT(Number(value))}
              />
              <Bar dataKey="profit" fill={chartColors.emerald} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Top Categories by Profit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {report.topCategories.map((c, i) => (
            <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0">
              <span className="text-sm text-gray-700">{c.category}</span>
              <span className="text-sm font-semibold text-gray-900">{formatBDT(c.profit)}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}