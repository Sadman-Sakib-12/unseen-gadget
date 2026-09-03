"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { SectionCard } from "@/features/cms/components/pages/section-card";

interface TermSection {
  id: string;
  heading: string;
  paragraph?: string;
  items?: string[];
}

export interface TermsContent {
  type: "terms";
  lastUpdated?: string;
  title?: string;
  intro?: string;
  sections?: TermSection[];
  contactInfo?: {
    companyName?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
}

interface TermsEditorProps {
  content: TermsContent;
  onChange: (content: TermsContent) => void;
}

export function TermsEditor({ content, onChange }: TermsEditorProps) {
  const sections = content.sections || [];
  const contactInfo = content.contactInfo || {
    companyName: "Unseen Gadget",
    address: "",
    phone: "",
    email: "",
    website: "",
  };

  const updateSection = (secIdx: number, patch: Partial<TermSection>) => {
    const updated = [...sections];
    updated[secIdx] = { ...updated[secIdx], ...patch };
    onChange({ ...content, sections: updated });
  };

  const addSection = () => {
    const newSec: TermSection = {
      id: `term-${Date.now()}`,
      heading: "New Terms Section",
      paragraph: "",
      items: [],
    };
    onChange({ ...content, sections: [...sections, newSec] });
  };

  const removeSection = (secIdx: number) => {
    const updated = sections.filter((_, i) => i !== secIdx);
    onChange({ ...content, sections: updated });
  };

  const addItem = (secIdx: number) => {
    const sec = sections[secIdx];
    const items = sec.items || [];
    updateSection(secIdx, { items: [...items, ""] });
  };

  const updateItem = (secIdx: number, itemIdx: number, val: string) => {
    const sec = sections[secIdx];
    const items = [...(sec.items || [])];
    items[itemIdx] = val;
    updateSection(secIdx, { items });
  };

  const removeItem = (secIdx: number, itemIdx: number) => {
    const sec = sections[secIdx];
    const items = (sec.items || []).filter((_, i) => i !== itemIdx);
    updateSection(secIdx, { items });
  };

  return (
    <div className="space-y-6">
      {/* ── Document Metadata ── */}
      <SectionCard title="Terms Header & Introduction" description="Configure the document's header details.">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Document Title">
            <Input
              value={content.title || ""}
              onChange={(e) => onChange({ ...content, title: e.target.value })}
              placeholder="Terms and Conditions – Unseen Gadget"
            />
          </FormField>
          <FormField label="Last Updated Date (e.g. 01/06/2025)">
            <Input
              value={content.lastUpdated || ""}
              onChange={(e) => onChange({ ...content, lastUpdated: e.target.value })}
              placeholder="01/06/2025"
            />
          </FormField>
        </div>

        <FormField label="Introduction Paragraph">
          <Textarea
            rows={3}
            value={content.intro || ""}
            onChange={(e) => onChange({ ...content, intro: e.target.value })}
            placeholder="Welcome to Unseen Gadget. By accessing or using our website..."
          />
        </FormField>
      </SectionCard>

      {/* ── Terms Sections List ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">Terms & Conditions Sections</h3>
            <p className="text-xs text-gray-500">Manage terms clauses, bullet lists, and paragraphs.</p>
          </div>
          <Button type="button" onClick={addSection} size="sm" className="flex items-center gap-1.5">
            <Plus className="h-4 w-4" /> Add Section
          </Button>
        </div>

        {sections.map((sec, secIdx) => (
          <div key={sec.id || secIdx} className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 flex-1 max-w-xl">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {secIdx + 1}
                </span>
                <Input
                  value={sec.heading}
                  onChange={(e) => updateSection(secIdx, { heading: e.target.value })}
                  placeholder="Section Heading (e.g. Acceptance of Terms)"
                  className="font-bold text-sm"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSection(secIdx)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <FormField label="Clause Description / Paragraph (Optional)">
              <Textarea
                rows={2}
                value={sec.paragraph || ""}
                onChange={(e) => updateSection(secIdx, { paragraph: e.target.value })}
                placeholder="Paragraph text for this clause..."
                className="text-xs"
              />
            </FormField>

            {/* Bullet Points */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-gray-600">Bullet Points (Optional):</span>
                <button
                  type="button"
                  onClick={() => addItem(secIdx)}
                  className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> Add Bullet Point
                </button>
              </div>

              {sec.items?.map((item, itemIdx) => (
                <div key={itemIdx} className="flex items-center gap-2">
                  <Input
                    value={item}
                    onChange={(e) => updateItem(secIdx, itemIdx, e.target.value)}
                    placeholder="Bullet point text..."
                    className="text-xs flex-1 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(secIdx, itemIdx)}
                    className="text-gray-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Contact Info Footer ── */}
      <SectionCard title="Contact Information Footer" description="Contact details rendered at the bottom of the terms page.">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Company Name">
            <Input
              value={contactInfo.companyName || ""}
              onChange={(e) => onChange({ ...content, contactInfo: { ...contactInfo, companyName: e.target.value } })}
              placeholder="Unseen Gadget"
            />
          </FormField>
          <FormField label="Address">
            <Input
              value={contactInfo.address || ""}
              onChange={(e) => onChange({ ...content, contactInfo: { ...contactInfo, address: e.target.value } })}
              placeholder="House 07, 3rd Floor, Block H, Main Road, Banasree, Dhaka"
            />
          </FormField>
          <FormField label="Phone">
            <Input
              value={contactInfo.phone || ""}
              onChange={(e) => onChange({ ...content, contactInfo: { ...contactInfo, phone: e.target.value } })}
              placeholder="e.g. +880 1XXX-XXXXXX"
            />
          </FormField>
          <FormField label="Email">
            <Input
              value={contactInfo.email || ""}
              onChange={(e) => onChange({ ...content, contactInfo: { ...contactInfo, email: e.target.value } })}
              placeholder="contact@unseengadget.com"
            />
          </FormField>
          <FormField label="Website URL">
            <Input
              value={contactInfo.website || ""}
              onChange={(e) => onChange({ ...content, contactInfo: { ...contactInfo, website: e.target.value } })}
              placeholder="https://unseengadget.com"
            />
          </FormField>
        </div>
      </SectionCard>
    </div>
  );
}
