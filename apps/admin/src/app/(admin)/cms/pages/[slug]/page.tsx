import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { PageEditor } from "@/features/cms/components/page-editor";
import type { CmsPageSlug } from "@unseen-gadget/types";

const META: Record<string, { title: string; description: string }> = {
  "delivery-return": { title: "Delivery & Return", description: "Delivery charges, steps, return rules and FAQs." },
  contact: { title: "Our Contacts", description: "Showrooms, Google map, hotline and contact form." },
  terms: { title: "Terms & Conditions", description: "Edit the public terms & conditions content." },
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