import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success";
  size?: "default" | "sm";
}

const badgeVariants = {
  default: "bg-black text-white",
  secondary: "bg-surface-raised text-text-primary",
  destructive: "bg-red-500 text-white",
  outline: "border border-gray-300 bg-transparent text-text-primary",
  success: "bg-green-500 text-white",
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
