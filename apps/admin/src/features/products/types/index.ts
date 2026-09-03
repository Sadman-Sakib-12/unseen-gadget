export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku: string;
  images?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

export interface Product {
  id: string | number;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  discount: number;
  sku: string;
  barcode: string;
  images: string[];
  stock: number;
  warranty: string;
  specifications: Record<string, string | undefined>;
  status: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
  shippingType?: "FREE" | "PAID";
  shippingCost?: number;
  variants: ProductVariant[];
}
