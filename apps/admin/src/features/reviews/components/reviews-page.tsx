"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, MessageSquareText, Star, TriangleAlert } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { ReviewsTable } from "./reviews-table";
import { ReviewDetailsModal } from "./review-details-modal";
import { apiRequest } from "@/lib/api";
import type { Review } from "@/features/reviews/types";

export function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await apiRequest("/admin/reviews", { credentials: "include" });
        if (res.success && res.data) {
          setReviews(res.data as Review[]);
        }
      } catch (e: unknown) {
        console.error("Failed to fetch reviews:", e);
      }
    };
    fetchReviews();
  }, []);

  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / Math.max(reviews.length, 1)
  ).toFixed(1);
  const pending = reviews.filter((r) => r.status === "pending").length;
  const approved = reviews.filter((r) => r.status === "approved").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reviews"
        description="Manage product reviews and ratings"
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Total reviews"
          value={reviews.length}
          icon={MessageSquareText}
          iconClassName="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Average rating"
          value={averageRating}
          icon={Star}
          iconClassName="bg-amber-50 text-amber-700"
        />
        <StatCard
          title="Approved"
          value={approved}
          icon={CheckCircle2}
          iconClassName="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Pending"
          value={pending}
          icon={TriangleAlert}
          iconClassName="bg-orange-50 text-orange-700"
        />
      </div>

      <ReviewsTable data={reviews} onView={setSelectedReview} />
      <ReviewDetailsModal review={selectedReview} onClose={() => setSelectedReview(null)} />
    </div>
  );
}