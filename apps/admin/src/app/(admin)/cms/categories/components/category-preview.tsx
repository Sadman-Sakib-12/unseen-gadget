import { Eye } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { renderIconPreview } from "./category-icons";
import type { CategoryShowcaseItem } from "./category-item-dialog";

interface CategoryPreviewProps {
  kicker: string;
  title: string;
  items: CategoryShowcaseItem[];
  onItemClick: (item: CategoryShowcaseItem, index: number) => void;
}

export function CategoryPreview({
  kicker,
  title,
  items,
  onItemClick,
}: CategoryPreviewProps) {
  const activeItems = items.filter((item) => item.active);

  return (
    <Card className="border-primary/20 bg-slate-950 text-slate-100 overflow-hidden shadow-xl">
      <CardHeader className="border-b border-slate-800 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Live Storefront Preview
            </CardTitle>
          </div>
          <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
            {activeItems.length} Active Categories
          </span>
        </div>
      </CardHeader>
      <CardContent className="py-6">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
            {kicker || "MUST-HAVE SELECTIONS"}
          </p>
          <h3 className="mt-1 text-base font-extrabold text-white sm:text-lg">
            {title || "Browse through our top categories to find the products you'll love"}
          </h3>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10">
          {activeItems.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => onItemClick(item, idx)}
              className="group flex flex-col items-center gap-1.5 cursor-pointer"
              title="Click to edit"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-800 bg-slate-900/90 text-slate-300 shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:border-blue-500 group-hover:text-blue-400">
                {renderIconPreview(item.iconType, item.image)}
              </div>
              <span className="text-center text-[11px] font-medium leading-tight text-slate-400 group-hover:text-white">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
