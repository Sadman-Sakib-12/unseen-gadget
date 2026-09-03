"use client";

import {
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Layers,
  Upload,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { renderIconPreview } from "./category-icons";
import type { CategoryShowcaseItem } from "./category-item-dialog";

interface CategoryListTableProps {
  items: CategoryShowcaseItem[];
  onImportStore: () => void;
  onAddClick: () => void;
  onEditClick: (item: CategoryShowcaseItem, index: number) => void;
  onDeleteClick: (index: number) => void;
  onMoveItem: (index: number, direction: "up" | "down") => void;
  onToggleActive: (index: number, active: boolean) => void;
  onInlineUpload: (index: number) => void;
}

export function CategoryListTable({
  items,
  onImportStore,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onMoveItem,
  onToggleActive,
  onInlineUpload,
}: CategoryListTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-bold">
              Categories Showcase List (CRUD)
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Upload custom logo images, edit titles, links, reorder or toggle active status.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onImportStore}>
              <Layers className="h-3.5 w-3.5 mr-1" />
              Import Store Categories
            </Button>
            <Button size="sm" onClick={onAddClick}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Category
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border rounded-xl border border-border overflow-hidden bg-card">
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 transition-colors ${
                item.active ? "hover:bg-muted/30" : "bg-muted/20 opacity-60"
              }`}
            >
              {/* Left: Thumbnail & Name/Link */}
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {/* Logo Thumbnail with Quick Upload */}
                <div
                  className="relative group flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border bg-muted/60 text-primary overflow-hidden cursor-pointer shadow-sm"
                  onClick={() => onInlineUpload(index)}
                  title="Click to change logo image"
                >
                  {renderIconPreview(item.iconType, item.image)}
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="h-3.5 w-3.5" />
                    <span className="text-[8px] font-bold mt-0.5">Upload</span>
                  </div>
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                      {item.name}
                    </h4>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
                      {item.image ? "Custom Image" : item.iconType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground font-mono truncate">
                      {item.href}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Controls & Actions */}
              <div className="flex items-center justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                {/* Active switch */}
                <div className="flex items-center gap-1.5 mr-2">
                  <span className="text-[11px] text-muted-foreground">Active</span>
                  <Switch
                    checked={item.active}
                    onCheckedChange={(checked) => onToggleActive(index, checked)}
                  />
                </div>

                {/* Quick Upload Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2.5 text-xs"
                  onClick={() => onInlineUpload(index)}
                >
                  <Upload className="h-3.5 w-3.5 mr-1" />
                  Upload Logo
                </Button>

                {/* Edit Modal Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => onEditClick(item, index)}
                  title="Edit category"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>

                {/* Sorting Buttons */}
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={index === 0}
                  onClick={() => onMoveItem(index, "up")}
                  className="h-8 w-8 p-0"
                >
                  <MoveUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={index === items.length - 1}
                  onClick={() => onMoveItem(index, "down")}
                  className="h-8 w-8 p-0"
                >
                  <MoveDown className="h-4 w-4" />
                </Button>

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteClick(index)}
                  className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              <Layers className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No category showcase items added yet.</p>
              <Button size="sm" onClick={onImportStore} className="mt-3">
                Import from Store Categories
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
