"use client";

import { Package } from "lucide-react";
import { useState } from "react";

export function ImageWithFallback({
  src,
  alt,
  className,
  iconSize = "h-12 w-12",
}: {
  src?: string;
  alt: string;
  className?: string;
  iconSize?: string;
}) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-50">
        <Package className={`${iconSize} text-gray-300`} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}