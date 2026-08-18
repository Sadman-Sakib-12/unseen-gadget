"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { ImageWithFallback } from "./image-with-fallback";
import { useTranslation } from "@/hooks/use-translation";

export function ProductGallery({
  images,
  alt,
  discount,
  wishlisted,
  onToggleWishlist,
}: {
  images: string[];
  alt: string;
  discount?: number;
  wishlisted: boolean;
  onToggleWishlist: () => void;
}) {
  const [active, setActive] = useState(0);
  const { t } = useTranslation();
  const hasMultiple = images.length > 1;
  const currentIndex = Math.min(active, Math.max(0, images.length - 1));

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);

  return (
    <div>
      {/* Main image */}
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-border bg-card">
        {images.length > 0 ? (
          <ImageWithFallback
            key={currentIndex}
            src={images[currentIndex]}
            alt={alt}
            label={alt}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            iconSize="h-16 w-16"
          />
        ) : (
          <ImageWithFallback src={undefined} alt={alt} label={alt} iconSize="h-16 w-16" />
        )}

        {discount != null && discount > 0 && (
          <div className="absolute left-3 top-3 z-10">
            <span className="rounded-full bg-error px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              -{discount}% {t("pdp.discountOff")}
            </span>
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={onToggleWishlist}
          aria-label={wishlisted ? t("product.wishlist.removed") : t("product.wishlist.added")}
          className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border bg-card shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ${
            wishlisted
              ? "border-primary/40 text-primary"
              : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
          }`}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-primary" : ""}`} />
        </button>

        {/* Arrows */}
        {hasMultiple && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-sm transition-colors hover:bg-card hover:text-primary"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-sm transition-colors hover:bg-card hover:text-primary"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultiple && (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1}`}
              className={`rounded-lg border-2 p-1.5 transition-colors ${
                currentIndex === index
                  ? "border-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex h-16 items-center justify-center">
                <ImageWithFallback
                  src={img}
                  alt=""
                  className="h-full w-full object-contain"
                  iconSize="h-6 w-6"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
