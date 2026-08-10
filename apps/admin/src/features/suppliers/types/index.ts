export interface Supplier {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  company: string;
  dueAmount: number;
  totalPurchases: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface SupplierTransaction {
  id: number;
  supplierId: number;
  supplierName: string;
  type: "PURCHASE" | "PAYMENT" | "REFUND";
  amount: number;
  date: string;
  reference: string;
  note: string;
}
