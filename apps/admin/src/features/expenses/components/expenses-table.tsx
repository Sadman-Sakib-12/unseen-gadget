"use client";
import { useState } from "react";
import { Expense } from "@/features/expenses/types";

export function ExpensesTable({ data }: { data: Expense[] }) {
  const [search, setSearch] = useState("");
  const filtered = data.filter((e) =>
    e.category.toLowerCase().includes(search.toLowerCase()) ||
    e.description.toLowerCase().includes(search.toLowerCase())
  );
  const totalExpenses = filtered.reduce((sum, e) => sum + e.amount, 0);
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 p-4">
        <p className="text-sm text-gray-500">Total Expenses</p>
        <p className="text-2xl font-bold">{totalExpenses.toLocaleString()} BDT</p>
      </div>
      <input
        type="text"
        placeholder="Search expenses..."
        className="w-full max-w-sm rounded-md border border-gray-200 px-3 py-2 text-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">ID</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-left font-medium">Description</th>
              <th className="px-4 py-3 text-left font-medium">Amount</th>
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-left font-medium">Method</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs">{expense.id}</td>
                <td className="px-4 py-3">{expense.category}</td>
                <td className="px-4 py-3">{expense.description}</td>
                <td className="px-4 py-3">{expense.amount.toLocaleString()}</td>
                <td className="px-4 py-3">{expense.date}</td>
                <td className="px-4 py-3">{expense.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500">Showing {filtered.length} of {data.length} expenses</p>
    </div>
  );
}
