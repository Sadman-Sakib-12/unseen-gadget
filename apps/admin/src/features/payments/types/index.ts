export interface Payment {
  id: string;
  transactionId: string;
  orderId: string;
  customerName: string;
  amount: number;
  method: string;
  status: string;
  date: string;
  paymentGateway: string;
}
