"use client";
import { useState } from "react";
import { LayoutGrid, List, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PostsTable } from "./posts-table";
import { PostForm } from "./post-form";
import { PostCard } from "./post-card";
import { useCmsResource } from "@/features/cms/hooks/use-cms-resource";
import type { Post } from "@/features/blog/types";

export function BlogPage() {
  const { items: posts, loading, create, update, remove } = useCmsResource<Post>("/api/cms/posts");
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [removingPost, setRemovingPost] = useState<Post | null>(null);
  const [view, setView] = useState<"table" | "grid">("table");

  const handleSave = (post: Post) => {
    if (editingPost) {
      void update(post);
    } else {
      void create(post);
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
            <SegmentedControl
              aria-label="Posts view"
              value={view}
              onValueChange={(value) => setView(value as "table" | "grid")}
              options={[
                { value: "table", label: "Table", icon: List, iconOnly: false },
                { value: "grid", label: "Grid", icon: LayoutGrid, iconOnly: false },
              ]}
            />
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

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : view === "table" ? (
        <PostsTable
          data={posts}
          onEdit={(post) => {
            setEditingPost(post);
            setShowForm(true);
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.id} className="relative">
              <PostCard post={post} />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8 text-gray-400 hover:text-red-600"
                onClick={() => setRemovingPost(post)}
                aria-label={`Delete post ${post.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
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

      <ConfirmDialog
        open={removingPost !== null}
        onOpenChange={(open) => !open && setRemovingPost(null)}
        title="Delete post?"
        description={removingPost ? `"${removingPost.title}" will be deleted permanently.` : undefined}
        confirmLabel="Delete"
        destructive
        onConfirm={() => removingPost && void remove(removingPost.id)}
      />
    </div>
  );
}