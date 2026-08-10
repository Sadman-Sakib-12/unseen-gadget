export interface Return {
  id: string;
  orderId: string;
  customerName: string;
  product: string;
  reason: string;
  status: string;
  refundAmount: number;
  requestDate: string;
  resolvedDate: string | null;
}
