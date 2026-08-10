"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesReport } from "@/features/reports/components/sales-report";
import { PurchaseReport } from "@/features/reports/components/purchase-report";
import { ProfitReport } from "@/features/reports/components/profit-report";
import { ExportButtons } from "@/features/reports/components/export-buttons";
import salesData from "@/features/reports/data/sales-report.json";
import purchaseData from "@/features/reports/data/purchase-report.json";
import profitData from "@/features/reports/data/profit-report.json";
import { SalesReportData, PurchaseReportData, ProfitReportData } from "@/features/reports/types";

export function ReportsPage() {
  const [sales] = useState<SalesReportData[]>(salesData);
  const [purchases] = useState<PurchaseReportData[]>(purchaseData);
  const [profits] = useState<ProfitReportData[]>(profitData);
  const handleExportCSV = () => console.log("Export CSV");
  const handleExportPDF = () => console.log("Export PDF");
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-gray-500">View business analytics and export reports</p>
        </div>
        <ExportButtons onExportCSV={handleExportCSV} onExportPDF={handleExportPDF} />
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
