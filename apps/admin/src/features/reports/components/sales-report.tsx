"use client";
import { SalesReportData } from "@/features/reports/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function SalesReport({ data }: { data: SalesReportData[] }) {
  if (!data.length) return <p className="text-gray-500">No sales data available.</p>;
  const report = data[0];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="text-2xl font-bold">{report.totalSales.toLocaleString()} BDT</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold">{report.totalOrders}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Customers</p>
          <p className="text-2xl font-bold">{report.totalCustomers}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Avg Order Value</p>
          <p className="text-2xl font-bold">{report.averageOrderValue.toLocaleString()} BDT</p>
        </div>
      </div>
      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-4">Daily Revenue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={report.dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#000" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold mb-4">Top Products</h3>
          <div className="space-y-2">
            {report.topProducts.map((p, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm">{p.name}</span>
                <span className="text-sm font-medium">{p.revenue.toLocaleString()} BDT</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold mb-4">Sales by Channel</h3>
          <div className="space-y-2">
            {report.salesByChannel.map((c, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm">{c.channel}</span>
                <span className="text-sm font-medium">{c.revenue.toLocaleString()} BDT</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
