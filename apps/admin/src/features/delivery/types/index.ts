export interface Delivery {
  id: string;
  orderId: string;
  customerName: string;
  address: string;
  city: string;
  courier: string;
  trackingNumber: string;
  status: string;
  shippingCost: number;
  estimatedDelivery: string;
  deliveredAt: string | null;
}
