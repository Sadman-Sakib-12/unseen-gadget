"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { SectionCard } from "@/features/cms/components/pages/section-card";

interface SubsectionItem {
  term?: string;
  text: string;
}

interface Subsection {
  title?: string;
  paragraph?: string;
  items?: SubsectionItem[];
  footerParagraph?: string;
  hasDividerAfter?: boolean;
}

interface SectionBlock {
  id: string;
  heading: string;
  subsections?: Subsection[];
}

export interface PrivacyContent {
  type: "privacy";
  lastUpdated?: string;
  effectiveDate?: string;
  intro?: string;
  sections?: SectionBlock[];
  contactInfo?: {
    email: string;
    address: string;
  };
}

interface PrivacyEditorProps {
  content: PrivacyContent;
  onChange: (content: PrivacyContent) => void;
}

export function PrivacyEditor({ content, onChange }: PrivacyEditorProps) {
  const sections = content.sections || [];
  const contactInfo = content.contactInfo || { email: "", address: "" };

  const updateSection = (secIdx: number, patch: Partial<SectionBlock>) => {
    const updated = [...sections];
    updated[secIdx] = { ...updated[secIdx], ...patch };
    onChange({ ...content, sections: updated });
  };

  const addSection = () => {
    const newSec: SectionBlock = {
      id: `section-${Date.now()}`,
      heading: "New Section Title",
      subsections: [
        {
          title: "Subsection Title",
          paragraph: "Write the details here...",
          items: [],
        },
      ],
    };
    onChange({ ...content, sections: [...sections, newSec] });
  };

  const removeSection = (secIdx: number) => {
    const updated = sections.filter((_, i) => i !== secIdx);
    onChange({ ...content, sections: updated });
  };

  const addSubsection = (secIdx: number) => {
    const sec = sections[secIdx];
    const subList = sec.subsections || [];
    updateSection(secIdx, {
      subsections: [
        ...subList,
        {
          title: "New Subtitle",
          paragraph: "",
          items: [],
        },
      ],
    });
  };

  const updateSubsection = (secIdx: number, subIdx: number, patch: Partial<Subsection>) => {
    const sec = sections[secIdx];
    const subList = [...(sec.subsections || [])];
    subList[subIdx] = { ...subList[subIdx], ...patch };
    updateSection(secIdx, { subsections: subList });
  };

  const removeSubsection = (secIdx: number, subIdx: number) => {
    const sec = sections[secIdx];
    const subList = (sec.subsections || []).filter((_, i) => i !== subIdx);
    updateSection(secIdx, { subsections: subList });
  };

  const addItem = (secIdx: number, subIdx: number) => {
    const sec = sections[secIdx];
    const sub = (sec.subsections || [])[subIdx];
    const items = sub.items || [];
    updateSubsection(secIdx, subIdx, {
      items: [...items, { term: "", text: "" }],
    });
  };

  const updateItem = (secIdx: number, subIdx: number, itemIdx: number, patch: Partial<SubsectionItem>) => {
    const sec = sections[secIdx];
    const sub = (sec.subsections || [])[subIdx];
    const items = [...(sub.items || [])];
    items[itemIdx] = { ...items[itemIdx], ...patch };
    updateSubsection(secIdx, subIdx, { items });
  };

  const removeItem = (secIdx: number, subIdx: number, itemIdx: number) => {
    const sec = sections[secIdx];
    const sub = (sec.subsections || [])[subIdx];
    const items = (sub.items || []).filter((_, i) => i !== itemIdx);
    updateSubsection(secIdx, subIdx, { items });
  };

  return (
    <div className="space-y-6">
      {/* ── Document Metadata ── */}
      <SectionCard title="Policy Header & Introduction" description="Configure the document's header details.">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Last Updated Date (e.g. 01/08/2024)">
            <Input
              value={content.lastUpdated || ""}
              onChange={(e) => onChange({ ...content, lastUpdated: e.target.value })}
              placeholder="01/08/2024"
            />
          </FormField>
          <FormField label="Effective Date (picker)">
            <Input
              type="date"
              value={content.effectiveDate || ""}
              onChange={(e) => onChange({ ...content, effectiveDate: e.target.value })}
            />
          </FormField>
        </div>

        <FormField label="Introduction Paragraph">
          <Textarea
            rows={3}
            value={content.intro || ""}
            onChange={(e) => onChange({ ...content, intro: e.target.value })}
            placeholder="Welcome to Unseen Gadget. This Privacy Policy explains..."
          />
        </FormField>
      </SectionCard>

      {/* ── Policy Sections List ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">Privacy Policy Sections</h3>
            <p className="text-xs text-gray-500">Add, edit, and arrange policy sections matching the legal document format.</p>
          </div>
          <Button type="button" onClick={addSection} size="sm" className="flex items-center gap-1.5">
            <Plus className="h-4 w-4" /> Add Section
          </Button>
        </div>

        {sections.map((sec, secIdx) => (
          <div key={sec.id || secIdx} className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 flex-1 max-w-xl">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {secIdx + 1}
                </span>
                <Input
                  value={sec.heading}
                  onChange={(e) => updateSection(secIdx, { heading: e.target.value })}
                  placeholder="Section Heading (e.g. Interpretation and Definitions)"
                  className="font-bold text-sm"
                />
              </div>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addSubsection(secIdx)}
                  className="text-xs"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Subsection
                </Button>
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
            </div>

            {/* Subsections */}
            <div className="space-y-4 pl-4 border-l-2 border-gray-100">
              {sec.subsections?.map((sub, subIdx) => (
                <div key={subIdx} className="space-y-3 rounded-lg border border-gray-100 bg-gray-50/50 p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <Input
                      value={sub.title || ""}
                      onChange={(e) => updateSubsection(secIdx, subIdx, { title: e.target.value })}
                      placeholder="Subsection Title (Optional, e.g. Definitions / Types of Data)"
                      className="text-xs font-semibold max-w-md bg-white"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSubsection(secIdx, subIdx)}
                      className="text-gray-400 hover:text-red-600 h-7 w-7 p-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <Textarea
                    rows={2}
                    value={sub.paragraph || ""}
                    onChange={(e) => updateSubsection(secIdx, subIdx, { paragraph: e.target.value })}
                    placeholder="Paragraph description (Optional)..."
                    className="text-xs bg-white"
                  />

                  {/* Bullet points */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-gray-600">Bullet Points / Items:</span>
                      <button
                        type="button"
                        onClick={() => addItem(secIdx, subIdx)}
                        className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" /> Add Item
                      </button>
                    </div>

                    {sub.items?.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-center gap-2">
                        <Input
                          value={item.term || ""}
                          onChange={(e) => updateItem(secIdx, subIdx, itemIdx, { term: e.target.value })}
                          placeholder="Bold Term (Optional, e.g. Account)"
                          className="text-xs max-w-[150px] bg-white font-medium"
                        />
                        <Input
                          value={item.text}
                          onChange={(e) => updateItem(secIdx, subIdx, itemIdx, { text: e.target.value })}
                          placeholder="Description text..."
                          className="text-xs flex-1 bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(secIdx, subIdx, itemIdx)}
                          className="text-gray-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-1">
                    <Input
                      value={sub.footerParagraph || ""}
                      onChange={(e) => updateSubsection(secIdx, subIdx, { footerParagraph: e.target.value })}
                      placeholder="Footer note for this block (Optional)..."
                      className="text-xs bg-white flex-1"
                    />
                    <label className="flex items-center gap-1.5 text-xs text-gray-600 shrink-0 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!sub.hasDividerAfter}
                        onChange={(e) => updateSubsection(secIdx, subIdx, { hasDividerAfter: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      Add Divider Below
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Contact Info ── */}
      <SectionCard title="Contact Information Footer" description="Contact details rendered at the bottom of the policy.">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Contact Email">
            <Input
              value={contactInfo.email}
              onChange={(e) => onChange({ ...content, contactInfo: { ...contactInfo, email: e.target.value } })}
              placeholder="contact@unseengadget.com"
            />
          </FormField>
          <FormField label="Physical Address">
            <Input
              value={contactInfo.address}
              onChange={(e) => onChange({ ...content, contactInfo: { ...contactInfo, address: e.target.value } })}
              placeholder="Shop 50, Block C, Level 04, Bashundhara City Shopping Mall, Dhaka"
            />
          </FormField>
        </div>
      </SectionCard>
    </div>
  );
}
