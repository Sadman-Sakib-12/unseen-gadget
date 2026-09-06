"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Customer } from "@/features/customers/types";

interface CustomerEditModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CustomerEditModal({
  customer,
  isOpen,
  onClose,
  onSuccess,
}: CustomerEditModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("active");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (customer) {
      setName(customer.name || "");
      setPhone(customer.phone || "");
      setStatus(customer.status?.toLowerCase() || "active");
    }
  }, [customer]);

  if (!isOpen || !customer) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.customers.update(customer.id, {
        name: name.trim(),
        phone: phone.trim(),
        status,
      });
      toast.success("Customer updated successfully");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogHeader close>
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogDescription>
          Update profile details and account status for {customer.email}
        </DialogDescription>
      </DialogHeader>
      <DialogContent>
        <form id="edit-customer-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Full Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Customer's full name"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Phone Number
            </label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +880 1712 345678"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Account Status
            </label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={isSubmitting}
              options={[
                { value: "active", label: "Active" },
                { value: "blocked", label: "Blocked" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
            <p className="mt-1 text-[11px] text-gray-400">
              Blocked customers cannot log in or place new orders.
            </p>
          </div>
        </form>
      </DialogContent>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" form="edit-customer-form" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
