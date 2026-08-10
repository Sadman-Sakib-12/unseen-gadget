export interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  stock: number;
  minStock: number;
  maxStock: number;
  status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  lastRestocked: string;
  warehouse: string;
}

export interface StockMovement {
  id: number;
  productId: number;
  productName: string;
  type: "IN" | "OUT" | "ADJUSTMENT";
  quantity: number;
  date: string;
  reference: string;
  note: string;
}
