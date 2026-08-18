import Link from "next/link";
import { FileText, Truck, Briefcase, LayoutTemplate } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

const pages = [
  { href: "/cms/pages/terms", title: "Terms & Conditions", desc: "Edit the public terms page content.", icon: FileText },
  { href: "/cms/pages/privacy", title: "Privacy Policy", desc: "Edit the public privacy policy content.", icon: FileText },
  { href: "/cms/pages/delivery-return", title: "Delivery & Return", desc: "Delivery charges, steps and return rules.", icon: Truck },
  { href: "/cms/pages/career", title: "Career", desc: "Career page content and perks.", icon: Briefcase },
  { href: "/cms/pages/contact", title: "Contact", desc: "Contact info cards shown on the contact page.", icon: FileText },
  { href: "/cms/pages/shop", title: "Shop Landing", desc: "Hero content shown above the shop listing.", icon: LayoutTemplate },
];

export default function CmsPagesHubPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pages"
        description="Edit the content of your storefront pages."
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