import * as React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/utils";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: React.ReactNode;
  icon?: React.ElementType;
  iconClassName?: string;
  change?: number;
  changeLabel?: string;
  footer?: React.ReactNode;
}

function StatCard({
  title,
  value,
  icon: Icon,
  iconClassName,
  change,
  changeLabel = "vs previous period",
  footer,
  className,
  ...props
}: StatCardProps) {
  const showChange = change !== undefined && change !== null;
  const positive = (change ?? 0) >= 0;

  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardContent className="p-5">
        {Icon ? (
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-current",
              iconClassName
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
        <div className="mt-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="mt-1 flex items-baseline justify-between gap-2">
            <p className="min-w-0 truncate text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              {value}
            </p>
            {showChange ? (
              <span
                className={cn(
                  "flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
                  positive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                )}
              >
                {positive ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                {Math.abs(change as number)}%
              </span>
            ) : null}
          </div>
          {showChange ? (
            <p className="mt-1 text-xs text-muted-foreground">{changeLabel}</p>
          ) : null}
          {footer ? <div className="mt-1 text-sm">{footer}</div> : null}
        </div>
      </CardContent>
    </Card>
  );
}

export { StatCard };