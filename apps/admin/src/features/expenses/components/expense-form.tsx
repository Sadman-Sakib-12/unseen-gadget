"use client";
import { useState } from "react";
import { Expense } from "@/features/expenses/types";

interface ExpenseFormProps {
  expense?: Expense;
  onSave: (expense: Expense) => void;
  onCancel: () => void;
}

export function ExpenseForm({ expense, onSave, onCancel }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    id: expense?.id || "EXP-" + String(Date.now()).slice(-3),
    category: expense?.category || "",
    amount: expense?.amount || 0,
    description: expense?.description || "",
    date: expense?.date || new Date().toISOString().split("T")[0],
    paymentMethod: expense?.paymentMethod || "Cash",
    receipt: expense?.receipt || null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Expense);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold">{expense ? "Edit Expense" : "Add Expense"}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input type="text" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Amount (BDT)</label>
          <input type="number" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input type="date" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Payment Method</label>
          <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Card">Card</option>
            <option value="bKash">bKash</option>
            <option value="Nagad">Nagad</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
        <button type="submit" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Save Expense</button>
      </div>
    </form>
  );
}
