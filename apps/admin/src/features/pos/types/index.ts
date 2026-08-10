export interface PosProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  sku: string;
  barcode: string;
}

export interface PosCartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  discount: number;
  tax: number;
  total: number;
}

export interface PosSession {
  id: string;
  startTime: string;
  endTime: string | null;
  totalSales: number;
  totalOrders: number;
  cashInHand: number;
}
