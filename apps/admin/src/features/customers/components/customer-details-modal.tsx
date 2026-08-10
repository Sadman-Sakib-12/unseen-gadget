"use client";
import { X } from "lucide-react";
import { Customer } from "@/features/customers/types";

interface CustomerDetailsModalProps {
  customer: Customer | null;
  onClose: () => void;
}

export function CustomerDetailsModal({ customer, onClose }: CustomerDetailsModalProps) {
  if (!customer) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Customer Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Customer ID</p>
              <p className="font-mono text-sm">{customer.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{customer.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-sm">{customer.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-sm">{customer.phone}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Address</p>
              <p className="text-sm">{customer.address}, {customer.city}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-sm">{customer.totalOrders}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-sm">{customer.totalSpent.toLocaleString()} BDT</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Order</p>
              <p className="text-sm">{customer.lastOrder || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Join Date</p>
              <p className="text-sm">{customer.joinDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
