"use client";

import { useState } from "react";
import { BarChart3, Plus, ReceiptText, TrendingUp, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { ExpensesTable } from "@/features/expenses/components/expenses-table";
import { ExpenseForm } from "@/features/expenses/components/expense-form";
import initialExpenses from "@/features/expenses/data/expenses.json";
import { Expense } from "@/features/expenses/types";
import { formatBDT } from "@/lib/load-dashboard-data";

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);

  const handleSave = (expense: Expense) => {
    setExpenses((prev) =>
      editingExpense
        ? prev.map((e) => (e.id === expense.id ? expense : e))
        : [...prev, expense]
    );
    setShowForm(false);
    setEditingExpense(undefined);
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const stats = {
    total,
    entries: expenses.length,
    largest: expenses.length > 0 ? Math.max(...expenses.map((e) => e.amount)) : 0,
    average: expenses.length > 0 ? Math.round(total / expenses.length) : 0,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expenses"
        description="Track business expenses and receipts."
        actions={
          <Button
            onClick={() => {
              setEditingExpense(undefined);
              setShowForm(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Total expenses"
          value={formatBDT(stats.total)}
          icon={Wallet}
          iconClassName="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Expense entries"
          value={stats.entries}
          icon={ReceiptText}
          iconClassName="bg-violet-50 text-violet-700"
        />
        <StatCard
          title="Largest expense"
          value={formatBDT(stats.largest)}
          icon={BarChart3}
          iconClassName="bg-amber-50 text-amber-700"
        />
        <StatCard
          title="Average expense"
          value={formatBDT(stats.average)}
          icon={TrendingUp}
          iconClassName="bg-emerald-50 text-emerald-700"
        />
      </div>

      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingExpense(undefined);
          }}
        />
      )}

      <ExpensesTable data={expenses} />
    </div>
  );
}