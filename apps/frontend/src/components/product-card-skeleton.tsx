import { Skeleton } from "@unseen-gadget/ui";

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="bg-card p-3">
        <Skeleton variant="rectangular" className="aspect-square w-full rounded-lg" />
      </div>
      <div className="flex flex-col px-4 py-3">
        <Skeleton className="h-[44px] w-full" />
        <Skeleton className="mt-1.5 h-[22px] w-20" />
        <Skeleton className="mt-2 h-[14px] w-24" />
        <Skeleton className="mt-3 h-10 w-full rounded-full" />
      </div>
    </div>
  );
}
