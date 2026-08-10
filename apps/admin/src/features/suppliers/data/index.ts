import suppliersJson from "./suppliers.json";
import supplierTransactionsJson from "./supplier-transactions.json";

import type { Supplier, SupplierTransaction } from "../types";

export const suppliers = suppliersJson as Supplier[];
export const supplierTransactions = supplierTransactionsJson as SupplierTransaction[];
