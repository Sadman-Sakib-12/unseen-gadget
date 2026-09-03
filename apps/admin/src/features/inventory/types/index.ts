export interface WarehouseInfo {
  id: string;
  name: string;
  location?: string | null;
}

export interface InventoryItem {
  id: string;
  productId?: string;
  name: string;
  sku: string;
  stock: number;
  minStock: number;
  maxStock: number;
  status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  lastRestocked?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
  warehouse?: string | WarehouseInfo | null;
  product?: {
    id: string;
    name: string;
    slug?: string;
    images?: string[];
    price?: number;
    sku?: string;
  } | null;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: "IN" | "OUT" | "ADJUSTMENT";
  quantity: number;
  date?: string;
  createdAt?: string;
  reference?: string | null;
  note?: string | null;
  product?: {
    id: string;
    name: string;
    slug?: string;
    images?: string[];
  } | null;
}
