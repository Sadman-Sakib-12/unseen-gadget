"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import { SectionCard } from "./section-card";
import { Repeater } from "./repeater";
import type { ContactIcon, ContactPageContent } from "@unseen-gadget/cms-data";

const ICON_OPTIONS: { value: ContactIcon; label: string }[] = [
  { value: "phone", label: "Phone" },
  { value: "mail", label: "Email" },
  { value: "map", label: "Address" },
  { value: "clock", label: "Hours" },
];

interface ContactEditorProps {
  content: ContactPageContent;
  onChange: (content: ContactPageContent) => void;
}

export function ContactEditor({ content, onChange }: ContactEditorProps) {
  const update = (patch: Partial<ContactPageContent>) => onChange({ ...content, ...patch });

  return (
    <div className="space-y-6">
      <SectionCard title="Hero" description="Heading and description shown at the top of the contact page.">
        <FormField label="Heading">
          <Input
            value={content.hero.heading}
            onChange={(e) => update({ hero: { ...content.hero, heading: e.target.value } })}
          />
        </FormField>
        <FormField label="Description">
          <Textarea
            rows={2}
            value={content.hero.description}
            onChange={(e) => update({ hero: { ...content.hero, description: e.target.value } })}
          />
        </FormField>
      </SectionCard>

      <SectionCard
        title="Contact Information"
        description="Phone, email, address and hours — shown as info cards, in display order."
      >
        <Repeater
          label="Contact items"
          items={content.contactInfo.items}
          onChange={(items) => update({ contactInfo: { items } })}
          makeItem={() => ({ label: "", value: "", icon: "phone" as ContactIcon, link: "", enabled: true, order: 1 })}
          getEnabled={(item) => item.enabled}
          applyEnabled={(item, enabled) => ({ ...item, enabled })}
          getOrder={(item) => item.order}
          applyOrder={(item, order) => ({ ...item, order })}
          renderItem={(item, setItem) => (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Label">
                  <Input
                    value={item.label}
                    placeholder="e.g. Phone"
                    onChange={(e) => setItem({ ...item, label: e.target.value })}
                  />
                </FormField>
                <FormField label="Icon">
                  <Select
                    value={item.icon}
                    onChange={(e) => setItem({ ...item, icon: e.target.value as ContactIcon })}
                    options={ICON_OPTIONS}
                  />
                </FormField>
              </div>
              <FormField label="Value">
                <Input
                  value={item.value}
                  onChange={(e) => setItem({ ...item, value: e.target.value })}
                />
              </FormField>
              <FormField label="Link" hint="Optional — e.g. tel:+8801714039409.">
                <Input
                  value={item.link ?? ""}
                  onChange={(e) => setItem({ ...item, link: e.target.value })}
                />
              </FormField>
            </>
          )}
        />
      </SectionCard>

      <SectionCard title="Location" description="Store address and map link.">
        <FormField label="Address">
          <Textarea
            rows={2}
            value={content.location.address}
            onChange={(e) => update({ location: { ...content.location, address: e.target.value } })}
          />
        </FormField>
        <FormField label="Map URL" hint="Optional — Google Maps link or embed URL.">
          <Input
            value={content.location.mapUrl}
            onChange={(e) => update({ location: { ...content.location, mapUrl: e.target.value } })}
          />
        </FormField>
      </SectionCard>

      <SectionCard title="Social Links" description="Social media profiles shown on the contact page.">
        <Repeater
          label="Links"
          items={content.socialLinks.items}
          onChange={(items) => update({ socialLinks: { items } })}
          makeItem={() => ({ platform: "", url: "", enabled: true })}
          getEnabled={(item) => item.enabled}
          applyEnabled={(item, enabled) => ({ ...item, enabled })}
          renderItem={(item, setItem) => (
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Platform">
                <Input
                  value={item.platform}
                  placeholder="e.g. Facebook"
                  onChange={(e) => setItem({ ...item, platform: e.target.value })}
                />
              </FormField>
              <FormField label="URL">
                <Input
                  value={item.url}
                  onChange={(e) => setItem({ ...item, url: e.target.value })}
                />
              </FormField>
            </div>
          )}
        />
      </SectionCard>

      <SectionCard title="Contact CTA" description="Closing call-to-action block.">
        <FormField label="Heading">
          <Input
            value={content.contactCta.heading}
            onChange={(e) => update({ contactCta: { ...content.contactCta, heading: e.target.value } })}
          />
        </FormField>
        <FormField label="Description">
          <Textarea
            rows={2}
            value={content.contactCta.description}
            onChange={(e) => update({ contactCta: { ...content.contactCta, description: e.target.value } })}
          />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="CTA text">
            <Input
              value={content.contactCta.cta.label}
              onChange={(e) =>
                update({ contactCta: { ...content.contactCta, cta: { ...content.contactCta.cta, label: e.target.value } } })
              }
            />
          </FormField>
          <FormField label="CTA URL">
            <Input
              value={content.contactCta.cta.url}
              onChange={(e) =>
                update({ contactCta: { ...content.contactCta, cta: { ...content.contactCta.cta, url: e.target.value } } })
              }
            />
          </FormField>
        </div>
      </SectionCard>
    </div>
  );
}