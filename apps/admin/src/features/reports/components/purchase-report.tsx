"use client";
import { PurchaseReportData } from "@/features/reports/types";

export function PurchaseReport({ data }: { data: PurchaseReportData[] }) {
  if (!data.length) return <p className="text-gray-500">No purchase data available.</p>;
  const report = data[0];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Purchases</p>
          <p className="text-2xl font-bold">{report.totalPurchases.toLocaleString()} BDT</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Suppliers</p>
          <p className="text-2xl font-bold">{report.totalSuppliers}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Products Purchased</p>
          <p className="text-2xl font-bold">{report.totalProductsPurchased}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Avg Purchase</p>
          <p className="text-2xl font-bold">{report.averagePurchaseValue.toLocaleString()} BDT</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold mb-4">Top Suppliers</h3>
          <div className="space-y-2">
            {report.topSuppliers.map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm">{s.name}</span>
                <span className="text-sm font-medium">{s.amount.toLocaleString()} BDT</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
          <div className="space-y-2">
            {report.categoryBreakdown.map((c, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm">{c.category}</span>
                <span className="text-sm font-medium">{c.amount.toLocaleString()} BDT</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
