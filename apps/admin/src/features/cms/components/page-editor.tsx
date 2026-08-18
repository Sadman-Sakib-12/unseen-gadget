"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { BlockEditor } from "@/features/cms/components/block-editor";
import type { CmsPage } from "@unseen-gadget/cms-data";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

export function PageEditor({ slug }: { slug: string }) {
  const [page, setPage] = useState<CmsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/cms/pages/${slug}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load page");
        const data = (await res.json()) as CmsPage;
        if (active) setPage(data);
      } catch {
        if (active) toast.error("Failed to load page");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  const handleSave = async () => {
    if (!page) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/cms/pages/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(page),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Page saved");
    } catch {
      toast.error("Failed to save page");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (!page) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-gray-50 px-4 py-10 text-center text-sm text-gray-400">
        Page not found.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 rounded-lg border border-border bg-white p-4 shadow-sm">
        <div className="grid flex-1 gap-4 sm:grid-cols-2">
          <Field label="Page title">
            <Input
              value={page.title}
              onChange={(e) => setPage({ ...page, title: e.target.value })}
            />
          </Field>
          <Field label="Description">
            <Input
              value={page.description ?? ""}
              onChange={(e) => setPage({ ...page, description: e.target.value })}
            />
          </Field>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Page
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
        <BlockEditor
          blocks={page.blocks}
          onChange={(blocks) => setPage({ ...page, blocks })}
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Page
        </Button>
      </div>
    </div>
  );
}