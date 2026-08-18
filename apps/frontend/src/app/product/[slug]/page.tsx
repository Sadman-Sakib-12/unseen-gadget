"use client";

import { use, useMemo, useState } from "react";
import products from "@/data/products.json";
import { notFound, useRouter } from "next/navigation";
import {
  ChevronRight,
  Heart,
  Share2,
  ShoppingCart,
  CheckCircle,
  Package,
  Phone,
  Minus,
  Plus,
  Zap,
  Clock,
  MapPin,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { MockProduct } from "@/components/product-types";
import { formatBDT, savingsAmount } from "@/components/price";
import { StarRating } from "@/components/star-rating";
import { colorHex } from "@/components/color-swatches";
import { SectionHeading } from "@/components/section-heading";
import { ProductGrid } from "@/components/product-grid";
import { ProductGallery } from "@/components/product-gallery";
import { useCartStore } from "@/features/cart-store";
import { useWishlistStore } from "@/features/wishlist-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { useTranslation } from "@/hooks/use-translation";

const allProducts = products as MockProduct[];

function categoryHref(category: string): string {
  return `/category/${category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`;
}

/* ── Breadcrumb ─────────────────────────────────────────── */
function Breadcrumb({ product }: { product: MockProduct }) {
  const { t } = useTranslation();
  return (
    <div className="border-b border-border">
      <div className="container-gadget">
        <nav className="flex flex-wrap items-center gap-1.5 py-3 text-[12px] text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-primary">{t("shop.breadcrumbHome")}</Link>
          <ChevronRight className="h-3 w-3 opacity-50" />
          <Link href={categoryHref(product.category)} className="transition-colors hover:text-primary">
            {product.category}
          </Link>
          <ChevronRight className="h-3 w-3 opacity-50" />
          <span className="font-medium text-foreground">{product.name}</span>
        </nav>
      </div>
    </div>
  );
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const product = allProducts.find((p) => p.slug === resolvedParams.slug);

  if (!product) notFound();

  return <ProductDetails key={product.slug} product={product} />;
}

function ProductDetails({ product }: { product: MockProduct }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors?.[0] ?? null
  );
  const [activeTab, setActiveTab] = useState<string>("description");
  const addItem = useCartStore((s) => s.addItem);
  const wishlistIds = useWishlistStore((s) => s.ids);
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  const wishlisted = hydrated && wishlistIds.includes(product.id);

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 5);

  const savings = savingsAmount(product);
  const images = useMemo(() => {
    if (product.images && product.images.length > 0) return product.images;
    return product.image ? [product.image] : [];
  }, [product]);
  const outOfStock = product.inStock === false;

  const tabs: { id: string; label: string }[] = [
    ...(product.description ? [{ id: "description", label: t("pdp.tab.description") }] : []),
    ...(product.features?.length ? [{ id: "features", label: t("pdp.tab.features") }] : []),
    ...(product.specifications ? [{ id: "specifications", label: t("pdp.tab.specifications") }] : []),
    ...(product.warranty?.length ? [{ id: "warranty", label: t("pdp.tab.warranty") }] : []),
    ...(product.deliveryInfo ? [{ id: "delivery", label: t("pdp.tab.delivery") }] : []),
    { id: "reviews", label: t("pdp.tab.reviews") },
  ];

  const handleAddToCart = () => {
    if (outOfStock) return;
    addItem(product, quantity, selectedColor ?? product.colors?.[0]);
    toast.success(`${product.name} ${t("product.addedToCart")}`);
  };

  const handleBuyNow = () => {
    if (outOfStock) return;
    addItem(product, quantity, selectedColor ?? product.colors?.[0]);
    router.push("/cart");
  };

  const reviewsCount = product.reviews ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumb product={product} />

      {/* ══ MAIN PRODUCT SECTION ═══════════════════════════════ */}
      <div className="container-gadget">
        <div className="grid grid-cols-1 gap-4 py-5 lg:grid-cols-2">
          {/* ── Left: Image Gallery ─────────────────────────── */}
          <div className="card-surface lg:sticky lg:top-[104px] lg:self-start p-4 sm:p-5">
            <ProductGallery
              images={images}
              alt={product.name}
              discount={product.discount}
              wishlisted={wishlisted}
              onToggleWishlist={() => {
                toggleWishlist(product.id);
                toast.success(wishlisted ? t("product.wishlist.removed") : t("product.wishlist.added"));
              }}
            />
          </div>

          {/* ── Right: Product Info ─────────────────────────── */}
          <div className="card-surface p-4 sm:p-5">
            <h1 className="text-[22px] font-bold leading-tight text-foreground">
              {product.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-[12.5px] text-muted-foreground">
              <span>
                {t("common.brand")}: <strong className="text-foreground">{product.brand ?? product.category}</strong>
              </span>
              <span>SKU: UG-{product.id.toString().padStart(4, "0")}</span>
            </div>

            {/* Rating + reviews */}
            <div className="mt-3 flex items-center gap-3">
              <StarRating rating={product.rating ?? 0} showValue />
              <span className="text-[12.5px] text-muted-foreground">
                {reviewsCount} {t("pdp.reviews")}
              </span>
              <span className="cursor-pointer text-[12.5px] text-primary transition-colors hover:underline">
                {t("pdp.writeReview")}
              </span>
            </div>

            {/* Price */}
            <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-[24px] font-bold text-foreground">
                  {formatBDT(product.price)}
                </span>
                {product.originalPrice != null && product.originalPrice > product.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatBDT(product.originalPrice)}
                  </span>
                )}
                {product.discount != null && product.discount > 0 && (
                  <span className="rounded-full bg-error px-2 py-0.5 text-[11px] font-bold text-white">
                    -{product.discount}% {t("pdp.discountOff")}
                  </span>
                )}
              </div>
              {savings > 0 && (
                <p className="mt-1.5 text-[12.5px] font-medium text-success">
                  {t("common.youSave")}: {formatBDT(savings)}
                </p>
              )}
              <p className="mt-0.5 text-[11.5px] text-muted-foreground">{t("common.negotiable")}</p>
            </div>

            {/* Stock status */}
            <div className="mt-4 flex items-center gap-2 text-[13px]">
              <span className="text-muted-foreground">{t("common.availability")}:</span>
              {outOfStock ? (
                <span className="font-semibold text-error">{t("pdp.outOfStock")}</span>
              ) : (
                <span className="font-semibold text-success">{t("pdp.inStock")}</span>
              )}
            </div>

            {/* Color variants */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-4">
                <span className="mb-2 block text-[13px] font-medium text-foreground">
                  {t("common.color")}: <span className="text-foreground">{selectedColor}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => {
                    const active = selectedColor === color;
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                          active
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border bg-card text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        <span
                          className="h-3.5 w-3.5 rounded-full border border-border"
                          style={{ backgroundColor: colorHex(color) }}
                        />
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-5 flex items-center gap-4">
              <span className="text-[13px] font-medium text-foreground">{t("common.quantity")}:</span>
              <div className="flex items-center rounded-full border border-border bg-card">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-[14px] font-bold text-foreground">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 space-y-3">
              <button
                disabled={outOfStock}
                onClick={handleAddToCart}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-[14px] font-bold text-primary-foreground transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart className="h-5 w-5" />
                {t("pdp.addToCart")}
              </button>
              <button
                disabled={outOfStock}
                onClick={handleBuyNow}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-primary bg-card py-3 text-[14px] font-bold text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Zap className="h-5 w-5" />
                {t("pdp.buyNow")}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    toggleWishlist(product.id);
                    toast.success(wishlisted ? t("product.wishlist.removed") : t("product.wishlist.added"));
                  }}
                  className={`flex items-center justify-center gap-2 rounded-full border py-2.5 text-[12.5px] font-medium transition-colors ${
                    wishlisted
                      ? "border-error bg-error text-white"
                      : "border-border bg-card text-muted-foreground hover:border-error/60 hover:text-error"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${wishlisted ? "fill-white" : ""}`} />
                  {wishlisted ? t("pdp.wishlisted") : t("pdp.wishlist")}
                </button>
                <button className="flex items-center justify-center gap-2 rounded-full border border-border bg-card py-2.5 text-[12.5px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                  <Share2 className="h-4 w-4" />
                  {t("pdp.share")}
                </button>
              </div>
            </div>

            {/* Quick order by phone */}
            <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="text-center">
                <p className="mb-2 text-[13px] font-semibold text-primary">
                  {t("pdp.quickOrder")}
                </p>
                <a
                  href="tel:+8801714039409"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-[12.5px] font-bold text-primary-foreground transition-colors hover:bg-primary-700"
                >
                  <Phone className="h-4 w-4" />
                  {t("pdp.call")}: +880 1714-039409
                </a>
              </div>
            </div>

            {/* Service info */}
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl border border-border bg-muted/40 p-3">
                <Truck className="mx-auto mb-1 h-5 w-5 text-primary" />
                <div className="text-[12px] font-semibold text-foreground">{t("pdp.freeDelivery")}</div>
                <div className="text-[11px] text-muted-foreground">{t("pdp.insideDhaka")}</div>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-3">
                <Shield className="mx-auto mb-1 h-5 w-5 text-success" />
                <div className="text-[12px] font-semibold text-foreground">1 Year</div>
                <div className="text-[11px] text-muted-foreground">{t("pdp.warranty")}</div>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-3">
                <RefreshCw className="mx-auto mb-1 h-5 w-5 text-warning" />
                <div className="text-[12px] font-semibold text-foreground">7 Days</div>
                <div className="text-[11px] text-muted-foreground">{t("pdp.returnDays")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ TABS ═══════════════════════════════════════════════ */}
      <div className="container-gadget">
        <div className="card-surface">
          {/* Tab headers */}
          <div className="overflow-x-auto border-b border-border">
            <div className="flex gap-x-7 gap-y-2 px-5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap border-b-2 py-3.5 text-[13px] font-semibold transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="min-h-[200px] p-5">
            {activeTab === "description" && product.description && (
              <p className="max-w-3xl text-[13.5px] leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}

            {activeTab === "features" && product.features && (
              <ul className="grid max-w-3xl gap-3 sm:grid-cols-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-[13.5px] text-foreground">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "specifications" && product.specifications && (
              <div className="max-w-3xl overflow-hidden rounded-lg border border-border">
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value], index) => (
                      <tr key={key} className={index % 2 === 0 ? "bg-muted/40" : "bg-card"}>
                        <td className="w-[38%] border-r border-border px-4 py-3 text-[13px] font-semibold text-foreground">
                          {key}
                        </td>
                        <td className="px-4 py-3 text-[13px] text-foreground">{String(value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "warranty" && product.warranty && (
              <div className="max-w-3xl rounded-xl border border-success/30 bg-success/5 p-5">
                <h3 className="mb-3 text-[15px] font-bold text-success">
                  {t("pdp.tab.warranty")}
                </h3>
                <ul className="space-y-2.5">
                  {product.warranty.map((point, index) => (
                    <li key={index} className="flex items-start gap-2 text-[13.5px] text-foreground">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "delivery" && product.deliveryInfo && (
              <div className="grid max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {product.deliveryInfo.insideDhaka && (
                  <div className="rounded-xl border border-border bg-card p-4">
                    <MapPin className="mb-2 h-5 w-5 text-primary" />
                    <div className="text-[13px] font-semibold text-foreground">{t("pdp.insideDhaka")}</div>
                    <div className="mt-0.5 text-[12.5px] text-muted-foreground">
                      {product.deliveryInfo.insideDhaka}
                    </div>
                  </div>
                )}
                {product.deliveryInfo.outsideDhaka && (
                  <div className="rounded-xl border border-border bg-card p-4">
                    <Truck className="mb-2 h-5 w-5 text-success" />
                    <div className="text-[13px] font-semibold text-foreground">{t("pdp.outsideDhaka")}</div>
                    <div className="mt-0.5 text-[12.5px] text-muted-foreground">
                      {product.deliveryInfo.outsideDhaka}
                    </div>
                  </div>
                )}
                {product.deliveryInfo.shippingCost && (
                  <div className="rounded-xl border border-border bg-card p-4">
                    <Clock className="mb-2 h-5 w-5 text-warning" />
                    <div className="text-[13px] font-semibold text-foreground">{t("pdp.shippingCost")}</div>
                    <div className="mt-0.5 text-[12.5px] text-muted-foreground">
                      {product.deliveryInfo.shippingCost}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-[32px] font-bold leading-none text-foreground">
                      {product.rating ?? 0}
                    </div>
                    <div className="mt-1.5">
                      <StarRating rating={product.rating ?? 0} />
                    </div>
                    <div className="mt-1 text-[12px] text-muted-foreground">
                      {reviewsCount} {t("pdp.reviews")}
                    </div>
                  </div>
                  <p className="text-[13px] text-muted-foreground">
                    {t("pdp.reviewsSummary", { count: reviewsCount })}
                  </p>
                </div>
                <div className="mt-6 rounded-lg border border-dashed border-border py-10 text-center">
                  <Package className="mx-auto h-10 w-10 text-muted-foreground" strokeWidth={1.2} />
                  <p className="mt-3 text-[13.5px] text-muted-foreground">
                    {t("pdp.noReviews")}
                  </p>
                  <button className="btn-primary mt-4 rounded-full">
                    {t("pdp.writeReviewCta")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ RELATED PRODUCTS ═══════════════════════════════════ */}
      {relatedProducts.length > 0 && (
        <div className="container-gadget">
          <div className="py-5">
            <SectionHeading
              title={t("pdp.related")}
              action={`${t("nav.viewAll")} (${relatedProducts.length})`}
              href={categoryHref(product.category)}
            />
            <ProductGrid products={relatedProducts} />
          </div>
        </div>
      )}
    </div>
  );
}
