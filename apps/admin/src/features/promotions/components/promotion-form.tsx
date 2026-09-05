"use client";

import { useState } from "react";
import { Zap, Tag, Gift, Sparkles, Eye, ArrowRight, Save, X, Calendar, Percent, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { Promotion } from "@/features/promotions/types";

interface PromotionFormProps {
  promotion?: Promotion;
  onSave: (promo: Promotion) => void;
  onCancel: () => void;
}

const GRADIENT_OPTIONS = [
  { value: "from-blue-900 via-indigo-900 to-black", label: "Navy Blue & Black" },
  { value: "from-primary to-primary-800", label: "Brand Deep Blue" },
  { value: "from-violet-700 to-purple-900", label: "Electric Violet" },
  { value: "from-emerald-700 to-teal-900", label: "Emerald Green" },
  { value: "from-amber-600 to-orange-900", label: "Sunset Amber" },
  { value: "from-rose-700 to-red-900", label: "Rose Crimson" },
];

const ICON_OPTIONS = [
  { value: "zap", label: "Lightning Zap" },
  { value: "tag", label: "Discount Tag" },
  { value: "gift", label: "Gift Box" },
  { value: "sparkles", label: "Magic Sparkles" },
];

export function PromotionForm({ promotion, onSave, onCancel }: PromotionFormProps) {
  const [formData, setFormData] = useState({
    id: promotion?.id || "",
    name: promotion?.name || promotion?.title || "",
    title: promotion?.title || promotion?.name || "",
    badge: promotion?.badge || "",
    description: promotion?.description || "",
    type: (promotion?.type?.toUpperCase() || "SALE") as string,
    discountType: (promotion?.discountType?.toUpperCase() || "PERCENTAGE") as string,
    discountValue: Number(promotion?.discountValue || 0),
    applicableTo: (promotion?.applicableTo?.toUpperCase() || "ALL") as string,
    startDate: promotion?.startDate ? new Date(promotion.startDate).toISOString().slice(0, 10) : "",
    endDate: promotion?.endDate ? new Date(promotion.endDate).toISOString().slice(0, 10) : "",
    status: (promotion?.status?.toUpperCase() || "ACTIVE") as string,
    ctaLabel: promotion?.ctaLabel || "Shop Now",
    ctaHref: promotion?.ctaHref || "/products",
    icon: promotion?.icon || "zap",
    gradient: promotion?.gradient || "from-blue-900 via-indigo-900 to-black",
    active: promotion?.active !== false,
    sortOrder: Number(promotion?.sortOrder || 0),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = promotion?.id || `PROMO-${String(Date.now()).slice(-4)}`;
    
    // Normalize dates to ISO string if provided
    const payload: Promotion = {
      ...formData,
      id,
      title: formData.name, // Keep title in sync with name
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
    };
    onSave(payload);
  };

  const getIconComponent = (name: string) => {
    switch (name) {
      case "tag":
        return Tag;
      case "gift":
        return Gift;
      case "sparkles":
        return Sparkles;
      default:
        return Zap;
    }
  };

  const IconComp = getIconComponent(formData.icon);

  return (
    <Card className="border-2 border-primary/20 shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 border-b pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {promotion ? "Edit Promotion & Storefront Card" : "Create New Promotion & Storefront Card"}
            </CardTitle>
            <CardDescription className="text-xs text-gray-500 mt-1">
              Configure discount rules and design the promotional card shown on the customer-facing site in one place.
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel} className="text-gray-400 hover:text-gray-700">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 7 Cols: Input Fields */}
            <div className="lg:col-span-7 space-y-6">
              {/* Section 1: Offer & Campaign Basics */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary border-b pb-1.5">
                  <Percent className="h-4 w-4" />
                  1. Offer & Discount Rules
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Promotion Title / Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Mega Summer Apple Fest"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Offer Type *
                    </label>
                    <Select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      options={[
                        { value: "SALE", label: "Special Sale" },
                        { value: "BUNDLE", label: "Bundle Deal" },
                        { value: "FREE_SHIPPING", label: "Free Shipping" },
                        { value: "BOGO", label: "Buy 1 Get 1 (BOGO)" },
                      ]}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Display Badge Text
                    </label>
                    <Input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="e.g. 20% OFF / Limited Deal"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Discount Type *
                    </label>
                    <Select
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                      options={[
                        { value: "PERCENTAGE", label: "Percentage (%)" },
                        { value: "FIXED", label: "Fixed Amount (৳)" },
                      ]}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Discount Value *
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Applicable To
                    </label>
                    <Select
                      value={formData.applicableTo}
                      onChange={(e) => setFormData({ ...formData, applicableTo: e.target.value })}
                      options={[
                        { value: "ALL", label: "All Products" },
                        { value: "CATEGORY", label: "Specific Category" },
                        { value: "PRODUCT", label: "Specific Products" },
                      ]}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Campaign Status
                    </label>
                    <Select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      options={[
                        { value: "ACTIVE", label: "Active" },
                        { value: "SCHEDULED", label: "Scheduled" },
                        { value: "ENDED", label: "Ended" },
                      ]}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Storefront Visuals */}
              <div className="space-y-4 pt-2 border-t">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary border-b pb-1.5">
                  <Eye className="h-4 w-4" />
                  2. Storefront Card Design & Action
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Card Gradient Theme
                    </label>
                    <Select
                      value={formData.gradient}
                      onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
                      options={GRADIENT_OPTIONS}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Card Icon
                    </label>
                    <Select
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      options={ICON_OPTIONS}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Button (CTA) Label
                    </label>
                    <Input
                      type="text"
                      value={formData.ctaLabel}
                      onChange={(e) => setFormData({ ...formData, ctaLabel: e.target.value })}
                      placeholder="e.g. Shop Now / Claim Offer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Target URL (CTA Link)
                    </label>
                    <Input
                      type="text"
                      value={formData.ctaHref}
                      onChange={(e) => setFormData({ ...formData, ctaHref: e.target.value })}
                      placeholder="e.g. /products or /category/audio"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">
                    Description / Offer Summary
                  </label>
                  <Textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the promotion benefits..."
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border">
                  <div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white block">
                      Active on Public Storefront
                    </span>
                    <span className="text-[11px] text-gray-500">
                      When enabled, this promo card displays immediately on the public /promotions page.
                    </span>
                  </div>
                  <Switch
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Live Storefront Card Preview */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="sticky top-6 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4 text-primary" />
                    Live Storefront Card Preview
                  </span>
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-mono">
                    Real-time
                  </span>
                </div>

                {/* Simulated Public Promo Card */}
                <div
                  className={`relative overflow-hidden rounded-2xl p-6 text-white bg-gradient-to-br ${formData.gradient} shadow-xl flex flex-col justify-between min-h-[260px] border border-white/10`}
                >
                  {/* Top Badge & Live Status */}
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-md shadow-xs">
                      <IconComp className="h-3.5 w-3.5" />
                      {formData.badge ||
                        (formData.discountValue
                          ? `${formData.discountValue}${formData.discountType === "PERCENTAGE" ? "%" : "৳"} OFF`
                          : "Special Offer")}
                    </span>

                    {formData.active ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 text-[10px] font-bold">
                        ● LIVE ON SITE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-700/40 text-zinc-400 border border-zinc-600 px-2 py-0.5 text-[10px] font-bold">
                        HIDDEN
                      </span>
                    )}
                  </div>

                  {/* Middle: Title & Description */}
                  <div className="my-5">
                    <h3 className="text-xl font-black tracking-tight leading-snug">
                      {formData.name || "Sample Promotion Title"}
                    </h3>
                    <p className="mt-2 text-xs text-white/80 line-clamp-3 leading-relaxed">
                      {formData.description ||
                        "Write a compelling description here highlighting the authentic gadgets, warranty, and special discounts."}
                    </p>
                  </div>

                  {/* Bottom: Button CTA & Target */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/20">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-zinc-900 px-4 py-2 rounded-full shadow-md">
                      {formData.ctaLabel || "Shop Now"}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>

                    <span className="text-[10px] text-white/60 font-mono">
                      {formData.ctaHref || "/products"}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-blue-50/80 p-3.5 border border-blue-200/60 text-xs text-blue-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    Two-in-One Synchronization
                  </div>
                  <p className="text-[11px] leading-relaxed text-blue-800">
                    Saving this form simultaneously schedules the promotion in the e-commerce engine and configures the public storefront card.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2 bg-primary text-white">
              <Save className="h-4 w-4" />
              {promotion ? "Save Changes" : "Create Promotion"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}