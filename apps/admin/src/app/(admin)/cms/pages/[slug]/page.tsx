import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { PageEditor } from "@/features/cms/components/page-editor";
import type { CmsPageSlug } from "@unseen-gadget/cms-data";

const META: Record<CmsPageSlug, { title: string; description: string }> = {
  shop: { title: "Shop Landing", description: "Hero content shown above the shop/product listing." },
  contact: { title: "Contact", description: "Contact info cards shown on the contact page." },
  "delivery-return": { title: "Delivery & Return", description: "Delivery charges, steps and return rules." },
  terms: { title: "Terms & Conditions", description: "Edit the public terms page content." },
  privacy: { title: "Privacy Policy", description: "Edit the public privacy policy content." },
};

export default async function CmsPageEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = META[slug as CmsPageSlug];
  if (!meta) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title={meta.title} description={meta.description} />

      <PageEditor slug={slug as CmsPageSlug} />
    </div>
  );
}