"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { SectionCard } from "@/features/cms/components/pages/section-card";

interface ProcessStep {
  step: string;
  title: string;
  icon?: string;
}

interface ChargeRow {
  label: string;
  value: string;
}

interface ChargeTable {
  header: string;
  rows: ChargeRow[];
}

interface ReturnSectionItem {
  term?: string;
  text: string;
}

interface ReturnSection {
  id: string;
  heading: string;
  intro?: string;
  items?: ReturnSectionItem[];
  isNumbered?: boolean;
  hasDividerAfter?: boolean;
}

interface FaqItem {
  q: string;
  a: string;
}

export interface DeliveryReturnContent {
  type: "delivery-return";
  heroTitle?: string;
  heroSubtitle?: string;
  overviewHeading?: string;
  overviewDescription?: string;
  processSteps?: ProcessStep[];
  chargeTables?: {
    standard?: ChargeTable;
    sameDay?: ChargeTable;
  };
  lastUpdated?: string;
  returnHeading?: string;
  returnIntro?: string;
  returnSections?: ReturnSection[];
  shippingReturnAddress?: {
    companyName?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  faqs?: FaqItem[];
  // Backwards compatibility fields
  hero?: { heading: string; description: string };
  delivery?: { areas: string[]; charges: string; time: string; notes: string };
  deliveryProcess?: { steps: any[] };
  returns?: { policy: string; steps: string[]; nonReturnable: string[] };
}

interface DeliveryReturnEditorProps {
  content: DeliveryReturnContent;
  onChange: (content: DeliveryReturnContent) => void;
}

export function DeliveryReturnEditor({ content, onChange }: DeliveryReturnEditorProps) {
  const returnSections = content.returnSections || [];
  const faqs = content.faqs || [];

  const update = (patch: Partial<DeliveryReturnContent>) => onChange({ ...content, ...patch });

  const addReturnSection = () => {
    const newSec: ReturnSection = {
      id: `sec-${Date.now()}`,
      heading: "New Return Clause",
      items: [{ term: "Term", text: "Details" }],
    };
    update({ returnSections: [...returnSections, newSec] });
  };

  const removeReturnSection = (idx: number) => {
    const updated = returnSections.filter((_, i) => i !== idx);
    update({ returnSections: updated });
  };

  const updateReturnSection = (idx: number, patch: Partial<ReturnSection>) => {
    const updated = [...returnSections];
    updated[idx] = { ...updated[idx], ...patch };
    update({ returnSections: updated });
  };

  const addReturnItem = (secIdx: number) => {
    const sec = returnSections[secIdx];
    const items = sec.items || [];
    updateReturnSection(secIdx, { items: [...items, { term: "", text: "" }] });
  };

  const updateReturnItem = (secIdx: number, itemIdx: number, patch: Partial<ReturnSectionItem>) => {
    const sec = returnSections[secIdx];
    const items = [...(sec.items || [])];
    items[itemIdx] = { ...items[itemIdx], ...patch };
    updateReturnSection(secIdx, { items });
  };

  const removeReturnItem = (secIdx: number, itemIdx: number) => {
    const sec = returnSections[secIdx];
    const items = (sec.items || []).filter((_, i) => i !== itemIdx);
    updateReturnSection(secIdx, { items });
  };

  const addFaq = () => {
    update({ faqs: [...faqs, { q: "New Question?", a: "Answer..." }] });
  };

  const updateFaq = (idx: number, patch: Partial<FaqItem>) => {
    const updated = [...faqs];
    updated[idx] = { ...updated[idx], ...patch };
    update({ faqs: updated });
  };

  const removeFaq = (idx: number) => {
    update({ faqs: faqs.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-6">
      {/* ── 1. Hero Banner ── */}
      <SectionCard title="Blue Hero Banner" description="Title and subtitle on top blue banner.">
        <FormField label="Hero Title">
          <Input
            value={content.heroTitle || content.hero?.heading || ""}
            onChange={(e) => update({ heroTitle: e.target.value })}
            placeholder="Delivery & Return"
          />
        </FormField>
        <FormField label="Hero Subtitle">
          <Textarea
            rows={2}
            value={content.heroSubtitle || content.hero?.description || ""}
            onChange={(e) => update({ heroSubtitle: e.target.value })}
            placeholder="Free delivery available on orders over 3500 TK..."
          />
        </FormField>
      </SectionCard>

      {/* ── 2. Overview ── */}
      <SectionCard title="Delivery Options Overview" description="Overview description and 4 step badges.">
        <FormField label="Overview Heading">
          <Input
            value={content.overviewHeading || ""}
            onChange={(e) => update({ overviewHeading: e.target.value })}
            placeholder="Delivery Options Overview"
          />
        </FormField>
        <FormField label="Overview Description">
          <Textarea
            rows={3}
            value={content.overviewDescription || ""}
            onChange={(e) => update({ overviewDescription: e.target.value })}
            placeholder="Unseen Gadget offers reliable and convenient shipping options..."
          />
        </FormField>
      </SectionCard>

      {/* ── 3. Exchange / Return of Goods Document Sections ── */}
      <SectionCard title="Exchange or Return of Goods" description="Legal clauses, eligibility, return process, and refunds.">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Return Heading">
            <Input
              value={content.returnHeading || ""}
              onChange={(e) => update({ returnHeading: e.target.value })}
              placeholder="Exchange or Return of Goods"
            />
          </FormField>
          <FormField label="Last Updated Date (e.g. 01/06/2025)">
            <Input
              value={content.lastUpdated || ""}
              onChange={(e) => update({ lastUpdated: e.target.value })}
              placeholder="01/06/2025"
            />
          </FormField>
        </div>

        <FormField label="Return Intro Paragraph">
          <Textarea
            rows={2}
            value={content.returnIntro || ""}
            onChange={(e) => update({ returnIntro: e.target.value })}
            placeholder="At Unseen Gadget, we prioritize customer satisfaction..."
          />
        </FormField>

        {/* Dynamic Return Sections */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-gray-900">Return Policy Sections</h4>
            <Button type="button" onClick={addReturnSection} size="sm" className="text-xs">
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Section
            </Button>
          </div>

          {returnSections.map((sec, secIdx) => (
            <div key={sec.id || secIdx} className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Input
                  value={sec.heading}
                  onChange={(e) => updateReturnSection(secIdx, { heading: e.target.value })}
                  placeholder="Section Heading (e.g. Eligibility for Return)"
                  className="font-bold text-xs"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeReturnSection(secIdx)}
                  className="text-red-500 hover:text-red-700 h-7 w-7 p-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-600">Points / Items:</span>
                  <button
                    type="button"
                    onClick={() => addReturnItem(secIdx)}
                    className="text-[11px] font-semibold text-primary hover:underline"
                  >
                    + Add Item
                  </button>
                </div>
                {sec.items?.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-center gap-2">
                    <Input
                      value={item.term || ""}
                      onChange={(e) => updateReturnItem(secIdx, itemIdx, { term: e.target.value })}
                      placeholder="Term (e.g. Return Window)"
                      className="text-xs max-w-[140px]"
                    />
                    <Input
                      value={item.text}
                      onChange={(e) => updateReturnItem(secIdx, itemIdx, { text: e.target.value })}
                      placeholder="Description..."
                      className="text-xs flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeReturnItem(secIdx, itemIdx)}
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
      </SectionCard>

      {/* ── 4. FAQs ── */}
      <SectionCard title="Delivery & Return FAQs" description="Accordion FAQs rendered at the bottom of the page.">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-600">FAQ List:</span>
          <Button type="button" onClick={addFaq} size="sm" className="text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" /> Add FAQ
          </Button>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, fIdx) => (
            <div key={fIdx} className="rounded-lg border border-gray-200 bg-gray-50/50 p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Input
                  value={faq.q}
                  onChange={(e) => updateFaq(fIdx, { q: e.target.value })}
                  placeholder="Question..."
                  className="text-xs font-bold bg-white"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFaq(fIdx)}
                  className="text-red-500 hover:text-red-700 h-7 w-7 p-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <Textarea
                rows={2}
                value={faq.a}
                onChange={(e) => updateFaq(fIdx, { a: e.target.value })}
                placeholder="Answer..."
                className="text-xs bg-white"
              />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}