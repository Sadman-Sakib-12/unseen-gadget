"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/features/blog/types";

const statusVariants: Record<string, string> = {
  published: "success",
  draft: "secondary",
  archived: "destructive",
};

export function PostsTable({ data }: { data: Post[] }) {
  const [search, setSearch] = useState("");
  const filtered = data.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search posts..."
        className="w-full max-w-sm rounded-md border border-gray-200 px-3 py-2 text-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">ID</th>
              <th className="px-4 py-3 text-left font-medium">Title</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-left font-medium">Author</th>
              <th className="px-4 py-3 text-left font-medium">Published</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs">{post.id}</td>
                <td className="px-4 py-3 font-medium">{post.title}</td>
                <td className="px-4 py-3">{post.category}</td>
                <td className="px-4 py-3">{post.author}</td>
                <td className="px-4 py-3">{post.publishedAt || "Draft"}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariants[post.status] as any}>{post.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500">Showing {filtered.length} of {data.length} posts</p>
    </div>
  );
}
