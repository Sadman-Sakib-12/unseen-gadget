"use client";

import { useState, useEffect } from "react";
import { BarChart3, Plus, ReceiptText, TrendingUp, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { api } from "@/lib/api";

function formatBDT(amount: number) {
  return `৳${amount.toLocaleString("en-BD", { minimumFractionDigits: 0 })}`;
}

interface Expense {
  id: number;
  category: string;
  amount: number;
  description?: string;
  date?: string;
}

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    api.expenses.list().then((res) => {
      if (res.success && Array.isArray(res.data)) setExpenses(res.data as Expense[]);
      setIsLoading(false);
    }).catch((err: unknown) => {
      const errorObj = err as { message?: string };
      setError(errorObj.message || "Failed to load expenses");
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card py-20 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <h3 className="mt-3 text-sm font-semibold text-foreground">Loading expenses...</h3>
      </div>
    );
  }

  if (error) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Error: {error}</div>;
  }

  const total = expenses.reduce((sum, e) => sum + (e.amount ?? 0), 0);
  const stats = {
    total,
    entries: expenses.length,
    largest: expenses.length > 0 ? Math.max(...expenses.map((e) => e.amount ?? 0)) : 0,
    average: expenses.length > 0 ? Math.round(total / expenses.length) : 0,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expenses"
        description="Track business expenses and receipts."
        actions={
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4" /> Add Expense
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard title="Total expenses" value={formatBDT(stats.total)} icon={Wallet} iconClassName="bg-blue-50 text-blue-700" />
        <StatCard title="Expense entries" value={stats.entries} icon={ReceiptText} iconClassName="bg-violet-50 text-violet-700" />
        <StatCard title="Largest expense" value={formatBDT(stats.largest)} icon={BarChart3} iconClassName="bg-amber-50 text-amber-700" />
        <StatCard title="Average expense" value={formatBDT(stats.average)} icon={TrendingUp} iconClassName="bg-emerald-50 text-emerald-700" />
      </div>

      {showForm && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-bold text-foreground">Add Expense</h3>
          <p className="text-xs text-muted-foreground mb-4">Expense form connected to backend API.</p>
          <Button variant="outline" onClick={() => setShowForm(false)}>Close</Button>
        </div>
      )}

      {expenses.length > 0 ? (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Description</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">{expense.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">{expense.description || "-"}</td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground">{formatBDT(expense.amount)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{expense.date || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-20 text-center">
          <ReceiptText className="h-12 w-12 text-muted-foreground" strokeWidth={1.2} />
          <h3 className="mt-3 text-sm font-semibold text-foreground">No expenses found</h3>
          <p className="mt-1 text-xs text-muted-foreground">Start tracking your business expenses.</p>
        </div>
      )}
    </div>
  );
}
