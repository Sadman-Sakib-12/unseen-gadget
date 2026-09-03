import Link from "next/link";
import { Building2, Footprints, LayoutTemplate, Megaphone, FileText, Image, Sparkles, Briefcase, AlignLeft, Home, LayoutGrid } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

const pages = [
  { href: "/cms/categories", title: "Featured Categories", desc: "Manage Must-Have Selections, category icons, images, and ordering.", icon: LayoutGrid },
  { href: "/cms/brands", title: "Brands", desc: "Manage brand logos, names, and descriptions.", icon: Building2 },
  { href: "/cms/footer", title: "Footer", desc: "Manage footer link columns and labels.", icon: Footprints },
  { href: "/cms/pages", title: "Pages", desc: "Edit the content of your storefront pages.", icon: LayoutTemplate },
  { href: "/blog/posts", title: "Blog", desc: "Write and publish articles for your customers.", icon: FileText },
  { href: "/blog/banners", title: "Banners", desc: "Manage hero banners and promotional images.", icon: Image },
  { href: "/blog/stories", title: "Story Pages", desc: "Manage the 2 homepage brand stories and their dedicated details pages.", icon: Sparkles },
  { href: "/promotions", title: "Promotions", desc: "Manage discount campaigns, offers, and storefront promo cards.", icon: Megaphone },
  { href: "/cms/jobs", title: "Jobs", desc: "Manage open job positions shown on the Careers page.", icon: Briefcase },
  { href: "/blog/navbar", title: "Navbar", desc: "Manage the top navigation links of your storefront.", icon: AlignLeft },
  { href: "/blog/landing", title: "Home Page", desc: "Toggle visibility of homepage sections.", icon: Home },
];

export default function CmsHubPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Management"
        description="Edit the storefront content. Changes are saved to the backend."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="group rounded-xl border border-border bg-white p-5 shadow-sm transition-colors hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <page.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-gray-900 group-hover:text-primary">
              {page.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">{page.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}