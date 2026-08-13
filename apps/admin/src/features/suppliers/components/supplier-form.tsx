"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Supplier } from "@/features/suppliers/types";

interface SupplierFormProps {
  supplier?: Supplier;
  open: boolean;
  onClose: () => void;
  onSave: (supplier: Omit<Supplier, "id">) => void;
}

export function SupplierForm({ supplier, open, onClose, onSave }: SupplierFormProps) {
  const [formData, setFormData] = useState({
    name: supplier?.name || "",
    phone: supplier?.phone || "",
    email: supplier?.email || "",
    address: supplier?.address || "",
    company: supplier?.company || "",
    dueAmount: supplier?.dueAmount || 0,
    totalPurchases: supplier?.totalPurchases || 0,
    status: supplier?.status || "ACTIVE",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle>{supplier ? "Edit Supplier" : "Add Supplier"}</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <form id="supplier-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <Input
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Due Amount (BDT)
              </label>
              <Input
                type="number"
                value={formData.dueAmount}
                onChange={(e) => setFormData({ ...formData, dueAmount: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Total Purchases (BDT)
              </label>
              <Input
                type="number"
                value={formData.totalPurchases}
                onChange={(e) =>
                  setFormData({ ...formData, totalPurchases: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <Select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as "ACTIVE" | "INACTIVE" })
              }
              options={[
                { value: "ACTIVE", label: "Active" },
                { value: "INACTIVE", label: "Inactive" },
              ]}
            />
          </div>
        </form>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" form="supplier-form">
          {supplier ? "Update" : "Create"} Supplier
        </Button>
      </DialogFooter>
    </Dialog>
  );
}