"use client";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Review } from "@/features/reviews/types";

interface ReviewDetailsModalProps {
  review: Review | null;
  onClose: () => void;
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-right text-sm font-medium text-gray-900">{value}</dd>
    </div>
  );
}

export function ReviewDetailsModal({ review, onClose }: ReviewDetailsModalProps) {
  return (
    <Dialog open={review !== null} onOpenChange={onClose}>
      {review ? (
        <>
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>
              {review.productName} by {review.customerName}
            </DialogDescription>
          </DialogHeader>
          <DialogContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-lg font-semibold text-gray-900">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  {review.rating} / 5
                </div>
                <StatusBadge status={review.status} />
              </div>

              <dl className="divide-y divide-gray-100 border-t border-gray-100">
                <Row label="Review ID" value={review.id} />
                <Row label="Product" value={review.productName} />
                <Row label="Customer" value={review.customerName} />
                <Row label="Rating" value={`${review.rating} / 5`} />
                <Row label="Helpful votes" value={review.helpful} />
                <Row label="Date" value={review.date} />
              </dl>

              <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Comment
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{review.comment}</p>
              </div>
            </div>
          </DialogContent>
        </>
      ) : null}
    </Dialog>
  );
}