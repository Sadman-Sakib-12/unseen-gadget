import { apiRequest } from "@/lib/api";
import { InventoryItem, StockMovement } from "@/features/inventory/types";

export let inventoryItems: InventoryItem[] = [];
export let stockMovements: StockMovement[] = [];

export async function fetchInventoryItems(): Promise<InventoryItem[]> {
  try {
    const res = await apiRequest("/admin/inventory");
    if (res.success && Array.isArray(res.data)) {
      inventoryItems = res.data.map((item: InventoryItem & { product?: { id?: string } }) => ({
        ...item,
        productId: item.productId || item.product?.id || item.id,
      }));
      return inventoryItems;
    }
  } catch {
    inventoryItems = [];
  }
  return inventoryItems;
}

export async function fetchStockMovements(): Promise<StockMovement[]> {
  try {
    const res = await apiRequest("/admin/stock-movements");
    if (res.success && Array.isArray(res.data)) {
      stockMovements = res.data;
    }
  } catch {
    stockMovements = [];
  }
  return stockMovements;
}

export async function createStockAdjustment(data: {
  productId: string;
  type: "IN" | "OUT" | "ADJUSTMENT";
  quantity: number;
  note?: string;
  reference?: string;
}): Promise<unknown> {
  return apiRequest("/admin/stock-movements", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
