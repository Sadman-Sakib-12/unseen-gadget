import { api } from "@/lib/api";

import type { Supplier, SupplierTransaction } from "../types";

export async function fetchSuppliers(): Promise<Supplier[]> {
  const res = await api.suppliers.list();
  return (res.data as Supplier[]) ?? [];
}

export async function fetchSupplierTransactions(id: number): Promise<SupplierTransaction[]> {
  const res = await api.suppliers.transactions(String(id));
  return (res.data as SupplierTransaction[]) ?? [];
}

export { fetchSuppliers as suppliers };
