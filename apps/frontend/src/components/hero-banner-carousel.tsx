"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export interface BannerItem {
  id: number | string;
  title?: string;
  subtitle?: string;
  cta?: string;
  href?: string;
  image?: string;
  bgColor?: string;
  placement?: "slider" | "side";
  status?: string;
}

interface HeroBannerCarouselProps {
  banners: BannerItem[];
}

export function HeroBannerCarousel({ banners }: HeroBannerCarouselProps) {
  const activeBanners = (banners || []).filter(
    (b) => !b.status || b.status.toLowerCase() === "active"
  );

  if (activeBanners.length === 0) {
    return null;
  }

  // Separate Slider Banners and Side Banners
  const sliderBanners = activeBanners.filter((b) => b.placement === "slider" || !b.placement);
  const sideBanners = activeBanners.filter((b) => b.placement === "side").slice(0, 2);

  const mainBanners = sliderBanners.length > 0 ? sliderBanners : activeBanners;
  const hasSideBanners = sideBanners.length > 0;

  return (
    <div className="grid gap-2.5 sm:gap-3 lg:grid-cols-3">
      {/* ═══ Left: Main Hero Slider (2 Columns on Desktop) ═══ */}
      <div
        className={`relative group overflow-hidden rounded-xl sm:rounded-2xl bg-slate-900 ${
          hasSideBanners ? "lg:col-span-2" : "lg:col-span-3"
        } h-[200px] xs:h-[230px] sm:h-[300px] md:h-[360px] lg:h-[440px]`}
      >
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation={{
            prevEl: ".hero-prev-btn",
            nextEl: ".hero-next-btn",
          }}
          pagination={{
            clickable: true,
            bulletActiveClass: "!w-6 !bg-primary opacity-100",
            bulletClass:
              "inline-block h-2 w-2 rounded-full bg-white/70 backdrop-blur-sm transition-all duration-300 cursor-pointer mx-1",
          }}
          autoplay={
            mainBanners.length > 1
              ? {
                  delay: 4500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          loop={mainBanners.length > 1}
          className="h-full w-full"
        >
          {mainBanners.map((banner, index) => {
            const hasImage = Boolean(banner.image);
            const hasContent = Boolean(banner.title || banner.subtitle || banner.cta);

            return (
              <SwiperSlide key={banner.id || index} className="!h-full w-full">
                <Link
                  href={banner.href || "#"}
                  aria-label={banner.title || banner.cta || "Featured Promotion Banner"}
                  className="group/slide relative block h-full w-full overflow-hidden bg-gradient-to-br from-[#182C61] via-slate-900 to-[#0d1738]"
                >
                  {/* Banner Image */}
                  {hasImage ? (
                    <Image
                      src={banner.image!}
                      alt={banner.title || "Hero Banner"}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover transition duration-500 group-hover/slide:scale-[1.02]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-muted" />
                  )}

                  {/* Title, Subtitle, and CTA Button from Admin */}
                  {hasContent && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent sm:bg-gradient-to-r sm:from-black/80 sm:via-black/40 sm:to-transparent flex flex-col justify-end sm:justify-center p-4 sm:p-8 md:p-10 z-10 max-w-xl">
                      {banner.title && (
                        <h2 className="text-lg xs:text-xl sm:text-3xl md:text-4xl font-black leading-tight text-white drop-shadow-lg">
                          {banner.title}
                        </h2>
                      )}

                      {banner.subtitle && (
                        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-200 drop-shadow line-clamp-2 max-w-lg">
                          {banner.subtitle}
                        </p>
                      )}

                      {banner.cta && (
                        <div className="mt-3 sm:mt-4 self-start">
                          <span className="inline-flex items-center gap-1.5 rounded-lg sm:rounded-xl bg-primary px-3.5 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-lg transition duration-300 group-hover/slide:bg-primary-700 hover:scale-105">
                            {banner.cta} <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </Link>
              </SwiperSlide>
            );
          })}

          {/* Slider Prev & Next Arrow Buttons */}
          {mainBanners.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous Slide"
                className="hero-prev-btn absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md border border-white/20 opacity-80 group-hover:opacity-100 hover:bg-primary transition-all duration-200 shadow-md cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                type="button"
                aria-label="Next Slide"
                className="hero-next-btn absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md border border-white/20 opacity-80 group-hover:opacity-100 hover:bg-primary transition-all duration-200 shadow-md cursor-pointer"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </>
          )}
        </Swiper>
      </div>

      {/* ═══ Right: 2 Side Promo Banners (1 Column on Desktop, 2 Columns on Mobile/Tablet) ═══ */}
      {hasSideBanners && (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:flex lg:flex-col lg:h-[440px]">
          {sideBanners.map((b, idx) => {
            const hasImg = Boolean(b.image);
            const hasContent = Boolean(b.title || b.subtitle || b.cta);

            return (
              <Link
                key={b.id || idx}
                href={b.href || "#"}
                aria-label={b.title || b.cta || "Side Promo Banner"}
                className="group/side relative block overflow-hidden rounded-xl sm:rounded-2xl bg-muted h-[115px] xs:h-[135px] sm:h-[160px] md:h-[180px] lg:h-[214px] lg:flex-1"
              >
                {/* Banner Image */}
                {hasImg ? (
                  <Image
                    src={b.image!}
                    alt={b.title || "Side banner"}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover/side:scale-[1.02]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-card to-muted/80" />
                )}

                {/* Title, Subtitle, and CTA Button from Admin */}
                {hasContent && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-3 sm:p-5 z-10">
                    {b.title && (
                      <p className="text-xs sm:text-base font-bold text-white drop-shadow leading-tight line-clamp-1">
                        {b.title}
                      </p>
                    )}
                    {b.subtitle && (
                      <p className="mt-0.5 text-[10px] sm:text-xs text-gray-200 drop-shadow line-clamp-1">
                        {b.subtitle}
                      </p>
                    )}
                    {b.cta && (
                      <span className="mt-1 sm:mt-2 inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-white group-hover/side:underline">
                        {b.cta} <ChevronRight className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
