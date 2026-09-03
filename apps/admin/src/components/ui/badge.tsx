import { cn } from "./utils";

const badgeVariants = {
  default: "border-transparent bg-primary text-primary-foreground",
  secondary: "border-slate-200/80 bg-slate-100/80 text-slate-700",
  destructive: "border-red-200/60 bg-red-50 text-red-700",
  outline: "text-slate-700 border-slate-300",
  success: "border-emerald-200/60 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200/60 bg-amber-50 text-amber-700",
  info: "border-blue-200/60 bg-blue-50 text-blue-700",
  purple: "border-purple-200/60 bg-purple-50 text-purple-700",
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