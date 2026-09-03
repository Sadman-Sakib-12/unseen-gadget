"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { BarChart3, Plus, ReceiptText, TrendingUp, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ExpensesTable } from "@/features/expenses/components/expenses-table";
import { ExpenseForm } from "@/features/expenses/components/expense-form";
import { api } from "@/lib/api";
import { Expense } from "@/features/expenses/types";
import { formatBDT } from "@/lib/load-dashboard-data";

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);

  useEffect(() => {
    api.expenses
      .list()
      .then((res) => setExpenses((res.data as Expense[]) ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);

  const handleSave = async (expense: Expense) => {
    try {
      const payload = {
        category: expense.category,
        amount: expense.amount,
        description: expense.description ?? undefined,
        date: expense.date,
        paymentMethod: expense.paymentMethod,
        receipt: expense.receipt ?? undefined,
      };
      if (editingExpense) {
        const res = await api.expenses.update(expense.id, payload);
        setExpenses((prev) => prev.map((e) => (e.id === expense.id ? (res.data as Expense) : e)));
        toast.success("Expense updated successfully");
      } else {
        const res = await api.expenses.create(payload);
        setExpenses((prev) => [...prev, res.data as Expense]);
        toast.success("Expense added successfully");
      }
      setShowForm(false);
      setEditingExpense(undefined);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Failed to save expense");
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDelete = (expense: Expense) => {
    setDeleteTarget(expense);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        await api.expenses.delete(String(deleteTarget.id));
        setExpenses((prev) => prev.filter((e) => e.id !== deleteTarget.id));
        toast.success("Expense deleted successfully");
        setDeleteTarget(null);
      } catch (err: any) {
        toast.error(err.message || "Failed to delete expense");
      }
    }
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

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : (
        <ExpensesTable data={expenses} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Expense"
        description={`Are you sure you want to delete this ${deleteTarget?.category} expense of ${formatBDT(deleteTarget?.amount || 0)}?`}
        confirmLabel="Delete Expense"
        destructive
      />
    </div>
  );
}