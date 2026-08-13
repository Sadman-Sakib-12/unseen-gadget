"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { ImageWithFallback } from "./image-with-fallback";

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
  const hasMultiple = images.length > 1;
  const currentIndex = Math.min(active, Math.max(0, images.length - 1));

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);

  return (
    <div>
      {/* Main image */}
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-white">
        {images.length > 0 ? (
          <ImageWithFallback
            key={currentIndex}
            src={images[currentIndex]}
            alt={alt}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            iconSize="h-16 w-16"
          />
        ) : (
          <ImageWithFallback src={undefined} alt={alt} iconSize="h-16 w-16" />
        )}

        {discount != null && discount > 0 && (
          <div className="absolute left-3 top-3 z-10">
            <span className="rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              -{discount}% OFF
            </span>
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={onToggleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border bg-white shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 ${
            wishlisted
              ? "border-pink-200 text-[#ff6b8a]"
              : "border-gray-200 text-gray-400 hover:border-pink-200 hover:text-[#ff6b8a]"
          }`}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-[#ff6b8a]" : ""}`} />
        </button>

        {/* Arrows */}
        {hasMultiple && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-600 shadow-sm transition hover:bg-white hover:text-blue-600"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-600 shadow-sm transition hover:bg-white hover:text-blue-600"
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
              className={`rounded-lg border-2 p-1.5 transition ${
                currentIndex === index
                  ? "border-blue-500"
                  : "border-gray-200 hover:border-blue-300"
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