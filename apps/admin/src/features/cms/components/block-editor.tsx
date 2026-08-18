"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Check, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { ContentBlock, InlineText } from "@unseen-gadget/cms-data";

const BLOCK_TYPES: { value: ContentBlock["type"]; label: string }[] = [
  { value: "heading", label: "Heading" },
  { value: "paragraph", label: "Paragraph" },
  { value: "list", label: "List" },
  { value: "features", label: "Feature Cards" },
  { value: "quote", label: "Quote" },
  { value: "note", label: "Note" },
  { value: "table", label: "Table" },
  { value: "image", label: "Image" },
  { value: "cta", label: "Call to Action" },
  { value: "contactRow", label: "Contact Info" },
  { value: "divider", label: "Divider" },
];

function makeBlock(type: ContentBlock["type"]): ContentBlock {
  switch (type) {
    case "heading":
      return { type, level: 2, text: "" };
    case "paragraph":
      return { type, text: [{ text: "" }] };
    case "list":
      return { type, items: [""] };
    case "features":
      return { type, items: [{ title: "", desc: "" }] };
    case "quote":
      return { type, text: "", cite: "" };
    case "note":
      return { type, variant: "info", title: "", text: "" };
    case "table":
      return { type, head: ["", ""], rows: [["", ""]] };
    case "image":
      return { type, src: "", alt: "", caption: "" };
    case "cta":
      return { type, label: "", href: "" };
    case "contactRow":
      return { type, icon: "phone", label: "", value: "", sub: "" };
    case "divider":
      return { type };
  }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

const lineToItems = (value: string): string[] =>
  value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

const itemsToLines = (items: string[]): string => items.join("\n");

function parseInlineText(value: string): InlineText[] {
  try {
    const parsed = JSON.parse(value) as InlineText[];
    return Array.isArray(parsed) ? parsed : [{ text: value }];
  } catch {
    return [{ text: value }];
  }
}

function BlockFields({
  block,
  onChange,
}: {
  block: ContentBlock;
  onChange: (block: ContentBlock) => void;
}) {
  switch (block.type) {
    case "heading":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Level">
            <Select
              value={String(block.level)}
              onChange={(e) => onChange({ ...block, level: Number(e.target.value) as 2 | 3 | 4 })}
              options={[
                { value: "2", label: "H2" },
                { value: "3", label: "H3" },
                { value: "4", label: "H4" },
              ]}
            />
          </Field>
          <Field label="Text">
            <Input
              value={block.text}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
              placeholder="Section heading"
            />
          </Field>
        </div>
      );
    case "paragraph":
      return (
        <Field label="Text (JSON)">
          <Textarea
            value={JSON.stringify(block.text)}
            onChange={(e) => onChange({ ...block, text: parseInlineText(e.target.value) })}
            rows={3}
            placeholder='[{ "text": "Hello " }, { "text": "world", "marks": ["bold"] }]'
          />
          <p className="text-[11px] text-gray-400">
            Use JSON with optional <code>marks</code> (<code>bold</code>, <code>italic</code>,{" "}
            <code>link</code>) and <code>url</code> for links.
          </p>
        </Field>
      );
    case "list":
      return (
        <div className="space-y-4">
          <Field label="Items (one per line)">
            <Textarea
              value={itemsToLines(block.items)}
              onChange={(e) =>
                onChange({ ...block, items: lineToItems(e.target.value) })
              }
              rows={5}
            />
          </Field>
          <div className="flex items-center gap-2">
            <Switch
              checked={Boolean(block.ordered)}
              onCheckedChange={(checked) => onChange({ ...block, ordered: checked })}
              id={`ordered-${block.type}`}
              aria-label="Numbered list"
            />
            <label htmlFor={`ordered-${block.type}`} className="text-xs text-gray-600">
              Numbered list
            </label>
          </div>
        </div>
      );
    case "features":
      return (
        <Field label="Cards (JSON)">
          <Textarea
            value={JSON.stringify(block.items, null, 2)}
            onChange={(e) => {
              try {
                onChange({ ...block, items: JSON.parse(e.target.value) });
              } catch {
                /* keep previous value while typing */
              }
            }}
            rows={6}
            placeholder='[{ "title": "Title", "desc": "Description" }]'
          />
        </Field>
      );
    case "quote":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Quote">
            <Textarea
              value={block.text}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
              rows={3}
            />
          </Field>
          <Field label="Cite">
            <Input
              value={block.cite ?? ""}
              onChange={(e) => onChange({ ...block, cite: e.target.value })}
              placeholder="Author / source"
            />
          </Field>
        </div>
      );
    case "note":
      return (
        <div className="space-y-4">
          <Field label="Variant">
            <Select
              value={block.variant ?? "info"}
              onChange={(e) =>
                onChange({ ...block, variant: e.target.value as "info" | "warning" | "success" })
              }
              options={[
                { value: "info", label: "Info (blue)" },
                { value: "warning", label: "Warning (amber)" },
                { value: "success", label: "Success (green)" },
              ]}
            />
          </Field>
          <Field label="Title">
            <Input
              value={block.title ?? ""}
              onChange={(e) => onChange({ ...block, title: e.target.value })}
              placeholder="Optional title"
            />
          </Field>
          <Field label="Text">
            <Textarea
              value={block.text}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
              rows={3}
            />
          </Field>
        </div>
      );
    case "table":
      return (
        <div className="space-y-4">
          <Field label="Header (comma separated)">
            <Input
              value={block.head?.join(", ") ?? ""}
              onChange={(e) =>
                onChange({
                  ...block,
                  head: e.target.value
                    .split(",")
                    .map((h) => h.trim())
                    .filter(Boolean),
                })
              }
              placeholder="Zone, Time, Charge"
            />
          </Field>
          <Field label="Rows (JSON)">
            <Textarea
              value={JSON.stringify(block.rows, null, 2)}
              onChange={(e) => {
                try {
                  onChange({ ...block, rows: JSON.parse(e.target.value) });
                } catch {
                  /* keep previous value while typing */
                }
              }}
              rows={6}
              placeholder='[["value 1", "value 2"]]'
            />
          </Field>
        </div>
      );
    case "image":
      return (
        <div className="space-y-4">
          <Field label="Image URL">
            <Input
              value={block.src}
              onChange={(e) => onChange({ ...block, src: e.target.value })}
              placeholder="/images/..."
            />
          </Field>
          <Field label="Alt text">
            <Input
              value={block.alt}
              onChange={(e) => onChange({ ...block, alt: e.target.value })}
            />
          </Field>
          <Field label="Caption">
            <Input
              value={block.caption ?? ""}
              onChange={(e) => onChange({ ...block, caption: e.target.value })}
            />
          </Field>
        </div>
      );
    case "cta":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Button label">
            <Input
              value={block.label}
              onChange={(e) => onChange({ ...block, label: e.target.value })}
            />
          </Field>
          <Field label="Link">
            <Input
              value={block.href}
              onChange={(e) => onChange({ ...block, href: e.target.value })}
              placeholder="/products or https://..."
            />
          </Field>
        </div>
      );
    case "contactRow":
      return (
        <div className="space-y-4">
          <Field label="Icon">
            <Select
              value={block.icon}
              onChange={(e) =>
                onChange({ ...block, icon: e.target.value as "phone" | "mail" | "map" | "clock" })
              }
              options={[
                { value: "phone", label: "Phone" },
                { value: "mail", label: "Email" },
                { value: "map", label: "Address" },
                { value: "clock", label: "Hours" },
              ]}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Label">
              <Input
                value={block.label}
                onChange={(e) => onChange({ ...block, label: e.target.value })}
              />
            </Field>
            <Field label="Value">
              <Input
                value={block.value}
                onChange={(e) => onChange({ ...block, value: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Subtitle">
            <Input
              value={block.sub ?? ""}
              onChange={(e) => onChange({ ...block, sub: e.target.value })}
            />
          </Field>
        </div>
      );
    case "divider":
      return <p className="text-xs text-gray-400">Horizontal divider — no settings.</p>;
  }
}

function blockSummary(block: ContentBlock): string {
  switch (block.type) {
    case "heading":
      return block.text || "(empty heading)";
    case "paragraph":
      return block.text.map((t) => t.text).join("") || "(empty paragraph)";
    case "list":
      return `${block.items.length} item${block.items.length === 1 ? "" : "s"}`;
    case "features":
      return `${block.items.length} card${block.items.length === 1 ? "" : "s"}`;
    case "quote":
      return block.text || "(empty quote)";
    case "note":
      return block.title || block.text || "(note)";
    case "table":
      return `${block.rows.length} row${block.rows.length === 1 ? "" : "s"}`;
    case "image":
      return block.alt || block.src || "(image)";
    case "cta":
      return block.label || "(call to action)";
    case "contactRow":
      return `${block.label}: ${block.value}`;
    case "divider":
      return "— divider —";
  }
}

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