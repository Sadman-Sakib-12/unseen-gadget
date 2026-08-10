export interface PurchaseItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Purchase {
  id: number;
  supplierId: number;
  supplierName: string;
  items: PurchaseItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paidAmount: number;
  dueAmount: number;
  status: "DRAFT" | "PENDING" | "RECEIVED" | "CANCELLED";
  date: string;
  invoiceNumber: string;
}
