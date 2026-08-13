"use client";
import { useState } from "react";
import { LayoutGrid, List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/components/ui/utils";
import { PostsTable } from "./posts-table";
import { PostForm } from "./post-form";
import { PostCard } from "./post-card";
import initialPosts from "@/features/blog/data/posts.json";
import type { Post } from "@/features/blog/types";

export function BlogPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [view, setView] = useState<"table" | "grid">("table");

  const handleSave = (post: Post) => {
    if (editingPost) {
      setPosts(posts.map((p) => (p.id === post.id ? post : p)));
    } else {
      setPosts([...posts, post]);
    }
    setShowForm(false);
    setEditingPost(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog"
        description="Manage posts and pages"
        actions={
          <>
            <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setView("table")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  view === "table" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                type="button"
                onClick={() => setView("grid")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  view === "grid" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>
            <Button
              onClick={() => {
                setEditingPost(null);
                setShowForm(true);
              }}
            >
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </>
        }
      />

      {view === "table" ? (
        <PostsTable data={posts} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <PostForm
        key={editingPost ? editingPost.id : "new-post"}
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingPost(null);
        }}
        post={editingPost}
        onSave={handleSave}
      />
    </div>
  );
}