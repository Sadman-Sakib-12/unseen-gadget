"use client";
import { useState } from "react";
import { FileText } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Post } from "@/features/blog/types";

export function PostsTable({ data }: { data: Post[] }) {
  const [search, setSearch] = useState("");
  const filtered = data.filter((p) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
  });
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-gray-900">
          Posts <span className="text-gray-400">({filtered.length})</span>
        </p>
        <SearchInput
          value={search}
          onValueChange={setSearch}
          placeholder="Search title, category..."
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No posts found"
          description="Try adjusting your search to find what you are looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <span className="font-mono text-xs text-gray-500">{post.id}</span>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-gray-900">{post.title}</p>
                </TableCell>
                <TableCell className="text-gray-600">{post.category}</TableCell>
                <TableCell className="text-gray-600">{post.author}</TableCell>
                <TableCell className="whitespace-nowrap text-sm text-gray-500">
                  {post.publishedAt || "Draft"}
                </TableCell>
                <TableCell>
                  <StatusBadge status={post.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="border-t border-gray-100 px-4 py-3">
        <p className="text-sm text-gray-500">
          Showing {filtered.length} of {data.length} posts
        </p>
      </div>
    </div>
  );
}