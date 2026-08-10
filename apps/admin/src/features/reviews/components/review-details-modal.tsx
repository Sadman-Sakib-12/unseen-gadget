"use client";
import { X } from "lucide-react";
import { Star } from "lucide-react";
import { Review } from "@/features/reviews/types";

interface ReviewDetailsModalProps {
  review: Review | null;
  onClose: () => void;
}

export function ReviewDetailsModal({ review, onClose }: ReviewDetailsModalProps) {
  if (!review) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Review Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Review ID</p>
              <p className="font-mono text-sm">{review.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Product</p>
              <p className="text-sm">{review.productName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="text-sm">{review.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Rating</p>
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                <span>{review.rating} / 5</span>
              </div>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Comment</p>
              <p className="text-sm">{review.comment}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Helpful Votes</p>
              <p className="text-sm">{review.helpful}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="text-sm">{review.date}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
