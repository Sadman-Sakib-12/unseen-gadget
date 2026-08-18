"use client";
import { useMemo, useState } from "react";
import { FileText, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { StatusBadge } from "@/components/ui/status-badge";
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
import { formatShortDate } from "@/lib/format";
import type { Post } from "@/features/blog/types";

interface PostsTableProps {
  data: Post[];
  onEdit?: (post: Post) => void;
}

const PAGE_SIZE = 10;

export function PostsTable({ data, onEdit }: PostsTableProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data;
    return data.filter(
      (p) => p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <TablePanel
      title="Posts"
      count={filtered.length}
      toolbar={
        <SearchInput
          value={search}
          onValueChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Search title, category..."
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
              {onEdit ? <TableHead className="text-right">Actions</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((post) => (
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
                  {post.publishedAt ? formatShortDate(post.publishedAt) : "Draft"}
                </TableCell>
                <TableCell>
                  <StatusBadge status={post.status} />
                </TableCell>
                {onEdit ? (
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(post)}
                      aria-label={`Edit post ${post.title}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TablePanel>
  );
}