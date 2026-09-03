"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { api } from "@/lib/api";

function formatBDT(amount: number) {
  return `৳${amount.toLocaleString("en-BD", { minimumFractionDigits: 0 })}`;
}

interface StockItem {
  id: number;
  productName: string;
  slug: string;
  color?: string;
  quantity: number;
  available: number;
  lowStockThreshold: number;
  totalValue: number;
}

interface StockMovement {
  id: number;
  productName: string;
  type: "IN" | "OUT" | "ADJUSTMENT";
  quantity: number;
  date: string;
  notes?: string;
}

export function InventoryPage() {
  const router = useRouter();
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [, setMovements] = useState<StockMovement[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.inventory.list().then((res) => {
        if (res.success && Array.isArray(res.data)) setStockItems(res.data as StockItem[]);
      }),
      api.inventory.stockMovements().then((res) => {
        if (res.success && Array.isArray(res.data)) setMovements(res.data as StockMovement[]);
      }),
    ])
      .catch((err: unknown) => {
        const errorObj = err as { message?: string };
        setError(errorObj.message || "Failed to load inventory");
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card py-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <h3 className="mt-3 text-sm font-bold text-foreground">Loading inventory...</h3>
      </div>
    );
  }

  if (error) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Error: {error}</div>;
  }

  const filteredItems = stockItems.filter(
    (item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.color && item.color.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalValue = filteredItems.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockItems = filteredItems.filter((item) => item.quantity <= item.lowStockThreshold);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Manage product stock levels and stock movements."
        actions={
          <Button onClick={() => router.push("/products")} variant="outline">
            View Products
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard title="Total products" value={stockItems.length} icon={Box} iconClassName="bg-blue-50 text-blue-700" />
        <StatCard title="Total stock value" value={formatBDT(totalValue)} icon={Box} iconClassName="bg-violet-50 text-violet-700" />
        <StatCard title="Low stock alerts" value={lowStockItems.length} icon={Box} iconClassName="bg-red-50 text-red-700" />
      </div>

      {filteredItems.length > 0 ? (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border bg-muted/50 px-4 py-3">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-sm rounded-xl border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Product</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Color</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Stock</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Available</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Value</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">{item.productName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.color || "-"}</td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-foreground">{item.available}</td>
                  <td className="px-4 py-3 text-right text-foreground">{formatBDT(item.totalValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-20 text-center">
          <Box className="h-12 w-12 text-muted-foreground" strokeWidth={1.2} />
          <h3 className="mt-3 text-sm font-semibold text-foreground">No inventory items</h3>
        </div>
      )}
    </div>
  );
}
