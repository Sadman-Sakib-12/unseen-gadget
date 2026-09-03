"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { SectionCard } from "@/features/cms/components/pages/section-card";

interface ShowroomBranch {
  name: string;
  address: string;
}

export interface ContactPageContent {
  type: "contact";
  mapEmbedUrl?: string;
  heading?: string;
  paragraphs?: string[];
  bengaliNote?: string;
  hotline?: {
    phone?: string;
    details?: string;
  };
  showrooms?: ShowroomBranch[];
  corporateHq?: {
    name?: string;
    address?: string;
  };
  // Backwards compatibility fields
  hero?: { heading: string; description: string };
  contactInfo?: { items: any[] };
}

interface ContactEditorProps {
  content: ContactPageContent;
  onChange: (content: ContactPageContent) => void;
}

export function ContactEditor({ content, onChange }: ContactEditorProps) {
  const showrooms = content.showrooms || [];
  const paragraphs = content.paragraphs || [];

  const update = (patch: Partial<ContactPageContent>) => onChange({ ...content, ...patch });

  const addShowroom = () => {
    update({
      showrooms: [...showrooms, { name: "New Showroom", address: "Showroom Address" }],
    });
  };

  const updateShowroom = (idx: number, patch: Partial<ShowroomBranch>) => {
    const updated = [...showrooms];
    updated[idx] = { ...updated[idx], ...patch };
    update({ showrooms: updated });
  };

  const removeShowroom = (idx: number) => {
    update({ showrooms: showrooms.filter((_, i) => i !== idx) });
  };

  const addParagraph = () => {
    update({ paragraphs: [...paragraphs, ""] });
  };

  const updateParagraph = (idx: number, val: string) => {
    const updated = [...paragraphs];
    updated[idx] = val;
    update({ paragraphs: updated });
  };

  const removeParagraph = (idx: number) => {
    update({ paragraphs: paragraphs.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-6">
      {/* ── 1. Map Embed ── */}
      <SectionCard title="Map Embed & Header" description="Google Map iframe URL and main shop introduction.">
        <FormField label="Google Maps Embed URL">
          <Input
            value={content.mapEmbedUrl || ""}
            onChange={(e) => update({ mapEmbedUrl: e.target.value })}
            placeholder="https://www.google.com/maps/embed?pb=..."
          />
        </FormField>
        <FormField label="Main Heading">
          <Input
            value={content.heading || content.hero?.heading || ""}
            onChange={(e) => update({ heading: e.target.value })}
            placeholder="Visit Our Unseen Gadget Shops in Dhaka, Bashundhara City"
          />
        </FormField>
      </SectionCard>

      {/* ── 2. Introduction Paragraphs ── */}
      <SectionCard title="Shop Narrative Paragraphs" description="Information paragraphs about showrooms, online ordering, and corporate office.">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700">Paragraphs:</span>
            <Button type="button" onClick={addParagraph} size="sm" className="text-xs">
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Paragraph
            </Button>
          </div>

          {paragraphs.map((p, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <Textarea
                rows={2}
                value={p}
                onChange={(e) => updateParagraph(idx, e.target.value)}
                placeholder="Write paragraph..."
                className="text-xs flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeParagraph(idx)}
                className="text-red-500 hover:text-red-700 h-7 w-7 p-0 mt-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}

          <FormField label="Bengali Highlight Note (Optional)">
            <Input
              value={content.bengaliNote || ""}
              onChange={(e) => update({ bengaliNote: e.target.value })}
              placeholder="আমাদের আউটলেটে এসে সরাসরি দেখে শুনে..."
              className="text-xs"
            />
          </FormField>
        </div>
      </SectionCard>

      {/* ── 3. Hotline & HQ ── */}
      <SectionCard title="Hotline & Corporate HQ" description="Hotline numbers, emails and corporate office.">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Hotline Phone">
            <Input
              value={content.hotline?.phone || ""}
              onChange={(e) =>
                update({
                  hotline: {
                    phone: e.target.value,
                    details: content.hotline?.details || "",
                  },
                })
              }
              placeholder="e.g. +880 1XXX-XXXXXX"
            />
          </FormField>
          <FormField label="Hotline Details / Email">
            <Input
              value={content.hotline?.details || ""}
              onChange={(e) =>
                update({
                  hotline: {
                    phone: content.hotline?.phone || "",
                    details: e.target.value,
                  },
                })
              }
              placeholder="Shipping, Order Status & General Query: contact@unseengadget.com"
            />
          </FormField>
          <FormField label="Corporate HQ Title">
            <Input
              value={content.corporateHq?.name || ""}
              onChange={(e) =>
                update({
                  corporateHq: {
                    name: e.target.value,
                    address: content.corporateHq?.address || "",
                  },
                })
              }
              placeholder="Corporate HQ"
            />
          </FormField>
          <FormField label="Corporate HQ Address">
            <Input
              value={content.corporateHq?.address || ""}
              onChange={(e) =>
                update({
                  corporateHq: {
                    name: content.corporateHq?.name || "Corporate HQ",
                    address: e.target.value,
                  },
                })
              }
              placeholder="House 07, Main Road, Block: H, Banasree, Dhaka"
            />
          </FormField>
        </div>
      </SectionCard>

      {/* ── 4. Showroom Branches ── */}
      <SectionCard title="Showroom Branches" description="Physical showroom branch cards shown on the contact page.">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700">Showrooms:</span>
            <Button type="button" onClick={addShowroom} size="sm" className="text-xs">
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Showroom
            </Button>
          </div>

          {showrooms.map((branch, idx) => (
            <div key={idx} className="rounded-lg border border-gray-200 bg-gray-50/50 p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Input
                  value={branch.name}
                  onChange={(e) => updateShowroom(idx, { name: e.target.value })}
                  placeholder="Showroom Title (e.g. Showroom 1 (Main Branch))"
                  className="font-bold text-xs bg-white"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeShowroom(idx)}
                  className="text-red-500 hover:text-red-700 h-7 w-7 p-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <Input
                value={branch.address}
                onChange={(e) => updateShowroom(idx, { address: e.target.value })}
                placeholder="Shop 84, Block: C, Level: 04, Bashundhara City Shopping Mall, Dhaka"
                className="text-xs bg-white"
              />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}