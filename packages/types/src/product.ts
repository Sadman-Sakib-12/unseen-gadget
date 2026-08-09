export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discount?: number;
  stock: number;
  images: string[];
  categoryId: string;
  brand?: string;
  sku?: string;
  createdAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  price?: number;
  stock: number;
  sku?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  image?: string;
}
