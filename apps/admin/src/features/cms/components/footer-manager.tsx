"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Plus,
  Save,
  Trash2,
  Building2,
  Share2,
  CreditCard,
  Layers,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import type { FooterCms, FooterLink, FooterSection, FooterShowroom, FooterSocials } from "@unseen-gadget/types";

const emptyFooterData: FooterCms = {
  showrooms: [],
  socials: {
    facebook: "",
    twitter: "",
    youtube: "",
    linkedin: "",
    instagram: "",
  },
  copyright: "",
  paymentMethods: [],
  sections: [],
};

export function FooterManager() {
  const [footer, setFooter] = useState<FooterCms | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"showrooms" | "columns" | "socials" | "bottom">("showrooms");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await apiRequest("/cms/footer", { cache: "no-store" });
        if (active) {
          if (res.data && typeof res.data === "object") {
            const footerData = res.data as Partial<FooterCms>;
            setFooter({
              sections: Array.isArray(footerData.sections) ? footerData.sections : [],
              showrooms: Array.isArray(footerData.showrooms) ? footerData.showrooms : [],
              socials: footerData.socials || emptyFooterData.socials,
              copyright: footerData.copyright || "",
              paymentMethods: Array.isArray(footerData.paymentMethods) ? footerData.paymentMethods : [],
            });
          } else {
            setFooter(emptyFooterData);
          }
        }
      } catch {
        if (active) setFooter(emptyFooterData);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleSave = async () => {
    if (!footer) return;
    setSaving(true);
    try {
      await apiRequest("/cms/footer", {
        method: "PUT",
        body: JSON.stringify({ value: footer }),
      });
      toast.success("Footer settings saved successfully! Storefront footer will update immediately.");
    } catch {
      toast.error("Failed to save footer settings");
    } finally {
      setSaving(false);
    }
  };

  // Showrooms helper
  const addShowroom = () => {
    if (!footer) return;
    const list = footer.showrooms || [];
    setFooter({
      ...footer,
      showrooms: [...list, { name: `Showroom 0${list.length + 1}`, addr: "" }],
    });
  };

  const updateShowroom = (index: number, patch: Partial<FooterShowroom>) => {
    if (!footer) return;
    const list = [...(footer.showrooms || [])];
    list[index] = { ...list[index], ...patch };
    setFooter({ ...footer, showrooms: list });
  };

  const removeShowroom = (index: number) => {
    if (!footer) return;
    setFooter({
      ...footer,
      showrooms: (footer.showrooms || []).filter((_, i) => i !== index),
    });
  };

  // Socials helper
  const updateSocial = (key: keyof FooterSocials, val: string) => {
    if (!footer) return;
    setFooter({
      ...footer,
      socials: { ...(footer.socials || {}), [key]: val },
    });
  };

  // Columns helper
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!footer) return null;

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab("showrooms")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "showrooms"
                ? "bg-white text-primary shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 className="h-4 w-4" />
            Showrooms & Branches ({footer.showrooms?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("columns")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "columns"
                ? "bg-white text-primary shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="h-4 w-4" />
            Link Columns ({footer.sections.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("socials")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "socials"
                ? "bg-white text-primary shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Share2 className="h-4 w-4" />
            Social Media
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("bottom")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "bottom"
                ? "bg-white text-primary shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CreditCard className="h-4 w-4" />
            Copyright & Payments
          </button>
        </div>

        <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Footer
        </Button>
      </div>

      {/* ── TAB 1: SHOWROOMS ── */}
      {activeTab === "showrooms" && (
        <Card className="border-border bg-white shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Showrooms & Branch Addresses</CardTitle>
                <CardDescription>
                  Addresses displayed across the top row of the storefront footer.
                </CardDescription>
              </div>
              <Button onClick={addShowroom} size="sm" variant="outline" className="flex items-center gap-1.5">
                <Plus className="h-4 w-4" />
                Add Showroom
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {(footer.showrooms || []).map((s, idx) => (
              <div key={idx} className="relative rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 max-w-sm">
                    <label className="text-xs font-semibold text-gray-700">Branch / Showroom Title</label>
                    <Input
                      value={s.name}
                      onChange={(e) => updateShowroom(idx, { name: e.target.value })}
                      placeholder="e.g. Showroom 01 (Main Branch)"
                      className="mt-1 bg-white"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => removeShowroom(idx)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700">Full Address</label>
                  <Textarea
                    value={s.addr}
                    onChange={(e) => updateShowroom(idx, { addr: e.target.value })}
                    placeholder="Shop #, Level, Market/Mall, Area, City"
                    className="mt-1 bg-white"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ── TAB 2: LINK COLUMNS ── */}
      {activeTab === "columns" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFooter({
                  ...footer,
                  sections: [
                    ...footer.sections,
                    {
                      key: `section-${Date.now()}`,
                      titleKey: "",
                      title: "New Column",
                      links: [],
                    },
                  ],
                })
              }
            >
              <Plus className="h-4 w-4 mr-1" /> Add Column
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {footer.sections.map((section, sectionIndex) => (
              <Card key={section.key || sectionIndex} className="border-border bg-white shadow-xs">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <Input
                      value={section.title}
                      onChange={(e) => updateSection(sectionIndex, { title: e.target.value })}
                      placeholder="Column Title (e.g. Help)"
                      className="font-bold text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-red-600 shrink-0"
                      onClick={() =>
                        setFooter({
                          ...footer,
                          sections: footer.sections.filter((_, i) => i !== sectionIndex),
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {section.links.map((link, linkIndex) => (
                    <div key={link.key || linkIndex} className="flex items-center gap-1.5">
                      <Input
                        className="w-28 text-xs bg-slate-50"
                        value={link.label}
                        onChange={(e) => updateLink(sectionIndex, linkIndex, { label: e.target.value })}
                        placeholder="Label"
                      />
                      <Input
                        className="flex-1 text-xs bg-slate-50"
                        value={link.href}
                        onChange={(e) => updateLink(sectionIndex, linkIndex, { href: e.target.value })}
                        placeholder="/page-url"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-gray-400 hover:text-red-600"
                        onClick={() =>
                          updateSection(sectionIndex, {
                            links: section.links.filter((_, li) => li !== linkIndex),
                          })
                        }
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs mt-2"
                    onClick={() =>
                      updateSection(sectionIndex, {
                        links: [
                          ...section.links,
                          { key: `link-${Date.now()}`, label: "New Link", href: "/about" },
                        ],
                      })
                    }
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add Link
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: SOCIAL MEDIA ── */}
      {activeTab === "socials" && (
        <Card className="border-border bg-white shadow-xs">
          <CardHeader>
            <CardTitle className="text-base">Social Media Profiles</CardTitle>
            <CardDescription>
              Links to your official social profiles shown under the footer logo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-w-xl">
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                <Facebook className="h-4 w-4 text-blue-600" /> Facebook Profile / Page URL
              </label>
              <Input
                value={footer.socials?.facebook || ""}
                onChange={(e) => updateSocial("facebook", e.target.value)}
                placeholder="https://facebook.com/unseengadget"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                <Youtube className="h-4 w-4 text-red-600" /> YouTube Channel URL
              </label>
              <Input
                value={footer.socials?.youtube || ""}
                onChange={(e) => updateSocial("youtube", e.target.value)}
                placeholder="https://youtube.com/@unseengadget"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                <Twitter className="h-4 w-4 text-sky-500" /> Twitter / X Profile URL
              </label>
              <Input
                value={footer.socials?.twitter || ""}
                onChange={(e) => updateSocial("twitter", e.target.value)}
                placeholder="https://twitter.com/unseengadget"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                <Linkedin className="h-4 w-4 text-blue-700" /> LinkedIn Company Page
              </label>
              <Input
                value={footer.socials?.linkedin || ""}
                onChange={(e) => updateSocial("linkedin", e.target.value)}
                placeholder="https://linkedin.com/company/unseengadget"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                <Instagram className="h-4 w-4 text-pink-600" /> Instagram Profile URL
              </label>
              <Input
                value={footer.socials?.instagram || ""}
                onChange={(e) => updateSocial("instagram", e.target.value)}
                placeholder="https://instagram.com/unseengadget"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── TAB 4: BOTTOM & COPYRIGHT ── */}
      {activeTab === "bottom" && (
        <Card className="border-border bg-white shadow-xs">
          <CardHeader>
            <CardTitle className="text-base">Bottom Bar, Copyright & Payments</CardTitle>
            <CardDescription>
              Customize copyright text and accepted payment badges at the bottom of the footer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 max-w-xl">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Copyright Text</label>
              <Input
                value={footer.copyright || ""}
                onChange={(e) => setFooter({ ...footer, copyright: e.target.value })}
                placeholder="All rights reserved to Unseen Gadget © 2013-2026"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Accepted Payment Methods (comma separated)</label>
              <Input
                value={(footer.paymentMethods || []).join(", ")}
                onChange={(e) =>
                  setFooter({
                    ...footer,
                    paymentMethods: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
                placeholder="VISA, MasterCard, PayPal, bKash, Nagad, Rocket"
              />
              <p className="text-[11px] text-gray-500">Badges shown on the bottom right corner of the storefront footer.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save button at bottom */}
      <div className="flex justify-end pt-4 border-t border-slate-200">
        <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Footer
        </Button>
      </div>
    </div>
  );
}