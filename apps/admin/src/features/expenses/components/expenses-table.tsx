"use client";

import { useMemo, useState } from "react";
import { Wallet } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { TablePanel } from "@/components/ui/table-panel";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBDT, formatShortDate } from "@/lib/format";
import { Expense } from "@/features/expenses/types";

interface ExpensesTableProps {
  data: Expense[];
}

const PAGE_SIZE = 10;

export function ExpensesTable({ data }: ExpensesTableProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data;
    return data.filter(
      (expense) =>
        expense.category.toLowerCase().includes(query) ||
        expense.description.toLowerCase().includes(query) ||
        expense.id.toLowerCase().includes(query)
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <TablePanel
      title="Expenses"
      count={filtered.length}
      toolbar={
        <SearchInput
          value={search}
          onValueChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Search category, description..."
        />
      }
      footer={
        filtered.length > 0 ? (
          <Pagination
            page={safePage}
            pageCount={totalPages}
            total={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        ) : null
      }
    >
      {rows.length === 0 ? (
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
            {rows.map((expense) => (
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
                  {formatShortDate(expense.date)}
                </TableCell>
                <TableCell className="text-gray-600">{expense.paymentMethod}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TablePanel>
  );
}