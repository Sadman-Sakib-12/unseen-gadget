import { PageHeader } from "@/components/layout/page-header";
import { PromotionsManager } from "@/features/cms/components/promotions-manager";

export default function CmsPromotionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Promotions"
        description="Manage the promotional cards shown on the public Promotions page."
      />
      <PromotionsManager />
    </div>
  );
}