"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CalendarClock, CheckCircle2, Megaphone, Plus, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PromotionsTable } from "@/features/promotions/components/promotions-table";
import { PromotionForm } from "@/features/promotions/components/promotion-form";
import { apiRequest } from "@/lib/api";
import type { Promotion } from "@/features/promotions/types";

export function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Promotion | null>(null);

  const fetchPromotions = async () => {
    try {
      const res = await apiRequest("/admin/promotions", { credentials: "include" });
      if (res.success && res.data) {
        setPromotions(res.data as Promotion[]);
      }
    } catch (e: unknown) {
      console.error("Failed to fetch promotions:", e);
      toast.error("Failed to load promotions");
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleSave = async (promo: Promotion) => {
    try {
      if (editingPromotion) {
        await apiRequest(`/admin/promotions/${promo.id}`, {
          method: "PUT",
          body: JSON.stringify(promo),
        });
        setPromotions((prev) => prev.map((p) => (p.id === promo.id ? promo : p)));
        toast.success("Promotion and storefront card updated successfully");
      } else {
        const res = await apiRequest("/admin/promotions", {
          method: "POST",
          body: JSON.stringify(promo),
        });
        const created = (res.data as Promotion) || promo;
        setPromotions((prev) => [created, ...prev]);
        toast.success("Promotion created and added to storefront successfully");
      }
      setShowForm(false);
      setEditingPromotion(undefined);
    } catch (e: any) {
      toast.error(e.message || "Failed to save promotion");
    }
  };

  const handleToggleActive = async (promo: Promotion) => {
    try {
      const nextActive = promo.active === false ? true : false;
      const updated = { ...promo, active: nextActive };
      await apiRequest(`/admin/promotions/${promo.id}`, {
        method: "PUT",
        body: JSON.stringify(updated),
      });
      setPromotions((prev) => prev.map((p) => (p.id === promo.id ? updated : p)));
      toast.success(
        `"${promo.name || promo.title}" is now ${nextActive ? "visible" : "hidden"} on the public storefront`
      );
    } catch (e: any) {
      toast.error(e.message || "Failed to update storefront visibility");
    }
  };

  const handleDelete = (promo: Promotion) => {
    setDeleteTarget(promo);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        await apiRequest(`/admin/promotions/${deleteTarget.id}`, { method: "DELETE" });
        setPromotions((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        toast.success(`Promotion "${deleteTarget.name || deleteTarget.title}" deleted successfully`);
        setDeleteTarget(null);
      } catch (e: any) {
        toast.error(e.message || "Failed to delete promotion");
      }
    }
  };

  const stats = {
    total: promotions.length,
    active: promotions.filter((p) => String(p.status).toUpperCase() === "ACTIVE").length,
    scheduled: promotions.filter((p) => String(p.status).toUpperCase() === "SCHEDULED").length,
    ended: promotions.filter((p) => String(p.status).toUpperCase() === "ENDED").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Promotions & Campaigns"
        description="Manage discount rules, sales campaigns, and customize public storefront promo cards all in one place."
        actions={
          <Button
            onClick={() => {
              setEditingPromotion(undefined);
              setShowForm(true);
            }}
            className="gap-2 bg-primary text-white"
          >
            <Plus className="h-4 w-4" />
            Create Promotion
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Total Promotions"
          value={stats.total}
          icon={Megaphone}
          iconClassName="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Active Campaigns"
          value={stats.active}
          icon={CheckCircle2}
          iconClassName="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Scheduled"
          value={stats.scheduled}
          icon={CalendarClock}
          iconClassName="bg-amber-50 text-amber-700"
        />
        <StatCard
          title="Ended"
          value={stats.ended}
          icon={XCircle}
          iconClassName="bg-red-50 text-red-700"
        />
      </div>

      {showForm && (
        <PromotionForm
          promotion={editingPromotion}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingPromotion(undefined);
          }}
        />
      )}

      <PromotionsTable
        data={promotions}
        onEdit={(promotion) => {
          setEditingPromotion(promotion);
          setShowForm(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Promotion"
        description={`Are you sure you want to delete promotion "${deleteTarget?.name || deleteTarget?.title}"? This will also remove it from the public storefront.`}
        confirmLabel="Delete Promotion"
        destructive
      />
    </div>
  );
}