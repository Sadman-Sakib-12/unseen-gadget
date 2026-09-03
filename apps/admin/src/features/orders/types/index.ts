export interface OrderItem {
  id?: string;
  productId?: string | number | null;
  productName: string;
  variantId?: string | null;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  customerName: string;
  email?: string | null;
  customerEmail?: string | null;
  phone?: string | null;
  customerPhone?: string | null;
  product?: string;
  quantity?: number;
  amount?: number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
  city?: string | null;
  shippingAddress?: string | null;
  items?: OrderItem[];
  subtotal?: number;
  discount?: number;
  shippingCost?: number;
  total?: number;
  note?: string | null;
}

