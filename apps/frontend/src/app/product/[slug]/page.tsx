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
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { useCartStore } from "@/features/cart-store";
import { useWishlistStore } from "@/features/wishlist-store";
import { useHydrated } from "@/hooks/use-hydrated";

const cx = "mx-auto w-full max-w-[1320px] px-4";

const allProducts = products as MockProduct[];

/* ── Breadcrumb — maxcart/category-page style ────────────────── */
function Breadcrumb({ product }: { product: MockProduct }) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className={cx}>
        <nav className="flex flex-wrap items-center gap-1.5 py-3 text-[12px] text-gray-500">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <Link
            href={`/category/${product.category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
            className="hover:text-blue-600"
          >
            {product.category}
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <span className="font-medium text-gray-800">{product.name}</span>
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

  /* ── Tabs — only rendered when the data exists ─────────────── */
  const tabs: { id: string; label: string }[] = [
    ...(product.description ? [{ id: "description", label: "Description" }] : []),
    ...(product.features?.length ? [{ id: "features", label: "Key Features" }] : []),
    ...(product.specifications ? [{ id: "specifications", label: "Specifications" }] : []),
    ...(product.warranty?.length ? [{ id: "warranty", label: "Warranty & Guarantee" }] : []),
    ...(product.deliveryInfo ? [{ id: "delivery", label: "Delivery Information" }] : []),
    { id: "reviews", label: "Customer Reviews" },
  ];

  const handleAddToCart = () => {
    if (outOfStock) return;
    addItem(product, quantity, selectedColor ?? product.colors?.[0]);
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    if (outOfStock) return;
    addItem(product, quantity, selectedColor ?? product.colors?.[0]);
    router.push("/cart");
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Breadcrumb product={product} />

      {/* ══ MAIN PRODUCT SECTION ═══════════════════════════════ */}
      <div className={cx}>
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
                toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
              }}
            />
          </div>

          {/* ── Right: Product Info ─────────────────────────── */}
          <div className="card-surface p-4 sm:p-5">
            {/* Title + brand/category */}
            <h1 className="text-[22px] font-bold leading-tight text-gray-900">
              {product.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-[12.5px] text-gray-500">
              <span>
                Brand: <strong className="text-gray-800">{product.brand ?? product.category}</strong>
              </span>
              <span>SKU: UG-{product.id.toString().padStart(4, "0")}</span>
            </div>

            {/* Rating + reviews */}
            <div className="mt-3 flex items-center gap-3">
              <StarRating rating={product.rating ?? 0} showValue />
              <span className="text-[12.5px] text-gray-500">
                {product.reviews ?? 0} reviews
              </span>
              <span className="text-[12.5px] text-blue-600 hover:underline cursor-pointer">
                Write a review
              </span>
            </div>

            {/* Price */}
            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-[24px] font-bold text-gray-900">
                  {formatBDT(product.price)}
                </span>
                {product.originalPrice != null && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatBDT(product.originalPrice)}
                  </span>
                )}
                {product.discount != null && product.discount > 0 && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-bold text-white">
                    -{product.discount}% OFF
                  </span>
                )}
              </div>
              {savings > 0 && (
                <p className="mt-1.5 text-[12.5px] font-medium text-green-600">
                  You Save: {formatBDT(savings)}
                </p>
              )}
              <p className="mt-0.5 text-[11.5px] text-gray-400">Price is negotiable</p>
            </div>

            {/* Stock status */}
            <div className="mt-4 flex items-center gap-2 text-[13px]">
              <span className="text-gray-500">Availability:</span>
              {outOfStock ? (
                <span className="font-semibold text-[#ff6b8a]">&times; Out of Stock</span>
              ) : (
                <span className="font-semibold text-green-600">&#10003; In Stock</span>
              )}
            </div>

            {/* Color variants */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-4">
                <span className="mb-2 block text-[13px] font-medium text-gray-700">
                  Color: <span className="text-gray-900">{selectedColor}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => {
                    const active = selectedColor === color;
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${
                          active
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 bg-white text-gray-600 hover:border-blue-300"
                        }`}
                      >
                        <span
                          className="h-3.5 w-3.5 rounded-full border border-gray-300"
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
              <span className="text-[13px] font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center rounded-full border border-gray-300 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-[14px] font-bold text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
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
                className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-3 text-[14px] font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
              <button
                disabled={outOfStock}
                onClick={handleBuyNow}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-blue-500 bg-white py-3 text-[14px] font-bold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Zap className="h-5 w-5" />
                Buy Now
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    toggleWishlist(product.id);
                    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
                  }}
                  className={`flex items-center justify-center gap-2 rounded-full border py-2.5 text-[12.5px] font-medium transition ${
                    wishlisted
                      ? "border-[#ff6b8a] bg-[#ff6b8a] text-white"
                      : "border-gray-300 bg-white text-gray-600 hover:border-[#ff6b8a] hover:text-[#ff6b8a]"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${wishlisted ? "fill-white" : ""}`} />
                  {wishlisted ? "Wishlisted" : "Wishlist"}
                </button>
                <button className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white py-2.5 text-[12.5px] font-medium text-gray-600 transition hover:border-gray-400 hover:bg-gray-50">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Quick order by phone */}
            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="text-center">
                <p className="mb-2 text-[13px] font-semibold text-blue-800">
                  Quick Order by Phone
                </p>
                <a
                  href="tel:+8801714039409"
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-[12.5px] font-bold text-white transition hover:bg-blue-700"
                >
                  <Phone className="h-4 w-4" />
                  Call: +880 1714-039409
                </a>
              </div>
            </div>

            {/* Service info */}
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <Truck className="mx-auto mb-1 h-5 w-5 text-blue-600" />
                <div className="text-[12px] font-semibold text-gray-800">Free Delivery</div>
                <div className="text-[11px] text-gray-500">Inside Dhaka</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <Shield className="mx-auto mb-1 h-5 w-5 text-green-600" />
                <div className="text-[12px] font-semibold text-gray-800">1 Year</div>
                <div className="text-[11px] text-gray-500">Warranty</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <RefreshCw className="mx-auto mb-1 h-5 w-5 text-orange-500" />
                <div className="text-[12px] font-semibold text-gray-800">7 Days</div>
                <div className="text-[11px] text-gray-500">Return</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ TABS ═══════════════════════════════════════════════ */}
      <div className={cx}>
        <div className="card-surface">
          {/* Tab headers */}
          <div className="overflow-x-auto border-b border-gray-200">
            <div className="flex gap-x-7 gap-y-2 px-5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap border-b-2 py-3.5 text-[13px] font-semibold transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-blue-600"
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
              <p className="max-w-3xl text-[13.5px] leading-relaxed text-gray-600">
                {product.description}
              </p>
            )}

            {activeTab === "features" && product.features && (
              <ul className="grid max-w-3xl gap-3 sm:grid-cols-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-[13.5px] text-gray-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "specifications" && product.specifications && (
              <div className="max-w-3xl overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value], index) => (
                      <tr key={key} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="w-[38%] border-r border-gray-200 px-4 py-3 text-[13px] font-semibold text-gray-700">
                          {key}
                        </td>
                        <td className="px-4 py-3 text-[13px] text-gray-900">{String(value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "warranty" && product.warranty && (
              <div className="max-w-3xl rounded-xl border border-green-100 bg-green-50 p-5">
                <h3 className="mb-3 text-[15px] font-bold text-green-800">
                  Warranty &amp; Guarantee
                </h3>
                <ul className="space-y-2.5">
                  {product.warranty.map((point, index) => (
                    <li key={index} className="flex items-start gap-2 text-[13.5px] text-green-700">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "delivery" && product.deliveryInfo && (
              <div className="grid max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {product.deliveryInfo.insideDhaka && (
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <MapPin className="mb-2 h-5 w-5 text-blue-600" />
                    <div className="text-[13px] font-semibold text-gray-800">Inside Dhaka</div>
                    <div className="mt-0.5 text-[12.5px] text-gray-500">
                      {product.deliveryInfo.insideDhaka}
                    </div>
                  </div>
                )}
                {product.deliveryInfo.outsideDhaka && (
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <Truck className="mb-2 h-5 w-5 text-green-600" />
                    <div className="text-[13px] font-semibold text-gray-800">Outside Dhaka</div>
                    <div className="mt-0.5 text-[12.5px] text-gray-500">
                      {product.deliveryInfo.outsideDhaka}
                    </div>
                  </div>
                )}
                {product.deliveryInfo.shippingCost && (
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <Clock className="mb-2 h-5 w-5 text-orange-500" />
                    <div className="text-[13px] font-semibold text-gray-800">Shipping Cost</div>
                    <div className="mt-0.5 text-[12.5px] text-gray-500">
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
                    <div className="text-[32px] font-bold leading-none text-gray-900">
                      {product.rating ?? 0}
                    </div>
                    <div className="mt-1.5">
                      <StarRating rating={product.rating ?? 0} />
                    </div>
                    <div className="mt-1 text-[12px] text-gray-500">
                      {product.reviews ?? 0} Reviews
                    </div>
                  </div>
                  <p className="text-[13px] text-gray-500">
                    Ratings are calculated from {product.reviews ?? 0} customer review
                    {product.reviews === 1 ? "" : "s"}.
                  </p>
                </div>
                <div className="mt-6 rounded-lg border border-dashed border-gray-200 py-10 text-center">
                  <Package className="mx-auto h-10 w-10 text-gray-300" />
                  <p className="mt-3 text-[13.5px] text-gray-500">
                    No written reviews yet. Be the first to review this product!
                  </p>
                  <button className="mt-4 rounded-full bg-blue-600 px-6 py-2.5 text-[12.5px] font-bold text-white transition hover:bg-blue-700">
                    Write a Review
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ RELATED PRODUCTS ═══════════════════════════════════ */}
      {relatedProducts.length > 0 && (
        <div className={cx}>
          <div className="py-5">
            <SectionHeading
              title="Related Products"
              action={`View All (${relatedProducts.length})`}
              href={`/category/${product.category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} product={rp} viewMode="grid" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}