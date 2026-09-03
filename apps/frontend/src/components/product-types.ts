export interface DeliveryInfo {
  insideDhaka?: string;
  outsideDhaka?: string;
  shippingCost?: string;
}

export interface Product {
  id: string | number;
  name: string;
  slug: string;
  category: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image?: string;
  images?: string[];
  badge?: string | null;
  colors?: string[];
  inStock?: boolean;
  rating?: number;
  reviews?: number;
  description?: string;
  features?: string[];
  specifications?: Record<string, string>;
  deliveryInfo?: DeliveryInfo;
  warranty?: string[] | string;
  sku?: string | null;
  variants?: any[];
}

// Export canonical Product and backward-compatible alias
export type MockProduct = Product;

export type SortOption = "default" | "price-asc" | "price-desc" | "name-asc" | "rating";