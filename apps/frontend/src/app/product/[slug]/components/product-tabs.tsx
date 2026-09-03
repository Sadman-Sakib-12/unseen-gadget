"use client";

import { CheckCircle, MapPin, Truck, Clock } from "lucide-react";
import { ProductReviews } from "./product-reviews";

interface TabItem {
  id: string;
  label: string;
}

interface ProductTabsProps {
  tabs: TabItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  product: any;
  featuresList: string[];
  specsObject: Record<string, unknown>;
  warrantyPoints: string[];
  reviewsList: any[];
  reviewsLoading: boolean;
  reviewsCount: number;
  currentRating: string | number;
  onReviewSubmitted: () => void;
  t: (key: string) => string;
}

export function ProductTabs({
  tabs,
  activeTab,
  setActiveTab,
  product,
  featuresList,
  specsObject,
  warrantyPoints,
  reviewsList,
  reviewsLoading,
  reviewsCount,
  currentRating,
  onReviewSubmitted,
  t,
}: ProductTabsProps) {
  return (
    <div id="pdp-tabs-container" className="container-gadget">
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
                {tab.id === "reviews" && reviewsCount > 0 ? ` (${reviewsCount})` : ""}
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

          {activeTab === "features" && featuresList.length > 0 && (
            <ul className="grid max-w-3xl gap-3 sm:grid-cols-2">
              {featuresList.map((feature: string, index: number) => (
                <li key={index} className="flex items-start gap-2.5 text-[13.5px] text-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          )}

          {activeTab === "specifications" && Object.keys(specsObject).length > 0 && (
            <div className="max-w-3xl overflow-hidden rounded-lg border border-border">
              <table className="w-full">
                <tbody>
                  {Object.entries(specsObject).map(([key, value], index) => (
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

          {activeTab === "warranty" && warrantyPoints.length > 0 && (
            <div className="max-w-3xl rounded-xl border border-success/30 bg-success/5 p-5">
              <h3 className="mb-3 text-[15px] font-bold text-success">
                {t("pdp.tab.warranty")}
              </h3>
              <ul className="space-y-2.5">
                {warrantyPoints.map((point: string, index: number) => (
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
            <ProductReviews
              reviewsList={reviewsList}
              reviewsLoading={reviewsLoading}
              reviewsCount={reviewsCount}
              currentRating={currentRating}
              productName={product.name}
              productId={product.id}
              onReviewSubmitted={onReviewSubmitted}
              t={t}
            />
          )}
        </div>
      </div>
    </div>
  );
}
