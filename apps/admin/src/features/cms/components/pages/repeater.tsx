"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface RepeaterProps<T> {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  makeItem: () => T;
  renderItem: (item: T, update: (next: T) => void) => React.ReactNode;
  getEnabled?: (item: T) => boolean;
  applyEnabled?: (item: T, enabled: boolean) => T;
  getOrder?: (item: T) => number;
  applyOrder?: (item: T, order: number) => T;
  addLabel?: string;
}

export function Repeater<T>({
  label,
  items,
  onChange,
  makeItem,
  renderItem,
  getEnabled,
  applyEnabled,
  getOrder,
  applyOrder,
  addLabel = "Add",
}: RepeaterProps<T>) {
  const renumber = (list: T[]) =>
    getOrder && applyOrder ? list.map((item, index) => applyOrder(item, index + 1)) : list;

  const reorder = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(renumber(next));
  };

  const removeAt = (index: number) => {
    onChange(renumber(items.filter((_, i) => i !== index)));
  };

  const addItem = () => {
    onChange(renumber([...items, makeItem()]));
  };

  const updateAt = (index: number, next: T) => {
    const updated = [...items];
    updated[index] = next;
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-gray-500">{label}</p>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="h-3.5 w-3.5" />
          {addLabel}
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-gray-50 px-4 py-6 text-center text-xs text-gray-400">
          No items yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="rounded-lg border border-border bg-white p-3 shadow-sm">
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1 space-y-3">{renderItem(item, (next) => updateAt(index, next))}</div>
                <div className="flex shrink-0 items-center gap-0.5">
                  {getEnabled && applyEnabled ? (
                    <Switch
                      checked={getEnabled(item)}
                      onCheckedChange={(enabled) => updateAt(index, applyEnabled(item, enabled))}
                      aria-label="Enable item"
                    />
                  ) : null}
                  <button
                    type="button"
                    onClick={() => reorder(index, -1)}
                    disabled={index === 0}
                    aria-label="Move up"
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => reorder(index, 1)}
                    disabled={index === items.length - 1}
                    aria-label="Move down"
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAt(index)}
                    aria-label="Remove item"
                    className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}