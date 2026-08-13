import { Star } from "lucide-react";

export function StarRating({
  rating,
  reviews,
  size = "h-4 w-4",
  showValue = false,
}: {
  rating: number;
  reviews?: number;
  size?: string;
  showValue?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${size} ${
              i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
      {(showValue || (reviews ?? 0) > 0) && (
        <span className="text-[11.5px] text-gray-500">
          {showValue ? ` ${rating} ` : " "}
          {reviews != null && reviews > 0 ? `(${reviews})` : ""}
        </span>
      )}
    </div>
  );
}