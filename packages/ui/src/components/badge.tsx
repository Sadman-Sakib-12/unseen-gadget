import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
  size?: "default" | "sm";
}

const badgeVariants = {
  default: "bg-gray-900 text-white",
  secondary: "bg-secondary text-secondary-foreground",
  destructive: "bg-red-500 text-white",
  outline: "border border-border bg-transparent text-foreground",
  success: "bg-success-600 text-white",
  warning: "bg-warning-600 text-white",
};

const badgeSizes = {
  default: "px-2.5 py-0.5 text-xs",
  sm: "px-2 py-px text-[10px]",
};

export function Badge({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium transition-colors",
        badgeVariants[variant],
        badgeSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
