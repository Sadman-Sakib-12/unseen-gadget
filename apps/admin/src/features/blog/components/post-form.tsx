"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Post } from "@/features/blog/types";

interface PostFormProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  onSave: (post: Post) => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

export function PostForm({ isOpen, onClose, post, onSave }: PostFormProps) {
  const [formData, setFormData] = useState({
    id: post?.id ?? "",
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    content: post?.content ?? "",
    excerpt: post?.excerpt ?? "",
    featuredImage: post?.featuredImage ?? null,
    category: post?.category ?? "",
    tags: post?.tags ?? [],
    status: post?.status ?? "draft",
    author: post?.author ?? "Admin",
    publishedAt: post?.publishedAt ?? null,
  });

  const update = (patch: Partial<typeof formData>) =>
    setFormData((prev) => ({ ...prev, ...patch }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const id = formData.id || `POST-${Date.now().toString().slice(-3)}`;
    onSave({ ...formData, id } as Post);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle>{post ? "Edit Post" : "Create Post"}</DialogTitle>
        <DialogDescription>
          {post
            ? `Update the details for ${post.title}.`
            : "Write and publish a new article for your customers."}
        </DialogDescription>
      </DialogHeader>
      <DialogContent>
        <form id="post-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title">
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => update({ title: e.target.value })}
                placeholder="e.g. 5 Best Smartphones of 2026"
                required
              />
            </Field>
            <Field label="Slug">
              <Input
                type="text"
                value={formData.slug}
                onChange={(e) => update({ slug: e.target.value })}
                placeholder="e.g. best-smartphones-2026"
                required
              />
            </Field>
            <Field label="Category">
              <Input
                type="text"
                value={formData.category}
                onChange={(e) => update({ category: e.target.value })}
                placeholder="e.g. Guides"
                required
              />
            </Field>
            <Field label="Status">
              <Select
                value={formData.status}
                onChange={(e) => update({ status: e.target.value })}
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Published" },
                  { value: "archived", label: "Archived" },
                ]}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Excerpt">
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => update({ excerpt: e.target.value })}
                  rows={2}
                  className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                  placeholder="Short summary shown in listings"
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Content">
                <textarea
                  value={formData.content}
                  onChange={(e) => update({ content: e.target.value })}
                  rows={6}
                  className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                  placeholder="Write the full article content..."
                  required
                />
              </Field>
            </div>
          </div>
        </form>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" form="post-form">
          {post ? "Update Post" : "Save Post"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}