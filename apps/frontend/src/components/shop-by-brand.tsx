"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, FreeMode } from "swiper/modules";
import { useTranslation } from "@/hooks/use-translation";
import { apiRequest } from "@/lib/api";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

export interface BrandItem {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
}

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

interface ShopByBrandProps {
  brands?: BrandItem[];
}

export function ShopByBrand({ brands: propBrands }: ShopByBrandProps) {
  const { t } = useTranslation();
  const [brands, setBrands] = useState<BrandItem[]>(propBrands ?? []);

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (propBrands && propBrands.length > 0) {
      setBrands(propBrands);
      return;
    }

    apiRequest("/catalog/brands")
      .then((res: any) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const activeBrands = res.data.filter((b: any) => b.active !== false);
          if (activeBrands.length > 0) {
            setBrands(activeBrands);
            return;
          }
        }
        return apiRequest("/cms/brands").then((cmsRes: any) => {
          const items = cmsRes.data?.items || (Array.isArray(cmsRes.data) ? cmsRes.data : null);
          if (Array.isArray(items) && items.length > 0) {
            setBrands(items);
          }
        });
      })
      .catch(() => {
        apiRequest("/cms/brands")
          .then((cmsRes: any) => {
            const items = cmsRes.data?.items || (Array.isArray(cmsRes.data) ? cmsRes.data : null);
            if (Array.isArray(items) && items.length > 0) {
              setBrands(items);
            }
          })
          .catch(() => {});
      });
  }, [propBrands]);

  if (brands.length === 0) {
    return null;
  }

  const displayBrands = brands;

  return (
    <section className="border-t border-border py-6">
      <div className="mx-auto w-full max-w-[1440px] px-4">
        {/* Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <h2 className="text-[18px] font-bold text-foreground">
                {t("home.section.shopByBrand")}
              </h2>
              <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                {t("home.section.shopByBrandSubtitle")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Custom Carousel Navigation Arrows */}
            <div className="flex items-center gap-1">
              <button
                ref={prevRef}
                aria-label="Previous Brands"
                className="brand-swiper-prev flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                ref={nextRef}
                aria-label="Next Brands"
                className="brand-swiper-next flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <Link
              href="/products"
              className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-[11.5px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {t("home.section.shopByBrandCta")}
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Carousel / Slider */}
        <div className="relative overflow-hidden py-1">
          <Swiper
            modules={[Navigation, Autoplay, FreeMode]}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              // @ts-ignore
              swiper.params.navigation.prevEl = prevRef.current;
              // @ts-ignore
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            freeMode={{
              enabled: true,
              sticky: false,
            }}
            loop={displayBrands.length > 8}
            spaceBetween={12}
            slidesPerView={3.2}
            breakpoints={{
              480: {
                slidesPerView: 4.2,
                spaceBetween: 12,
              },
              640: {
                slidesPerView: 5.2,
                spaceBetween: 12,
              },
              768: {
                slidesPerView: 6.2,
                spaceBetween: 14,
              },
              1024: {
                slidesPerView: 7.5,
                spaceBetween: 16,
              },
              1280: {
                slidesPerView: 8.5,
                spaceBetween: 16,
              },
              1440: {
                slidesPerView: 9.5,
                spaceBetween: 16,
              },
            }}
            className="brand-slider overflow-hidden rounded-2xl"
          >
            {displayBrands.map((brand) => {
              const hasValidLogo = !!brand.logo;

              return (
                <SwiperSlide key={brand.id || brand.slug || brand.name} className="!h-auto">
                  <Link
                    href={`/search?q=${encodeURIComponent(brand.name)}`}
                    className="group flex h-[104px] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-card/90 hover:shadow-md hover:shadow-primary/5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-border/50 bg-background/80 p-1.5 shadow-inner transition-transform duration-300 group-hover:scale-105 group-hover:border-primary/40">
                      {hasValidLogo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={brand.logo!}
                          alt={`${brand.name} logo`}
                          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                          {initialsOf(brand.name)}
                        </span>
                      )}
                    </div>
                    <span className="text-center text-[12px] font-semibold text-foreground line-clamp-1 transition-colors duration-300 group-hover:text-primary">
                      {brand.name}
                    </span>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
}