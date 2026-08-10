"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { CustomersTable } from "@/features/customers/components/customers-table";
import { CustomerDetailsModal } from "@/features/customers/components/customer-details-modal";
import initialCustomers from "@/features/customers/data/customers.json";
import { Customer } from "@/features/customers/types";

export function CustomersPage() {
  const [customers] = useState<Customer[]>(initialCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-gray-500">Manage your customer base</p>
        </div>
        <button className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
          <Plus size={16} />
          Add Customer
        </button>
      </div>
      <CustomersTable data={customers} onView={(c) => setSelectedCustomer(c)} />
      <CustomerDetailsModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
    </div>
  );
}
