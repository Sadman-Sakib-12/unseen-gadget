"use client";

import { useState } from "react";
import { cn } from "@/components/ui/utils";

function initialsOf(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "BR"
  );
}

interface BrandLogoProps {
  name: string;
  logo?: string | null;
  className?: string;
}

function BrandLogo({ name, logo, className }: BrandLogoProps) {
  const [failed, setFailed] = useState(false);
  const showImage = !!logo && !failed;

  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50",
        className
      )}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo as string}
          alt={`${name} logo`}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-xs font-semibold text-gray-500">{initialsOf(name)}</span>
      )}
    </div>
  );
}

export { BrandLogo };