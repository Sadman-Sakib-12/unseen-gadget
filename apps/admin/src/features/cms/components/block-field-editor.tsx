"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { ContentBlock, InlineText } from "@unseen-gadget/types";

export const BLOCK_TYPES: { value: ContentBlock["type"]; label: string }[] = [
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

export function makeBlock(type: ContentBlock["type"]): ContentBlock {
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

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

export function blockSummary(block: ContentBlock): string {
  switch (block.type) {
    case "heading":
      return block.text || "(empty heading)";
    case "paragraph":
      return (block.text as InlineText[])?.map((t: InlineText) => t.text).join("") || "(empty paragraph)";
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
    default:
      return "";
  }
}

const lineToItems = (value: string): string[] =>
  value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

const itemsToLines = (items: string[]): string => items.join("\n");

function getParagraphString(val: unknown): string {
  if (typeof val === "string") return val;
  if (Array.isArray(val)) {
    return val
      .map((item) => (typeof item === "string" ? item : item?.text ?? ""))
      .join("");
  }
  return "";
}

function parseParagraphString(str: string): InlineText[] {
  return [{ text: str }];
}

interface FeatureItem {
  title: string;
  desc: string;
  icon?: string;
}

function FeaturesEditor({
  items,
  onChange,
}: {
  items: FeatureItem[];
  onChange: (items: FeatureItem[]) => void;
}) {
  const list = Array.isArray(items) ? items : [];

  const updateItem = (index: number, patch: Partial<FeatureItem>) => {
    const next = [...list];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const addItem = () => {
    onChange([...list, { title: "", desc: "" }]);
  };

  const removeItem = (index: number) => {
    onChange(list.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-700">Feature / Info Cards ({list.length})</label>
        <Button type="button" variant="outline" size="sm" onClick={addItem} className="h-7 gap-1 text-xs">
          <Plus className="h-3.5 w-3.5" />
          Add Card
        </Button>
      </div>

      {list.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50/50 p-4 text-center text-xs text-gray-400">
          No cards added yet. Click &quot;Add Card&quot; to create one.
        </p>
      ) : (
        <div className="space-y-3">
          {list.map((item, idx) => (
            <div key={idx} className="relative rounded-xl border border-gray-200 bg-gray-50/40 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary">Card #{idx + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(idx)}
                  className="h-6 w-6 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-gray-600">Card Title / Section Name</label>
                <Input
                  value={item.title || ""}
                  onChange={(e) => updateItem(idx, { title: e.target.value })}
                  placeholder="e.g. 100% Original Products"
                  className="bg-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-gray-600">Description / Details</label>
                <Textarea
                  value={item.desc || ""}
                  onChange={(e) => updateItem(idx, { desc: e.target.value })}
                  rows={2}
                  placeholder="Enter detailed description here..."
                  className="bg-white text-xs"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TableEditor({
  head,
  rows,
  onChange,
}: {
  head?: string[];
  rows: string[][];
  onChange: (head: string[], rows: string[][]) => void;
}) {
  const currentHead = head || ["Column 1", "Column 2"];
  const currentRows = Array.isArray(rows) ? rows : [];

  const updateHeader = (val: string) => {
    const newHead = val.split(",").map((h) => h.trim()).filter(Boolean);
    onChange(newHead, currentRows);
  };

  const updateCell = (rowIndex: number, colIndex: number, val: string) => {
    const nextRows = currentRows.map((r, rIdx) => {
      if (rIdx !== rowIndex) return r;
      const nextRow = [...r];
      nextRow[colIndex] = val;
      return nextRow;
    });
    onChange(currentHead, nextRows);
  };

  const addRow = () => {
    const newRow = currentHead.map(() => "");
    onChange(currentHead, [...currentRows, newRow]);
  };

  const removeRow = (rowIndex: number) => {
    onChange(currentHead, currentRows.filter((_, i) => i !== rowIndex));
  };

  return (
    <div className="space-y-4">
      <Field label="Table Headers (comma separated)">
        <Input
          value={currentHead.join(", ")}
          onChange={(e) => updateHeader(e.target.value)}
          placeholder="e.g. Zone, Delivery Time, Charge"
          className="bg-white text-xs"
        />
      </Field>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-gray-700">Rows ({currentRows.length})</label>
          <Button type="button" variant="outline" size="sm" onClick={addRow} className="h-7 gap-1 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Add Row
          </Button>
        </div>

        {currentRows.map((row, rIdx) => (
          <div key={rIdx} className="flex items-center gap-2">
            {currentHead.map((_, cIdx) => (
              <Input
                key={cIdx}
                value={row[cIdx] || ""}
                onChange={(e) => updateCell(rIdx, cIdx, e.target.value)}
                placeholder={`Col ${cIdx + 1}`}
                className="bg-white text-xs"
              />
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeRow(rIdx)}
              className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BlockFields({
  block,
  onChange,
}: {
  block: ContentBlock;
  onChange: (b: ContentBlock) => void;
}) {
  switch (block.type) {
    case "heading":
      return (
        <div className="space-y-4">
          <Field label="Heading Level">
            <Select
              value={String(block.level)}
              onChange={(e) => onChange({ ...block, level: Number(e.target.value) as 2 | 3 | 4 })}
              options={[
                { value: "2", label: "H2 — Section Title" },
                { value: "3", label: "H3 — Subsection Title" },
                { value: "4", label: "H4 — Small Title" },
              ]}
            />
          </Field>
          <Field label="Text">
            <Input
              value={block.text}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
              placeholder="Heading text..."
            />
          </Field>
        </div>
      );
    case "paragraph":
      return (
        <Field label="Paragraph text">
          <Textarea
            value={getParagraphString(block.text)}
            onChange={(e) => onChange({ ...block, text: parseParagraphString(e.target.value) })}
            rows={4}
            placeholder="Write your paragraph here..."
          />
        </Field>
      );
    case "list":
      return (
        <div className="space-y-4">
          <Field label="List items (one per line)">
            <Textarea
              value={itemsToLines(block.items)}
              onChange={(e) => onChange({ ...block, items: lineToItems(e.target.value) })}
              rows={5}
              placeholder="First point&#10;Second point&#10;Third point"
            />
          </Field>
          <div className="flex items-center gap-2">
            <Switch
              checked={Boolean(block.ordered)}
              onCheckedChange={(checked) => onChange({ ...block, ordered: checked })}
              id={`ordered-${block.type}`}
              aria-label="Numbered list"
            />
            <label htmlFor={`ordered-${block.type}`} className="text-xs font-medium text-gray-700">
              Numbered list (1, 2, 3...)
            </label>
          </div>
        </div>
      );
    case "features":
      return (
        <FeaturesEditor
          items={block.items as FeatureItem[]}
          onChange={(items) => onChange({ ...block, items })}
        />
      );
    case "quote":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Quote Text">
            <Textarea
              value={block.text}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
              rows={3}
              placeholder="Enter quote here..."
            />
          </Field>
          <Field label="Citation / Author">
            <Input
              value={block.cite ?? ""}
              onChange={(e) => onChange({ ...block, cite: e.target.value })}
              placeholder="e.g. CEO, Unseen Gadget"
            />
          </Field>
        </div>
      );
    case "note":
      return (
        <div className="space-y-4">
          <Field label="Note Type / Color">
            <Select
              value={block.variant ?? "info"}
              onChange={(e) =>
                onChange({ ...block, variant: e.target.value as "info" | "warning" | "success" })
              }
              options={[
                { value: "info", label: "Info (Blue)" },
                { value: "warning", label: "Warning (Amber)" },
                { value: "success", label: "Success (Green)" },
              ]}
            />
          </Field>
          <Field label="Title (Optional)">
            <Input
              value={block.title ?? ""}
              onChange={(e) => onChange({ ...block, title: e.target.value })}
              placeholder="e.g. Important Notice"
            />
          </Field>
          <Field label="Note Content">
            <Textarea
              value={block.text}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
              rows={3}
              placeholder="Enter note text..."
            />
          </Field>
        </div>
      );
    case "table":
      return (
        <TableEditor
          head={block.head}
          rows={block.rows}
          onChange={(head, rows) => onChange({ ...block, head, rows })}
        />
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
    default:
      return null;
  }
}
