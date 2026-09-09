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
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${size} ${
              i < Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-muted/30 text-muted-foreground/30"
            }`}
          />
        ))}
      </div>
      {(showValue || (reviews ?? 0) > 0) && (
        <span className="text-[11.5px] font-medium text-muted-foreground">
          {showValue ? `${Number(rating).toFixed(1)} ` : ""}
          {reviews != null && reviews > 0 ? `(${reviews})` : ""}
        </span>
      )}
    </div>
  );
}