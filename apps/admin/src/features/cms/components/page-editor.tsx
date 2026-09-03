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
import { PrivacyEditor } from "@/features/cms/components/pages/privacy-editor";
import { TermsEditor } from "@/features/cms/components/pages/terms-editor";
import type { CmsPage, CmsPageSlug, PageStatus } from "@unseen-gadget/types";

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function validatePage(page: CmsPage): string | null {
  if (!page.title?.trim()) return "Page title is required.";
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
  }, [slug, reloadKey]);

  const retry = () => {
    setLoading(true);
    setLoadError(null);
    setReloadKey((key) => key + 1);
  };

  const handleSave = async (status: PageStatus) => {
    if (!page) return;
    const error = validatePage(page);
    if (error) {
      toast.error(error);
      return;
    }
    setSaving(status);
    try {
      const saved = await savePage({ ...page, status, lastUpdated: new Date().toISOString() });
      setPage(saved);
      toast.success(status === "published" ? "Page published" : "Draft saved");
    } catch {
      toast.error("Failed to save page");
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-border bg-white py-20 text-gray-400">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-lg border border-border bg-white p-6">
        <EmptyState
          icon={AlertTriangle}
          title="Unable to load page"
          description={loadError}
          action={
            <Button variant="outline" onClick={retry}>
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="rounded-lg border border-border bg-white p-6">
        <EmptyState title="Page not found" description="This page does not exist in the CMS." />
      </div>
    );
  }

  const content = page.content;

  const renderContentTab = () => {
    switch (content?.type) {
      case "shop":
        return <ShopEditor content={content} onChange={(next) => setPage({ ...page, content: next })} />;
      case "contact":
        return (
          <ContactEditor
            content={{ type: "contact", ...(content as any) }}
            onChange={(next) => setPage({ ...page, content: next as any })}
          />
        );
      case "delivery-return":
        return (
          <DeliveryReturnEditor
            content={{ type: "delivery-return", ...(content as any) }}
            onChange={(next) => setPage({ ...page, content: next as any })}
          />
        );
      case "privacy":
        return (
          <PrivacyEditor
            content={{ type: "privacy", ...(content as any) }}
            onChange={(next) => setPage({ ...page, content: next as any })}
          />
        );
      case "terms":
        return (
          <TermsEditor
            content={{ type: "terms", ...(content as any) }}
            onChange={(next) => setPage({ ...page, content: next as any })}
          />
        );
      case "warranty":
      case "shipping":
      default:
        return (
          <SectionCard title="Page content" description="Edit sections and content blocks for this page.">
            <BlockEditor
              blocks={page.blocks || []}
              onChange={(blocks) => setPage({ ...page, blocks })}
            />
          </SectionCard>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-white p-4 shadow-sm">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">{page.title}</h2>
            <StatusBadge status={page.status} />
          </div>
          <p className="text-xs text-gray-500">Last updated {formatDate(page.lastUpdated)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => handleSave("draft")} disabled={saving !== null}>
            {saving === "draft" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Draft
          </Button>
          <Button onClick={() => handleSave("published")} disabled={saving !== null}>
            {saving === "published" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Publish
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="publishing">Publishing</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <div className="space-y-6">
            <SectionCard title="General" description="Page title and description.">
              <FormField label="Page title" required>
                <Input
                  value={page.title}
                  onChange={(e) => setPage({ ...page, title: e.target.value })}
                />
              </FormField>
              <FormField label="Description">
                <Textarea
                  rows={2}
                  value={page.description ?? ""}
                  onChange={(e) => setPage({ ...page, description: e.target.value })}
                />
              </FormField>
            </SectionCard>

            {renderContentTab()}
          </div>
        </TabsContent>

        <TabsContent value="seo">
          <SectionCard title="SEO" description="Search engine metadata for this page.">
            <FormField label="Meta title">
              <Input
                value={page.seo.metaTitle}
                onChange={(e) => setPage({ ...page, seo: { ...page.seo, metaTitle: e.target.value } })}
              />
            </FormField>
            <FormField label="Meta description">
              <Textarea
                rows={3}
                value={page.seo.metaDescription}
                onChange={(e) => setPage({ ...page, seo: { ...page.seo, metaDescription: e.target.value } })}
              />
            </FormField>
            <FormField label="OG image" hint="URL or path to the social sharing image.">
              <Input
                value={page.seo.ogImage}
                onChange={(e) => setPage({ ...page, seo: { ...page.seo, ogImage: e.target.value } })}
              />
            </FormField>
          </SectionCard>
        </TabsContent>

        <TabsContent value="publishing">
          <div className="space-y-6">
            <SectionCard title="Status" description="Control whether this page is live on the storefront or a draft.">
              <FormField label="Publishing status">
                <SegmentedControl
                  aria-label="Publishing status"
                  options={[
                    { value: "draft", label: "Draft" },
                    { value: "published", label: "Published" },
                  ]}
                  value={page.status}
                  onValueChange={(status) => setPage({ ...page, status: status as PageStatus })}
                />
              </FormField>
            </SectionCard>

            <SectionCard title="Publishing details">
              <dl className="space-y-2 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-gray-500">Status</dt>
                  <dd>
                    <StatusBadge status={page.status} />
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-gray-500">Last updated</dt>
                  <dd className="text-right text-gray-900">{formatDate(page.lastUpdated)}</dd>
                </div>
                {content.type === "terms" || content.type === "privacy" ? (
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-gray-500">Effective date</dt>
                    <dd className="text-gray-900">{content.effectiveDate}</dd>
                  </div>
                ) : null}
              </dl>
            </SectionCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}