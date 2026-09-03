"use client";

interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  label?: string;
  variant?: "primary" | "white" | "muted" | "current";
}

export function Spinner({
  size = "md",
  className = "",
  label,
  variant = "primary",
}: SpinnerProps) {
  const sizeMap = {
    xs: "h-3.5 w-3.5",
    sm: "h-4 w-4",
    md: "h-7 w-7",
    lg: "h-10 w-10",
    xl: "h-14 w-14",
  };

  const colorMap = {
    primary: "text-primary",
    white: "text-white",
    muted: "text-muted-foreground",
    current: "text-current",
  };

  return (
    <div className={`inline-flex flex-col items-center justify-center gap-2.5 ${className}`}>
      <svg
        className={`animate-spin ${sizeMap[size]} ${colorMap[variant]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-20"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3.5"
        />
        <path
          className="opacity-90"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {label && (
        <span className="text-xs font-medium tracking-wide text-muted-foreground animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
}
