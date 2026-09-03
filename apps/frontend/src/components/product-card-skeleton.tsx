"use client";

export function ProductCardSkeleton() {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card p-3 shadow-2xs animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted/70 flex items-center justify-center">
        <div className="h-10 w-10 rounded-full bg-muted-foreground/10" />
      </div>

      {/* Content Skeleton */}
      <div className="mt-3 flex flex-1 flex-col">
        {/* Title (2 lines) */}
        <div className="h-4 w-5/6 rounded bg-muted/80" />
        <div className="mt-1.5 h-3.5 w-3/5 rounded bg-muted/60" />

        {/* Rating */}
        <div className="mt-2.5 flex items-center gap-1">
          <div className="h-3 w-16 rounded bg-muted/50" />
        </div>

        {/* Price & Cart button */}
        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <div className="h-5 w-20 rounded bg-muted/80" />
          <div className="h-8 w-8 rounded-full bg-muted/70" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({
  count = 8,
  desktopCols = 4,
}: {
  count?: number;
  desktopCols?: 4 | 5;
}) {
  const colsClass =
    desktopCols === 5
      ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4";

  return (
    <div className={`grid gap-3 ${colsClass}`}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductCarouselSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CategorySkeletonGrid({ count = 7 }: { count?: number }) {
  return (
    <div className="grid grid-cols-4 gap-x-2 gap-y-4 sm:grid-cols-7 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <div className="h-[72px] w-[72px] rounded-full border border-border bg-muted/60" />
          <div className="h-3 w-14 rounded bg-muted/60" />
        </div>
      ))}
    </div>
  );
}
