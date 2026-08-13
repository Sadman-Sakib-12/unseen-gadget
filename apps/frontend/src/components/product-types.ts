export interface DeliveryInfo {
  insideDhaka?: string;
  outsideDhaka?: string;
  shippingCost?: string;
}

export interface MockProduct {
  id: number;
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
  warranty?: string[];
}

export type ViewMode = "grid" | "list";
export type SortOption = "default" | "price-asc" | "price-desc" | "name-asc" | "rating";