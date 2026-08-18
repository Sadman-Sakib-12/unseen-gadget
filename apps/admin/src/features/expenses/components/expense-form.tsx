"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Expense } from "@/features/expenses/types";

interface ExpenseFormProps {
  expense?: Expense;
  onSave: (expense: Expense) => void;
  onCancel: () => void;
}

export function ExpenseForm({ expense, onSave, onCancel }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    id: expense?.id || "",
    category: expense?.category || "",
    amount: expense?.amount || 0,
    description: expense?.description || "",
    date: expense?.date || "",
    paymentMethod: expense?.paymentMethod || "Cash",
    receipt: expense?.receipt || null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = expense?.id || `EXP-${String(Date.now()).slice(-3)}`;
    const date = formData.date || new Date().toISOString().split("T")[0];
    onSave({ ...formData, id, date });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{expense ? "Edit Expense" : "Add Expense"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <Input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Amount (BDT)
              </label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <Select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                options={[
                  { value: "Cash", label: "Cash" },
                  { value: "Bank Transfer", label: "Bank Transfer" },
                  { value: "Card", label: "Card" },
                  { value: "bKash", label: "bKash" },
                  { value: "Nagad", label: "Nagad" },
                ]}
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Expense</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}