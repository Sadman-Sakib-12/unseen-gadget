"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBDT } from "@/lib/load-dashboard-data";
import { Expense } from "@/features/expenses/types";

interface ExpensesTableProps {
  data: Expense[];
}

export function ExpensesTable({ data }: ExpensesTableProps) {
  const [search, setSearch] = useState("");

  const filtered = data.filter((expense) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      expense.category.toLowerCase().includes(query) ||
      expense.description.toLowerCase().includes(query) ||
      expense.id.toLowerCase().includes(query)
    );
  });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-gray-900">
          Expenses <span className="text-gray-400">({filtered.length})</span>
        </p>
        <SearchInput
          value={search}
          onValueChange={setSearch}
          placeholder="Search category, description..."
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No expenses found"
          description="Try adjusting your search to find what you are looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Date</TableHead>
              <TableHead>Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  <span className="font-mono text-xs text-gray-500">{expense.id}</span>
                </TableCell>
                <TableCell className="font-medium text-gray-900">
                  {expense.category}
                </TableCell>
                <TableCell className="max-w-[14rem] truncate text-gray-600">
                  {expense.description}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums text-gray-900">
                  {formatBDT(expense.amount)}
                </TableCell>
                <TableCell className="whitespace-nowrap text-right text-sm text-gray-500">
                  {expense.date}
                </TableCell>
                <TableCell className="text-gray-600">{expense.paymentMethod}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="border-t border-gray-100 px-4 py-3">
        <p className="text-sm text-gray-500">
          Showing {filtered.length} of {data.length} expenses
        </p>
      </div>
    </div>
  );
}