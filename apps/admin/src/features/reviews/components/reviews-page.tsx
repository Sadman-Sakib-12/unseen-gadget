"use client";
import { useState } from "react";
import { ReviewsTable } from "@/features/reviews/components/reviews-table";
import { ReviewDetailsModal } from "@/features/reviews/components/review-details-modal";
import initialReviews from "@/features/reviews/data/reviews.json";
import { Review } from "@/features/reviews/types";

export function ReviewsPage() {
  const [reviews] = useState<Review[]>(initialReviews);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
        <p className="text-gray-500">Manage product reviews and ratings</p>
      </div>
      <ReviewsTable data={reviews} />
      <ReviewDetailsModal review={selectedReview} onClose={() => setSelectedReview(null)} />
    </div>
  );
}
