import { cn } from "./utils";

const badgeVariants = {
  default: "border-transparent bg-primary text-primary-foreground",
  secondary: "border-transparent bg-gray-100 text-gray-700",
  destructive: "border-transparent bg-red-50 text-red-700",
  outline: "text-gray-700 border-gray-300",
  success: "border-transparent bg-emerald-50 text-emerald-700",
  warning: "border-transparent bg-amber-50 text-amber-700",
};

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };