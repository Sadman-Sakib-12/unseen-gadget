"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { PostsTable } from "@/features/blog/components/posts-table";
import { PostForm } from "@/features/blog/components/post-form";
import { PostCard } from "@/features/blog/components/post-card";
import initialPosts from "@/features/blog/data/posts.json";
import { Post } from "@/features/blog/types";

export function BlogPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | undefined>(undefined);
  const [view, setView] = useState<"table" | "grid">("table");

  const handleSave = (post: Post) => {
    if (editingPost) {
      setPosts(posts.map((p) => (p.id === post.id ? post : p)));
    } else {
      setPosts([...posts, post]);
    }
    setShowForm(false);
    setEditingPost(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
          <p className="text-gray-500">Manage posts and pages</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView(view === "table" ? "grid" : "table")}
            className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
          >
            {view === "table" ? "Grid View" : "Table View"}
          </button>
          <button
            onClick={() => { setEditingPost(undefined); setShowForm(true); }}
            className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            <Plus size={16} />
            New Post
          </button>
        </div>
      </div>
      {showForm && (
        <PostForm
          post={editingPost}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingPost(undefined); }}
        />
      )}
      {view === "table" ? (
        <PostsTable data={posts} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
