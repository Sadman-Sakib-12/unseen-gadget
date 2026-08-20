"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { SectionCard } from "./section-card";
import { Repeater } from "./repeater";
import type { ShopPageContent } from "@unseen-gadget/cms-data";

interface ShopEditorProps {
  content: ShopPageContent;
  onChange: (content: ShopPageContent) => void;
}

export function ShopEditor({ content, onChange }: ShopEditorProps) {
  const update = (patch: Partial<ShopPageContent>) => onChange({ ...content, ...patch });

  return (
    <div className="space-y-6">
      <SectionCard title="Hero" description="Eyebrow, heading, description, image and call-to-action buttons.">
        <FormField label="Eyebrow">
          <Input
            value={content.hero.eyebrow}
            onChange={(e) => update({ hero: { ...content.hero, eyebrow: e.target.value } })}
            placeholder="e.g. New & Authentic Tech"
          />
        </FormField>
        <FormField label="Heading" required>
          <Input
            value={content.hero.heading}
            onChange={(e) => update({ hero: { ...content.hero, heading: e.target.value } })}
          />
        </FormField>
        <FormField label="Description" required>
          <Textarea
            rows={3}
            value={content.hero.description}
            onChange={(e) => update({ hero: { ...content.hero, description: e.target.value } })}
          />
        </FormField>
        <FormField label="Hero image" hint="URL or image path.">
          <Input
            value={content.hero.image}
            onChange={(e) => update({ hero: { ...content.hero, image: e.target.value } })}
          />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Primary CTA label" required>
            <Input
              value={content.hero.primaryCta.label}
              onChange={(e) =>
                update({ hero: { ...content.hero, primaryCta: { ...content.hero.primaryCta, label: e.target.value } } })
              }
            />
          </FormField>
          <FormField label="Primary CTA URL" required>
            <Input
              value={content.hero.primaryCta.url}
              onChange={(e) =>
                update({ hero: { ...content.hero, primaryCta: { ...content.hero.primaryCta, url: e.target.value } } })
              }
            />
          </FormField>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Secondary CTA label" hint="Optional.">
            <Input
              value={content.hero.secondaryCta?.label ?? ""}
              onChange={(e) =>
                update({
                  hero: {
                    ...content.hero,
                    secondaryCta: { label: e.target.value, url: content.hero.secondaryCta?.url ?? "" },
                  },
                })
              }
            />
          </FormField>
          <FormField label="Secondary CTA URL" hint="Optional.">
            <Input
              value={content.hero.secondaryCta?.url ?? ""}
              onChange={(e) =>
                update({
                  hero: {
                    ...content.hero,
                    secondaryCta: { label: content.hero.secondaryCta?.label ?? "", url: e.target.value },
                  },
                })
              }
            />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard
        title="Featured Categories"
        description="Categories shown on the landing page, in display order."
      >
        <FormField label="Section title">
          <Input
            value={content.featuredCategories.title}
            onChange={(e) =>
              update({ featuredCategories: { ...content.featuredCategories, title: e.target.value } })
            }
          />
        </FormField>
        <FormField label="Description">
          <Textarea
            rows={2}
            value={content.featuredCategories.description}
            onChange={(e) =>
              update({ featuredCategories: { ...content.featuredCategories, description: e.target.value } })
            }
          />
        </FormField>
        <Repeater
          label="Category references"
          items={content.featuredCategories.items}
          onChange={(items) => update({ featuredCategories: { ...content.featuredCategories, items } })}
          makeItem={() => ({ categoryRef: "", order: 1, enabled: true })}
          getEnabled={(item) => item.enabled}
          applyEnabled={(item, enabled) => ({ ...item, enabled })}
          getOrder={(item) => item.order}
          applyOrder={(item, order) => ({ ...item, order })}
          renderItem={(item, setItem) => (
            <FormField label="Category reference">
              <Input
                value={item.categoryRef}
                placeholder="e.g. smartphones"
                onChange={(e) => setItem({ ...item, categoryRef: e.target.value })}
              />
            </FormField>
          )}
        />
      </SectionCard>

      <SectionCard
        title="Promotional Banner"
        description="A promotional strip shown on the landing page."
        enabled={content.promoBanner.enabled}
        onEnabledChange={(enabled) => update({ promoBanner: { ...content.promoBanner, enabled } })}
      >
        <FormField label="Title">
          <Input
            value={content.promoBanner.title}
            onChange={(e) => update({ promoBanner: { ...content.promoBanner, title: e.target.value } })}
          />
        </FormField>
        <FormField label="Description">
          <Textarea
            rows={2}
            value={content.promoBanner.description}
            onChange={(e) => update({ promoBanner: { ...content.promoBanner, description: e.target.value } })}
          />
        </FormField>
        <FormField label="Image" hint="URL or image path.">
          <Input
            value={content.promoBanner.image}
            onChange={(e) => update({ promoBanner: { ...content.promoBanner, image: e.target.value } })}
          />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="CTA label">
            <Input
              value={content.promoBanner.cta.label}
              onChange={(e) =>
                update({ promoBanner: { ...content.promoBanner, cta: { ...content.promoBanner.cta, label: e.target.value } } })
              }
            />
          </FormField>
          <FormField label="CTA URL">
            <Input
              value={content.promoBanner.cta.url}
              onChange={(e) =>
                update({ promoBanner: { ...content.promoBanner, cta: { ...content.promoBanner.cta, url: e.target.value } } })
              }
            />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard
        title="Featured Products"
        description="Products highlighted on the landing page, in display order."
      >
        <FormField label="Section title">
          <Input
            value={content.featuredProducts.title}
            onChange={(e) => update({ featuredProducts: { ...content.featuredProducts, title: e.target.value } })}
          />
        </FormField>
        <Repeater
          label="Product references"
          items={content.featuredProducts.items}
          onChange={(items) => update({ featuredProducts: { ...content.featuredProducts, items } })}
          makeItem={() => ({ productRef: "", order: 1, enabled: true })}
          getEnabled={(item) => item.enabled}
          applyEnabled={(item, enabled) => ({ ...item, enabled })}
          getOrder={(item) => item.order}
          applyOrder={(item, order) => ({ ...item, order })}
          renderItem={(item, setItem) => (
            <FormField label="Product reference">
              <Input
                value={item.productRef}
                placeholder="e.g. iphone-15-pro"
                onChange={(e) => setItem({ ...item, productRef: e.target.value })}
              />
            </FormField>
          )}
        />
      </SectionCard>

      <SectionCard title="Bottom CTA" description="Closing call-to-action section at the bottom of the page.">
        <FormField label="Heading">
          <Input
            value={content.bottomCta.heading}
            onChange={(e) => update({ bottomCta: { ...content.bottomCta, heading: e.target.value } })}
          />
        </FormField>
        <FormField label="Description">
          <Textarea
            rows={2}
            value={content.bottomCta.description}
            onChange={(e) => update({ bottomCta: { ...content.bottomCta, description: e.target.value } })}
          />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="CTA label">
            <Input
              value={content.bottomCta.cta.label}
              onChange={(e) =>
                update({ bottomCta: { ...content.bottomCta, cta: { ...content.bottomCta.cta, label: e.target.value } } })
              }
            />
          </FormField>
          <FormField label="CTA URL">
            <Input
              value={content.bottomCta.cta.url}
              onChange={(e) =>
                update({ bottomCta: { ...content.bottomCta, cta: { ...content.bottomCta.cta, url: e.target.value } } })
              }
            />
          </FormField>
        </div>
        <FormField label="Image / background" hint="URL or image path.">
          <Input
            value={content.bottomCta.image}
            onChange={(e) => update({ bottomCta: { ...content.bottomCta, image: e.target.value } })}
          />
        </FormField>
      </SectionCard>
    </div>
  );
}