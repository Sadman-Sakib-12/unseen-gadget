import { cn } from "./utils";

const badgeVariants = {
  default: "border-transparent bg-black text-white hover:bg-gray-800",
  secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
  destructive: "border-transparent bg-red-500 text-white hover:bg-red-600",
  outline: "text-gray-950 border-gray-300",
  success: "border-transparent bg-green-500 text-white hover:bg-green-600",
  warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
};

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors", badgeVariants[variant], className)} {...props} />
  );
}

export { Badge };
