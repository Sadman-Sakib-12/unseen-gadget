"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import { BlockEditor } from "@/features/cms/components/block-editor";
import { SectionCard } from "./section-card";
import { Repeater } from "./repeater";
import type { DeliveryReturnPageContent, DeliveryStepIcon } from "@unseen-gadget/cms-data";

const STEP_ICON_OPTIONS: { value: DeliveryStepIcon; label: string }[] = [
  { value: "check", label: "Check" },
  { value: "package", label: "Package" },
  { value: "truck", label: "Truck" },
  { value: "home", label: "Home" },
];

const lineToItems = (value: string): string[] =>
  value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

const itemsToLines = (items: string[]): string => items.join("\n");

interface DeliveryReturnEditorProps {
  content: DeliveryReturnPageContent;
  onChange: (content: DeliveryReturnPageContent) => void;
}

export function DeliveryReturnEditor({ content, onChange }: DeliveryReturnEditorProps) {
  const update = (patch: Partial<DeliveryReturnPageContent>) => onChange({ ...content, ...patch });

  return (
    <div className="space-y-6">
      <SectionCard title="Hero" description="Heading and description at the top of the page.">
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

      <SectionCard title="Delivery" description="Delivery areas, charges, time and notes.">
        <FormField label="Delivery areas" hint="One area per line.">
          <Textarea
            rows={4}
            value={itemsToLines(content.delivery.areas)}
            onChange={(e) => update({ delivery: { ...content.delivery, areas: lineToItems(e.target.value) } })}
          />
        </FormField>
        <FormField label="Delivery charges">
          <Textarea
            rows={2}
            value={content.delivery.charges}
            onChange={(e) => update({ delivery: { ...content.delivery, charges: e.target.value } })}
          />
        </FormField>
        <FormField label="Delivery time">
          <Input
            value={content.delivery.time}
            onChange={(e) => update({ delivery: { ...content.delivery, time: e.target.value } })}
          />
        </FormField>
        <FormField label="Notes">
          <Textarea
            rows={3}
            value={content.delivery.notes}
            onChange={(e) => update({ delivery: { ...content.delivery, notes: e.target.value } })}
          />
        </FormField>
      </SectionCard>

      <SectionCard
        title="Delivery Process"
        description="Ordered steps from confirmation to delivery."
      >
        <Repeater
          label="Steps"
          items={content.deliveryProcess.steps}
          onChange={(steps) => update({ deliveryProcess: { steps } })}
          makeItem={() => ({ title: "", description: "", icon: "check" as DeliveryStepIcon, order: 1, enabled: true })}
          getEnabled={(item) => item.enabled}
          applyEnabled={(item, enabled) => ({ ...item, enabled })}
          getOrder={(item) => item.order}
          applyOrder={(item, order) => ({ ...item, order })}
          renderItem={(item, setItem) => (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Title">
                  <Input
                    value={item.title}
                    placeholder="e.g. Order Confirmed"
                    onChange={(e) => setItem({ ...item, title: e.target.value })}
                  />
                </FormField>
                <FormField label="Icon">
                  <Select
                    value={item.icon}
                    onChange={(e) => setItem({ ...item, icon: e.target.value as DeliveryStepIcon })}
                    options={STEP_ICON_OPTIONS}
                  />
                </FormField>
              </div>
              <FormField label="Description">
                <Textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) => setItem({ ...item, description: e.target.value })}
                />
              </FormField>
            </>
          )}
        />
      </SectionCard>

      <SectionCard title="Return Policy" description="Eligibility, window, conditions and refund information.">
        <FormField label="Eligibility">
          <Textarea
            rows={2}
            value={content.returnPolicy.eligibility}
            onChange={(e) => update({ returnPolicy: { ...content.returnPolicy, eligibility: e.target.value } })}
          />
        </FormField>
        <FormField label="Return window">
          <Input
            value={content.returnPolicy.returnWindow}
            onChange={(e) => update({ returnPolicy: { ...content.returnPolicy, returnWindow: e.target.value } })}
          />
        </FormField>
        <FormField label="Conditions" hint="One condition per line.">
          <Textarea
            rows={3}
            value={itemsToLines(content.returnPolicy.conditions)}
            onChange={(e) =>
              update({ returnPolicy: { ...content.returnPolicy, conditions: lineToItems(e.target.value) } })
            }
          />
        </FormField>
        <FormField label="Non-returnable items" hint="One item per line.">
          <Textarea
            rows={3}
            value={itemsToLines(content.returnPolicy.nonReturnable)}
            onChange={(e) =>
              update({ returnPolicy: { ...content.returnPolicy, nonReturnable: lineToItems(e.target.value) } })
            }
          />
        </FormField>
        <FormField label="Return process" hint="One step per line.">
          <Textarea
            rows={4}
            value={itemsToLines(content.returnPolicy.process)}
            onChange={(e) =>
              update({ returnPolicy: { ...content.returnPolicy, process: lineToItems(e.target.value) } })
            }
          />
        </FormField>
        <FormField label="Refund information">
          <Textarea
            rows={2}
            value={content.returnPolicy.refundInfo}
            onChange={(e) => update({ returnPolicy: { ...content.returnPolicy, refundInfo: e.target.value } })}
          />
        </FormField>
      </SectionCard>

      <SectionCard title="Important Notes" description="Extra rich-text notes shown on the page.">
        <BlockEditor
          blocks={content.importantNotes}
          onChange={(blocks) => update({ importantNotes: blocks })}
        />
      </SectionCard>
    </div>
  );
}