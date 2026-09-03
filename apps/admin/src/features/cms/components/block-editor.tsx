"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Check, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { ContentBlock } from "@unseen-gadget/types";
import {
  BLOCK_TYPES,
  makeBlock,
  blockSummary,
  BlockFields,
} from "./block-field-editor";

export function BlockEditor({
  blocks,
  onChange,
}: {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<ContentBlock | null>(null);
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);

  const startEdit = (index: number) => {
    setDraft(blocks[index]);
    setEditingIndex(index);
  };

  const startAdd = (type: ContentBlock["type"]) => {
    const next = [...blocks, makeBlock(type)];
    onChange(next);
    startEdit(next.length - 1);
  };

  const commitEdit = () => {
    if (editingIndex === null || !draft) return;
    const next = blocks.map((b, i) => (i === editingIndex ? draft : b));
    onChange(next);
    setEditingIndex(null);
    setDraft(null);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setDraft(null);
  };

  const confirmRemove = () => {
    if (removingIndex === null) return;
    onChange(blocks.filter((_, i) => i !== removingIndex));
    if (editingIndex === removingIndex) cancelEdit();
    setRemovingIndex(null);
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const label = (block: ContentBlock) =>
    BLOCK_TYPES.find((b) => b.value === block.type)?.label ?? block.type;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-gray-500">Content blocks</p>
        <Select
          className="w-56"
          value=""
          onChange={(e) => e.target.value && startAdd(e.target.value as ContentBlock["type"])}
          options={[{ value: "", label: "Add block…" }, ...BLOCK_TYPES]}
        />
      </div>

      {blocks.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-gray-50 px-4 py-6 text-center text-xs text-gray-400">
          No blocks yet — add one to get started.
        </p>
      ) : (
        <ul className="space-y-2">
          {blocks.map((block, index) => (
            <li
              key={index}
              className="rounded-lg border border-border bg-white shadow-sm"
            >
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="w-16 shrink-0 rounded-md bg-primary/10 px-2 py-0.5 text-center text-[10px] font-bold text-primary">
                  {label(block)}
                </span>
                <span className="min-w-0 flex-1 truncate text-xs text-gray-600">
                  {blockSummary(block)}
                </span>
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="Move up"
                  className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === blocks.length - 1}
                  aria-label="Move down"
                  className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(index)}
                  aria-label="Edit block"
                  className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setRemovingIndex(index)}
                  aria-label="Delete block"
                  className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {editingIndex === index && draft ? (
                <div className="border-t border-border p-4">
                  <div className="grid gap-4">
                    <BlockFields block={draft} onChange={setDraft} />
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={cancelEdit}>
                      <X className="h-3.5 w-3.5" /> Cancel
                    </Button>
                    <Button size="sm" onClick={commitEdit}>
                      <Check className="h-3.5 w-3.5" /> Save block
                    </Button>
                  </div>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={removingIndex !== null}
        onOpenChange={(open) => !open && setRemovingIndex(null)}
        title="Remove block?"
        description="This block will be removed from the page content."
        confirmLabel="Remove"
        destructive
        onConfirm={confirmRemove}
      />
    </div>
  );
}