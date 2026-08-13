import { Skeleton } from "@unseen-gadget/ui";

export function ProductCardSkeleton({
  viewMode = "grid",
}: {
  viewMode?: "grid" | "list";
}) {
  if (viewMode === "list") {
    return (
      <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white">
        <Skeleton variant="rectangular" className="m-3 h-24 w-24 shrink-0 rounded-lg sm:w-32 sm:h-32" />
        <div className="flex flex-1 flex-col justify-center gap-2 px-4 py-3">
          <Skeleton className="h-2.5 w-24" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-2.5 w-16 mt-2" />
          <Skeleton className="h-8 w-28 rounded-full mt-3" />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-3">
      <Skeleton variant="rectangular" className="aspect-square w-full rounded-lg" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-2 w-16" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-10" />
      </div>
      <Skeleton className="mt-3 h-8 w-full rounded-full" />
    </div>
  );
}