import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const buttonVariants = {
  primary: "bg-black text-white hover:bg-gray-800 active:bg-gray-900 focus-visible:ring-gray-400",
  secondary: "bg-surface-raised text-text-primary hover:bg-gray-200 active:bg-gray-300",
  outline: "border border-gray-300 bg-transparent text-text-primary hover:bg-surface-raised active:bg-gray-200 focus-visible:ring-gray-400",
  ghost: "text-text-primary hover:bg-surface-raised active:bg-gray-200",
  destructive: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus-visible:ring-red-400",
  link: "text-black underline-offset-4 hover:underline",
};

const buttonSizes = {
  default: "h-10 px-4 py-2 text-sm",
  sm: "h-8 px-3 text-xs",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

export function Button({
  className,
  variant = "primary",
  size = "default",
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-instant",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        buttonVariants[variant],
        buttonSizes[size],
        loading && "cursor-wait opacity-70",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : leftIcon ? (
        <span className="shrink-0" aria-hidden="true">{leftIcon}</span>
      ) : null}
      {children}
      {!loading && rightIcon ? (
        <span className="shrink-0" aria-hidden="true">{rightIcon}</span>
      ) : null}
    </button>
  );
}
