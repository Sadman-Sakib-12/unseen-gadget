"use client";

import { useState } from "react";
import { Loader2, Megaphone, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCmsResource } from "@/features/cms/hooks/use-cms-resource";
import type { Promotion } from "@unseen-gadget/cms-data";

const ICON_OPTIONS = [
  { value: "zap", label: "Zap" },
  { value: "tag", label: "Tag" },
  { value: "gift", label: "Gift" },
];

const GRADIENT_OPTIONS = [
  { value: "from-primary to-primary-800", label: "Blue" },
  { value: "from-primary-700 to-primary-500", label: "Sky" },
  { value: "from-violet-700 to-violet-500", label: "Violet" },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

const emptyPromotion = (): Promotion => ({
  id: "",
  title: "",
  badge: "",
  description: "",
  ctaLabel: "Shop Now",
  ctaHref: "/products",
  icon: "zap",
  gradient: "from-primary to-primary-800",
  startDate: null,
  endDate: null,
  order: 1,
  active: true,
});

export function PromotionsManager() {
  const { items, loading, create, update, remove } = useCmsResource<Promotion>("/api/cms/promotions");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [draft, setDraft] = useState<Promotion>(emptyPromotion());
  const [removing, setRemoving] = useState<Promotion | null>(null);

  const startCreate = () => {
    setEditing(null);
    setDraft(emptyPromotion());
    setOpen(true);
  };

  const startEdit = (promo: Promotion) => {
    setEditing(promo);
    setDraft({ ...promo });
    setOpen(true);
  };

  const handleSave = async () => {
    if (editing) await update(draft);
    else await create(draft);
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={startCreate}>
          <Plus className="h-4 w-4" /> Create Promotion
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No promotions"
          description="Add your first promotional card to show on the Promotions page."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((promo) => (
            <div key={promo.id} className="rounded-lg border border-border bg-white shadow-sm">
              <div className={`relative overflow-hidden rounded-t-lg bg-gradient-to-br ${promo.gradient} px-4 py-5 text-white`}>
                <span className="inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold">
                  {promo.badge || "Promo"}
                </span>
                <h3 className="mt-3 text-base font-bold">{promo.title || "Untitled"}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-white/80">{promo.description}</p>
              </div>
              <div className="flex items-center justify-between gap-2 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">Order {promo.order}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      promo.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {promo.active ? "Active" : "Hidden"}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(promo)} aria-label={`Edit ${promo.title}`}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-red-600"
                    onClick={() => setRemoving(promo)}
                    aria-label={`Delete ${promo.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader close>
          <DialogTitle>{editing ? "Edit Promotion" : "Create Promotion"}</DialogTitle>
          <DialogDescription>
            {editing ? "Update the promotional card." : "Add a promotional card for the Promotions page."}
          </DialogDescription>
        </DialogHeader>
        <DialogContent>
          <form
            id="promotion-form"
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void handleSave();
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title">
                <Input
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  required
                />
              </Field>
              <Field label="Badge">
                <Input
                  value={draft.badge}
                  onChange={(e) => setDraft({ ...draft, badge: e.target.value })}
                  placeholder="Up to 20% OFF"
                />
              </Field>
            </div>
            <Field label="Description">
              <Textarea
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                rows={3}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Button label">
                <Input
                  value={draft.ctaLabel}
                  onChange={(e) => setDraft({ ...draft, ctaLabel: e.target.value })}
                />
              </Field>
              <Field label="Button link">
                <Input
                  value={draft.ctaHref}
                  onChange={(e) => setDraft({ ...draft, ctaHref: e.target.value })}
                  placeholder="/products"
                />
              </Field>
              <Field label="Icon">
                <Select
                  value={draft.icon}
                  onChange={(e) => setDraft({ ...draft, icon: e.target.value as Promotion["icon"] })}
                  options={ICON_OPTIONS}
                />
              </Field>
              <Field label="Gradient">
                <Select
                  value={draft.gradient}
                  onChange={(e) => setDraft({ ...draft, gradient: e.target.value })}
                  options={GRADIENT_OPTIONS}
                />
              </Field>
              <Field label="Order">
                <Input
                  type="number"
                  value={draft.order}
                  onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })}
                />
              </Field>
              <Field label="Start date">
                <Input
                  type="date"
                  value={draft.startDate ?? ""}
                  onChange={(e) => setDraft({ ...draft, startDate: e.target.value || null })}
                />
              </Field>
              <Field label="End date">
                <Input
                  type="date"
                  value={draft.endDate ?? ""}
                  onChange={(e) => setDraft({ ...draft, endDate: e.target.value || null })}
                />
              </Field>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={draft.active}
                onCheckedChange={(checked) => setDraft({ ...draft, active: checked })}
                id="promo-active"
                aria-label="Active"
              />
              <label htmlFor="promo-active" className="text-sm text-gray-700">
                Active (visible on the public Promotions page)
              </label>
            </div>
          </form>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" form="promotion-form">
            {editing ? "Update Promotion" : "Create Promotion"}
          </Button>
        </DialogFooter>
      </Dialog>

      <ConfirmDialog
        open={removing !== null}
        onOpenChange={(open) => !open && setRemoving(null)}
        title="Remove promotion?"
        description={removing ? `"${removing.title}" will be removed permanently.` : undefined}
        confirmLabel="Remove"
        destructive
        onConfirm={() => removing && void remove(removing.id)}
      />
    </div>
  );
}