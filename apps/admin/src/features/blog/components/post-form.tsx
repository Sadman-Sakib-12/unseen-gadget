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
import { Textarea } from "@/components/ui/textarea";
import { BlockEditor } from "@/features/cms/components/block-editor";
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
    excerpt: post?.excerpt ?? "",
    featuredImage: post?.featuredImage ?? null,
    category: post?.category ?? "",
    tags: post?.tags ?? [],
    status: post?.status ?? "draft",
    author: post?.author ?? "Admin",
    publishedAt: post?.publishedAt ?? null,
    seoTitle: post?.seoTitle ?? "",
    seoDescription: post?.seoDescription ?? "",
    blocks: post?.blocks ?? [],
  });

  const update = (patch: Partial<typeof formData>) =>
    setFormData((prev) => ({ ...prev, ...patch }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const id = formData.id || `POST-${Date.now().toString().slice(-4)}`;
    onSave({ ...formData, id } as Post);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader close>
        <DialogTitle>{post ? "Edit Post" : "Create Post"}</DialogTitle>
        <DialogDescription>
          {post
            ? `Update the details for ${post.title}.`
            : "Write and publish a new article for your customers."}
        </DialogDescription>
      </DialogHeader>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
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
                onChange={(e) => update({ status: e.target.value as Post["status"] })}
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Published" },
                  { value: "archived", label: "Archived" },
                ]}
              />
            </Field>
            <Field label="Author">
              <Input
                type="text"
                value={formData.author}
                onChange={(e) => update({ author: e.target.value })}
              />
            </Field>
            <Field label="Featured Image">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={formData.featuredImage ?? ""}
                    onChange={(e) => update({ featuredImage: e.target.value || null })}
                    placeholder="Paste image URL or upload below"
                    className="flex-1"
                  />
                  <label className="flex h-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const data = new FormData();
                        data.append("file", file);
                        try {
                          const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
                          const res = await fetch(`${API_BASE}/api/admin/upload`, {
                            method: "POST",
                            credentials: "include",
                            body: data,
                          });
                          const json = await res.json();
                          if (json.data?.url) {
                            update({ featuredImage: json.data.url });
                          }
                        } catch {}
                      }}
                    />
                    Upload
                  </label>
                </div>
                {formData.featuredImage ? (
                  <div className="relative h-28 w-44 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                    <img
                      src={formData.featuredImage}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}
              </div>
            </Field>
            <Field label="Published date">
              <Input
                type="date"
                value={formData.publishedAt ?? ""}
                onChange={(e) => update({ publishedAt: e.target.value || null })}
              />
            </Field>
            <Field label="Tags (comma separated)">
              <Input
                type="text"
                value={formData.tags.join(", ")}
                onChange={(e) =>
                  update({
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Excerpt">
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => update({ excerpt: e.target.value })}
                  rows={2}
                  placeholder="Short summary shown in listings"
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="SEO title (optional)">
                <Input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => update({ seoTitle: e.target.value })}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="SEO description (optional)">
                <Input
                  type="text"
                  value={formData.seoDescription}
                  onChange={(e) => update({ seoDescription: e.target.value })}
                />
              </Field>
            </div>
          </div>

          <div className="rounded-lg border border-border p-3">
            <p className="mb-3 text-xs font-semibold text-gray-700">Article content</p>
            <BlockEditor
              blocks={formData.blocks}
              onChange={(blocks) => update({ blocks })}
            />
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