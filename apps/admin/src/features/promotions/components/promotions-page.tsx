"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { PromotionsTable } from "@/features/promotions/components/promotions-table";
import { PromotionForm } from "@/features/promotions/components/promotion-form";
import initialPromotions from "@/features/promotions/data/promotions.json";
import { Promotion } from "@/features/promotions/types";

export function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | undefined>(undefined);

  const handleSave = (promo: Promotion) => {
    if (editingPromotion) {
      setPromotions(promotions.map((p) => (p.id === promo.id ? promo : p)));
    } else {
      setPromotions([...promotions, promo]);
    }
    setShowForm(false);
    setEditingPromotion(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Promotions</h1>
          <p className="text-gray-500">Manage sales, bundles and special offers</p>
        </div>
        <button
          onClick={() => { setEditingPromotion(undefined); setShowForm(true); }}
          className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Plus size={16} />
          Create Promotion
        </button>
      </div>
      {showForm && (
        <PromotionForm
          promotion={editingPromotion}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingPromotion(undefined); }}
        />
      )}
      <PromotionsTable data={promotions} />
    </div>
  );
}
