import { PageHeader } from "@/components/layout/page-header";
import { PageEditor } from "@/features/cms/components/page-editor";

const META: Record<string, { title: string; description: string }> = {
  terms: { title: "Terms & Conditions", description: "Edit the public terms page content." },
  privacy: { title: "Privacy Policy", description: "Edit the public privacy policy content." },
  "delivery-return": { title: "Delivery & Return", description: "Delivery charges, steps, and return rules." },
  career: { title: "Career", description: "Career page content and perks." },
  contact: { title: "Contact", description: "Contact info cards shown on the contact page." },
  shop: { title: "Shop Landing", description: "Hero content shown above the shop listing." },
};

export default async function CmsPageEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = META[slug] ?? { title: "Page", description: "Edit page content." };

  return (
    <div className="space-y-6">
      <PageHeader title={meta.title} description={meta.description} />

      <PageEditor slug={slug} />
    </div>
  );
}