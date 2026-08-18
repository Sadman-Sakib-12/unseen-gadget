import { PageHeader } from "@/components/layout/page-header";
import { JobsManager } from "@/features/cms/components/jobs-manager";

export default function CmsJobsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Jobs"
        description="Manage open job positions shown on the public Careers page."
      />

      <JobsManager />
    </div>
  );
}