"use client";
import { ProfitReportData } from "@/features/reports/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function ProfitReport({ data }: { data: ProfitReportData[] }) {
  if (!data.length) return <p className="text-gray-500">No profit data available.</p>;
  const report = data[0];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold">{report.totalRevenue.toLocaleString()} BDT</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Cost</p>
          <p className="text-2xl font-bold">{report.totalCost.toLocaleString()} BDT</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Net Profit</p>
          <p className="text-2xl font-bold text-green-600">{report.netProfit.toLocaleString()} BDT</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Profit Margin</p>
          <p className="text-2xl font-bold">{report.profitMargin}%</p>
        </div>
      </div>
      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-4">Monthly Profit Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={report.monthlyBreakdown}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="profit" fill="#000" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-4">Top Categories by Profit</h3>
        <div className="space-y-2">
          {report.topCategories.map((c, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm">{c.category}</span>
              <span className="text-sm font-medium">{c.profit.toLocaleString()} BDT</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
