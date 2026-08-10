"use client";
import { useState } from "react";
import { Post } from "@/features/blog/types";

interface PostFormProps {
  post?: Post;
  onSave: (post: Post) => void;
  onCancel: () => void;
}

export function PostForm({ post, onSave, onCancel }: PostFormProps) {
  const [formData, setFormData] = useState({
    id: post?.id || "POST-" + String(Date.now()).slice(-3),
    title: post?.title || "",
    slug: post?.slug || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    featuredImage: post?.featuredImage || null,
    category: post?.category || "",
    tags: post?.tags || [],
    status: post?.status || "draft",
    author: post?.author || "Admin",
    publishedAt: post?.publishedAt || null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Post);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold">{post ? "Edit Post" : "Create Post"}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input type="text" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input type="text" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input type="text" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Excerpt</label>
          <textarea className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" rows={2} value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" rows={6} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} required />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
        <button type="submit" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Save Post</button>
      </div>
    </form>
  );
}
