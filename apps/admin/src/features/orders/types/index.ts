export interface OrderItem {
  id: string;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  product: string;
  amount: number;
  status: string;
  paymentStatus: string;
  date: string;
  city: string;
  shippingAddress: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
}
