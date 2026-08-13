import type { ImgHTMLAttributes } from "react";
import { cn } from "../lib/utils";

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  name?: string;
  size?: "sm" | "default" | "lg";
  fallback?: string;
}

const avatarSizes = {
  sm: "h-8 w-8 text-xs",
  default: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

const fallbackColors = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-purple-100 text-purple-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
];

function getFallbackColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return fallbackColors[Math.abs(hash) % fallbackColors.length];
}

export function Avatar({
  className,
  src,
  alt,
  name,
  size = "default",
  fallback,
  ...props
}: AvatarProps) {
  const initials = fallback || name?.slice(0, 2).toUpperCase() || "??";
  const showFallback = !src;

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        avatarSizes[size],
        className
      )}
      aria-label={name || "Avatar"}
    >
      {showFallback ? (
        <span className={cn("flex h-full w-full items-center justify-center font-medium", getFallbackColor(name || ""))}>
          {initials}
        </span>
      ) : (
        <img
          src={src}
          alt={alt || name || "Avatar"}
          className="h-full w-full object-cover"
          {...props}
        />
      )}
    </div>
  );
}
