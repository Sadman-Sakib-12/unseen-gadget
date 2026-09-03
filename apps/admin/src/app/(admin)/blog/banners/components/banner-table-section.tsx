"use client";

import {
  Sliders,
  Layout,
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TablePanel } from "@/components/ui/table-panel";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { Banner } from "../page";

interface BannerTableSectionProps {
  sliderBanners: Banner[];
  sideBanners: Banner[];
  loading: boolean;
  onOpenAdd: (placement: "slider" | "side") => void;
  onOpenEdit: (banner: Banner) => void;
  onToggleStatus: (banner: Banner) => void;
  onDeleteTarget: (banner: Banner) => void;
}

export function BannerTableSection({
  sliderBanners,
  sideBanners,
  loading,
  onOpenAdd,
  onOpenEdit,
  onToggleStatus,
  onDeleteTarget,
}: BannerTableSectionProps) {
  return (
    <>
      {/* ════════════════ SECTION 1: HERO SLIDER BANNERS ════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sliders className="h-5 w-5 text-primary" />
              1. Main Hero Slider Banners ({sliderBanners.length})
            </h3>
            <p className="text-xs text-gray-500">
              These banners automatically slide in the large left carousel section of the storefront.
            </p>
          </div>
          <Button size="sm" onClick={() => onOpenAdd("slider")}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Slider Slide
          </Button>
        </div>

        <TablePanel title="Hero Slider Slides" count={sliderBanners.length}>
          {sliderBanners.length === 0 && !loading ? (
            <EmptyState
              icon={ImageIcon}
              title="No slider banners added"
              description="Add banners to create the main slider carousel on the homepage."
              action={
                <Button onClick={() => onOpenAdd("slider")}>
                  <Plus className="mr-1.5 h-4 w-4" /> Add Slider Banner
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Image</TableHead>
                  <TableHead>Title & Subtitle</TableHead>
                  <TableHead>CTA Button</TableHead>
                  <TableHead>Target Link</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sliderBanners.map((banner, index) => (
                  <TableRow key={`${banner.id}-${index}`}>
                    <TableCell>
                      <div className="h-14 w-24 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                        {banner.image ? (
                          <img
                            src={banner.image}
                            alt={banner.title || "Slider banner"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-gray-900">{banner.title || "Untitled"}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{banner.subtitle || "—"}</p>
                    </TableCell>
                    <TableCell>
                      {banner.cta ? (
                        <span className="rounded bg-primary/10 text-primary px-2 py-0.5 font-medium text-xs">
                          {banner.cta}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">No button</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <a
                        href={banner.href || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-primary hover:underline"
                      >
                        {banner.href || "/"}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => onToggleStatus(banner)}
                        className="cursor-pointer transition-opacity hover:opacity-80"
                        title="Click to toggle status"
                      >
                        <StatusBadge status={banner.status} />
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onOpenEdit(banner)}
                          aria-label={`Edit ${banner.title}`}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => onDeleteTarget(banner)}
                          aria-label={`Delete ${banner.title}`}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TablePanel>
      </div>

      <hr className="my-6 border-gray-200" />

      {/* ════════════════ SECTION 2: 2 SIDE PROMO BANNERS ════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Layout className="h-5 w-5 text-primary" />
              2. Right-Side Promo Banners ({sideBanners.length}/2)
            </h3>
            <p className="text-xs text-gray-500">
              These 2 banners appear stacked vertically on the right side of the homepage.
            </p>
          </div>
          {sideBanners.length < 2 && (
            <Button size="sm" variant="outline" onClick={() => onOpenAdd("side")}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Side Banner
            </Button>
          )}
        </div>

        {/* 2 Visual Side Banner Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1].map((idx) => {
            const banner = sideBanners[idx];
            const label = idx === 0 ? "Top Side Banner (Card 1)" : "Bottom Side Banner (Card 2)";

            return (
              <Card key={idx} className="overflow-hidden border border-gray-200 shadow-sm flex flex-col">
                <CardHeader className="py-3 px-4 bg-gray-50/70 border-b flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-[11px] font-bold">
                      {idx + 1}
                    </span>
                    <CardTitle className="text-xs font-bold text-gray-800">{label}</CardTitle>
                  </div>
                  {banner && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => onOpenEdit(banner)}
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-red-600 hover:bg-red-50"
                        onClick={() => onDeleteTarget(banner)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4 flex-1 flex flex-col justify-between">
                  {banner ? (
                    <div className="space-y-3">
                      <div className="relative h-36 w-full overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                        {banner.image ? (
                          <img
                            src={banner.image}
                            alt={banner.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <ImageIcon className="h-6 w-6" />
                          </div>
                        )}
                        {banner.cta && (
                          <div className="absolute bottom-2.5 left-3 z-10">
                            <span className="rounded bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold text-white shadow">
                              {banner.cta} →
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-gray-900 line-clamp-1">{banner.title || "Untitled"}</p>
                        <p className="text-[11px] text-gray-500 line-clamp-1">{banner.href || "/products"}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400 space-y-2">
                      <ImageIcon className="h-8 w-8 text-gray-300" />
                      <p className="text-xs font-medium text-gray-500">No banner set for this slot</p>
                      <Button size="sm" variant="outline" onClick={() => onOpenAdd("side")}>
                        <Plus className="h-3.5 w-3.5 mr-1" /> Add {label}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
