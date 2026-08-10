"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { ExpensesTable } from "@/features/expenses/components/expenses-table";
import { ExpenseForm } from "@/features/expenses/components/expense-form";
import initialExpenses from "@/features/expenses/data/expenses.json";
import { Expense } from "@/features/expenses/types";

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);

  const handleSave = (expense: Expense) => {
    if (editingExpense) {
      setExpenses(expenses.map((e) => (e.id === expense.id ? expense : e)));
    } else {
      setExpenses([...expenses, expense]);
    }
    setShowForm(false);
    setEditingExpense(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-gray-500">Track business expenses and receipts</p>
        </div>
        <button
          onClick={() => { setEditingExpense(undefined); setShowForm(true); }}
          className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Plus size={16} />
          Add Expense
        </button>
      </div>
      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingExpense(undefined); }}
        />
      )}
      <ExpensesTable data={expenses} />
    </div>
  );
}
