"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { BarChart3, CircleDollarSign, PackageSearch, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { SalesReport } from "./sales-report";
import { PurchaseReport } from "./purchase-report";
import { ProfitReport } from "./profit-report";
import { ExportButtons } from "./export-buttons";
import { formatBDT } from "@/lib/load-dashboard-data";
import { apiRequest } from "@/lib/api";
import type { SalesReportData, PurchaseReportData, ProfitReportData } from "@/features/reports/types";

function exportCsv(filename: string, rows: (string | number)[][]) {
  const esc = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;
  const csv = rows.map((row) => row.map(esc).join(",")).join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function ReportsPage() {
  const [sales, setSales] = useState<SalesReportData[]>([]);
  const [purchases, setPurchases] = useState<PurchaseReportData[]>([]);
  const [profits, setProfits] = useState<ProfitReportData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiRequest("/reports/sales").catch(() => ({ success: false, data: [] })),
      apiRequest("/reports/purchases").catch(() => ({ success: false, data: [] })),
      apiRequest("/reports/profit").catch(() => ({ success: false, data: [] })),
    ])
      .then(([salesRes, purchaseRes, profitRes]) => {
        if (salesRes.success && Array.isArray(salesRes.data)) setSales(salesRes.data as SalesReportData[]);
        if (purchaseRes.success && Array.isArray(purchaseRes.data)) setPurchases(purchaseRes.data as PurchaseReportData[]);
        if (profitRes.success && Array.isArray(profitRes.data)) setProfits(profitRes.data as ProfitReportData[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleExportCSV = () => {
    const daily = sales[0]?.dailyData ?? [];
    const rows: (string | number)[][] = [
      ["Metric", "Value"],
      ["Total Sales", formatBDT(sales[0]?.totalSales ?? 0)],
      ["Total Purchases", formatBDT(purchases[0]?.totalPurchases ?? 0)],
      ["Total Revenue", formatBDT(profits[0]?.totalRevenue ?? 0)],
      ["Net Profit", formatBDT(profits[0]?.netProfit ?? 0)],
      [],
      ["Date", "Revenue"],
      ...daily.map((d) => [String(d.date), d.revenue]),
    ];
    exportCsv("reports-summary", rows);
    toast.success("Report exported as CSV");
  };
  const handleExportPDF = () => toast.info("PDF export is not available yet");

  const totalSales = sales[0]?.totalSales ?? 0;
  const totalPurchases = purchases[0]?.totalPurchases ?? 0;
  const netProfit = profits[0]?.netProfit ?? 0;
  const totalRevenue = profits[0]?.totalRevenue ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="View business analytics and export reports"
        actions={<ExportButtons onExportCSV={handleExportCSV} onExportPDF={handleExportPDF} />}
      />

      {loading ? (
        <div className="flex items-center justify-center py-12 text-sm text-gray-500">Loading reports...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            <StatCard
              title="Total Sales"
              value={formatBDT(totalSales)}
              icon={TrendingUp}
              iconClassName="bg-blue-50 text-blue-700"
            />
            <StatCard
              title="Total Purchases"
              value={formatBDT(totalPurchases)}
              icon={PackageSearch}
              iconClassName="bg-violet-50 text-violet-700"
            />
            <StatCard
              title="Total Revenue"
              value={formatBDT(totalRevenue)}
              icon={BarChart3}
              iconClassName="bg-emerald-50 text-emerald-700"
            />
            <StatCard
              title="Net Profit"
              value={
                <span className={netProfit < 0 ? "text-red-600" : "text-emerald-600"}>
                  {formatBDT(netProfit)}
                </span>
              }
              icon={CircleDollarSign}
              iconClassName="bg-amber-50 text-amber-700"
            />
          </div>

          <Tabs defaultValue="sales">
            <TabsList>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="purchases">Purchases</TabsTrigger>
              <TabsTrigger value="profit">Profit</TabsTrigger>
            </TabsList>
            <TabsContent value="sales" className="mt-4">
              <SalesReport data={sales} />
            </TabsContent>
            <TabsContent value="purchases" className="mt-4">
              <PurchaseReport data={purchases} />
            </TabsContent>
            <TabsContent value="profit" className="mt-4">
              <ProfitReport data={profits} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
