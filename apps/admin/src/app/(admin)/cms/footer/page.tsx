import { PageHeader } from "@/components/layout/page-header";
import { FooterManager } from "@/features/cms/components/footer-manager";

export default function CmsFooterPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Footer"
        description="Manage the footer link columns shown across the public site."
      />
      <FooterManager />
    </div>
  );
}