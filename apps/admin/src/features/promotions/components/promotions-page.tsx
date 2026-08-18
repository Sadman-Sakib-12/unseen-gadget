"use client";

import { useState } from "react";
import { CalendarClock, CheckCircle2, Megaphone, Plus, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { PromotionsTable } from "@/features/promotions/components/promotions-table";
import { PromotionForm } from "@/features/promotions/components/promotion-form";
import initialPromotions from "@/features/promotions/data/promotions.json";
import { Promotion } from "@/features/promotions/types";

export function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | undefined>(undefined);

  const handleSave = (promo: Promotion) => {
    setPromotions((prev) =>
      editingPromotion
        ? prev.map((p) => (p.id === promo.id ? promo : p))
        : [...prev, promo]
    );
    setShowForm(false);
    setEditingPromotion(undefined);
  };

  const stats = {
    total: promotions.length,
    active: promotions.filter((p) => p.status === "active").length,
    scheduled: promotions.filter((p) => p.status === "scheduled").length,
    ended: promotions.filter((p) => p.status === "ended").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Promotions"
        description="Manage sales, bundles and special offers."
        actions={
          <Button
            onClick={() => {
              setEditingPromotion(undefined);
              setShowForm(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Create Promotion
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Total promotions"
          value={stats.total}
          icon={Megaphone}
          iconClassName="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Active"
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
        }}
      />
    </div>
  );
}