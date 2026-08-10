"use client";
import { Post } from "@/features/blog/types";
import { Badge } from "@/components/ui/badge";

export function PostCard({ post }: { post: Post }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg">{post.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{post.excerpt}</p>
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="text-xs text-gray-400">{post.publishedAt || "Draft"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
