import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
}

const cardVariants = {
  default: "bg-card border border-border shadow-sm",
  outlined: "bg-transparent border-2 border-gray-300",
  elevated: "bg-card shadow-md",
};

const cardPadding = {
  none: "p-0",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export function Card({
  className,
  variant = "default",
  padding = "md",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden",
        cardVariants[variant],
        cardPadding[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function CardHeader({
  className,
  title,
  description,
  action,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn("flex flex-col gap-1 pb-4", className)}
      {...props}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          {title && (
            <h3 className="text-sm font-semibold text-card-foreground">{title}</h3>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between pt-4 border-t border-border",
        className
      )}
      {...props}
    />
  );
}
