"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { FooterCms, FooterLink, FooterSection } from "@unseen-gadget/cms-data";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

export function FooterManager() {
  const [footer, setFooter] = useState<FooterCms | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/cms/footer", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load footer");
        const data = (await res.json()) as FooterCms;
        if (active) setFooter(data);
      } catch {
        if (active) toast.error("Failed to load footer");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const updateSection = (index: number, patch: Partial<FooterSection>) => {
    if (!footer) return;
    setFooter({
      ...footer,
      sections: footer.sections.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    });
  };

  const updateLink = (sectionIndex: number, linkIndex: number, patch: Partial<FooterLink>) => {
    if (!footer) return;
    const sections = footer.sections.map((s, i) => {
      if (i !== sectionIndex) return s;
      return {
        ...s,
        links: s.links.map((l, li) => (li === linkIndex ? { ...l, ...patch } : l)),
      };
    });
    setFooter({ ...footer, sections });
  };

  const handleSave = async () => {
    if (!footer) return;
    setSaving(true);
    try {
      const res = await fetch("/api/cms/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(footer),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Footer saved");
    } catch {
      toast.error("Failed to save footer");
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

  if (!footer) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-gray-50 px-4 py-10 text-center text-sm text-gray-400">
        Footer data not found.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Footer
        </Button>
      </div>

      {footer.sections.map((section, sectionIndex) => (
        <div key={section.key} className="rounded-lg border border-border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-gray-800">{section.title || section.key}</p>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-red-600"
              onClick={() =>
                setFooter({
                  ...footer,
                  sections: footer.sections.filter((_, i) => i !== sectionIndex),
                })
              }
              aria-label="Remove section"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field label="Translation key (heading)">
              <Input
                value={section.titleKey}
                onChange={(e) => updateSection(sectionIndex, { titleKey: e.target.value })}
                placeholder="footer.help"
              />
            </Field>
            <Field label="Fallback title">
              <Input
                value={section.title}
                onChange={(e) => updateSection(sectionIndex, { title: e.target.value })}
                placeholder="Help"
              />
            </Field>
          </div>

          <div className="mt-4 space-y-2">
            {section.links.map((link, linkIndex) => (
              <div key={link.key} className="flex items-center gap-2">
                <Input
                  className="w-32"
                  value={link.label}
                  onChange={(e) => updateLink(sectionIndex, linkIndex, { label: e.target.value })}
                  placeholder="Label"
                />
                <Input
                  value={link.href}
                  onChange={(e) => updateLink(sectionIndex, linkIndex, { href: e.target.value })}
                  placeholder="/terms"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0 text-gray-400 hover:text-red-600"
                  onClick={() =>
                    updateSection(sectionIndex, {
                      links: section.links.filter((_, li) => li !== linkIndex),
                    })
                  }
                  aria-label="Remove link"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                updateSection(sectionIndex, {
                  links: [
                    ...section.links,
                    { key: `link-${Date.now()}`, label: "", href: "" },
                  ],
                })
              }
            >
              <Plus className="h-3.5 w-3.5" /> Add link
            </Button>
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        onClick={() =>
          setFooter({
            ...footer,
            sections: [
              ...footer.sections,
              {
                key: `section-${Date.now()}`,
                titleKey: "",
                title: "",
                links: [],
              },
            ],
          })
        }
      >
        <Plus className="h-4 w-4" /> Add section
      </Button>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Footer
        </Button>
      </div>
    </div>
  );
}