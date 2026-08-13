"use client";
import { useState } from "react";
import { BarChart3, CircleDollarSign, PackageSearch, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { SalesReport } from "./sales-report";
import { PurchaseReport } from "./purchase-report";
import { ProfitReport } from "./profit-report";
import { ExportButtons } from "./export-buttons";
import salesData from "@/features/reports/data/sales-report.json";
import purchaseData from "@/features/reports/data/purchase-report.json";
import profitData from "@/features/reports/data/profit-report.json";
import { formatBDT } from "@/lib/load-dashboard-data";
import type { SalesReportData, PurchaseReportData, ProfitReportData } from "@/features/reports/types";

export function ReportsPage() {
  const [sales] = useState<SalesReportData[]>(salesData);
  const [purchases] = useState<PurchaseReportData[]>(purchaseData);
  const [profits] = useState<ProfitReportData[]>(profitData);
  const handleExportCSV = () => console.log("Export CSV");
  const handleExportPDF = () => console.log("Export PDF");

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
    </div>
  );
}