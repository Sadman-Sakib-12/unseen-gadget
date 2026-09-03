"use client";

import Link from "next/link";
import { ScrollText, ShieldCheck, Truck, Phone, Pencil } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";

const pages = [
  { href: "/cms/pages/delivery-return", title: "Delivery & Return", desc: "Delivery charges, steps, return rules and FAQs.", icon: Truck },
  { href: "/cms/pages/contact", title: "Contact", desc: "Showrooms, map, hotline and contact form.", icon: Phone },
  { href: "/cms/pages/terms", title: "Terms & Conditions", desc: "Edit the public terms & conditions content.", icon: ScrollText },
  { href: "/cms/pages/privacy", title: "Privacy Policy", desc: "Edit the public privacy policy content.", icon: ShieldCheck },
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
            className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Card className="h-full p-5 transition-colors group-hover:border-primary/40 group-hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <page.icon className="h-5 w-5" />
                </div>
                <span className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </span>
              </div>
              <h3 className="mt-3 text-sm font-bold text-gray-900 group-hover:text-primary">
                {page.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">{page.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}