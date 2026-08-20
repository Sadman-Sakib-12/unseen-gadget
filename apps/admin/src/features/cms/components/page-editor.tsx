"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Loader2, RefreshCw, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "sonner";
import { getPage, savePage } from "@/features/cms/data/pages";
import { BlockEditor } from "@/features/cms/components/block-editor";
import { SectionCard } from "@/features/cms/components/pages/section-card";
import { ShopEditor } from "@/features/cms/components/pages/shop-editor";
import { ContactEditor } from "@/features/cms/components/pages/contact-editor";
import { DeliveryReturnEditor } from "@/features/cms/components/pages/delivery-return-editor";
import type { CmsPage, CmsPageSlug, PageStatus } from "@unseen-gadget/cms-data";

function formatDate(value: string | null | undefined): string {
  if (!value) return "???";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function validatePage(page: CmsPage): string | null {
  if (!page.title.trim()) return "Page title is required.";
  const content = page.content;
  switch (content.type) {
    case "shop":
      if (!content.hero.heading.trim()) return "Shop hero heading is required.";
      if (!content.hero.description.trim()) return "Shop hero description is required.";
      if (!content.hero.primaryCta.label.trim() || !content.hero.primaryCta.url.trim()) {
        return "Shop hero primary CTA is required.";
      }
      break;
    case "contact":
      if (!content.hero.heading.trim()) return "Contact hero heading is required.";
      break;
    case "delivery-return":
      if (!content.hero.heading.trim()) return "Delivery hero heading is required.";
      break;
    case "terms":
    case "privacy":
      if (!content.effectiveDate) return "Effective date is required.";
      break;
  }
  return null;
}

export function PageEditor({ slug }: { slug: CmsPageSlug }) {
  const [page, setPage] = useState<CmsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState<PageStatus | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getPage(slug);
        if (active) setPage(data);
      } catch (err) {
        if (active) setLoadError(err instanceof Error ? err.message : "Failed to load page");
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