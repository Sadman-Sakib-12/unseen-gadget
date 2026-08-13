import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function SectionHeading({
  title,
  href,
  action = "More Products",
  className = "",
}: {
  title: string;
  href?: string;
  action?: string;
  className?: string;
}) {
  return (
    <div className={`mb-3 flex items-center justify-between ${className}`}>
      <h2 className="text-[18px] font-bold text-gray-900">{title}</h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1 text-[11px] font-medium text-gray-600 transition hover:border-blue-500 hover:text-blue-600"
        >
          {action}
          <ChevronRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}