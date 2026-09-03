"use client";
import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatShortDate } from "@/lib/format";
import type { Post } from "@/features/blog/types";

export function PostCard({ post }: { post: Post }) {
  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      {post.featuredImage ? (
        <div className="h-40 w-full overflow-hidden rounded-t-xl bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.featuredImage}
            alt={post.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      ) : null}
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg">{post.title}</CardTitle>
          <StatusBadge status={post.status} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <p className="text-sm text-gray-500">{post.excerpt}</p>
        <div className="mt-auto flex items-center gap-2 pt-2">
          <Badge variant="secondary">{post.category}</Badge>
          <span className="ml-auto inline-flex items-center gap-1 text-xs text-gray-400">
            <CalendarDays className="h-3.5 w-3.5" />
            {post.publishedAt ? formatShortDate(post.publishedAt) : "Draft"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}