"use client";

import { FileText, ShoppingBag, CreditCard, AlertTriangle, Scale } from "lucide-react";
import { PolicyPage } from "@/components/policy-page";

const sections = [
  {
    icon: FileText,
    title: "Acceptance of Terms",
    content:
      "By accessing or using our website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: ShoppingBag,
    title: "Products & Pricing",
    content:
      "All products are subject to availability. We reserve the right to discontinue any product at any time. Prices are subject to change without notice. We make every effort to display accurate product information and pricing.",
    color: "bg-success/10 text-success",
  },
  {
    icon: CreditCard,
    title: "Orders & Payments",
    content:
      "By placing an order, you confirm the information provided is accurate. We reserve the right to refuse or cancel any order for reasons including product availability, errors in pricing, or suspected fraud.",
    color: "bg-violet-500/10 text-violet-500",
  },
  {
    icon: AlertTriangle,
    title: "Limitation of Liability",
    content:
      "Unseen Gadget shall not be liable for any indirect, incidental, special, or consequential damages arising from the use or inability to use our products or services.",
    color: "bg-warning/10 text-warning",
  },
  {
    icon: Scale,
    title: "Governing Law",
    content:
      "These Terms shall be governed by and construed in accordance with the laws of Bangladesh. Any disputes shall be resolved through the courts of Dhaka, Bangladesh.",
    color: "bg-error/10 text-error",
  },
];

export default function TermsPage() {
  return (
    <PolicyPage
      kickerKey="policy.terms.kicker"
      titleKey="policy.terms.title"
      hintKey="policy.terms.hint"
      updatedKey="policy.terms.updated"
      breadcrumbKey="policy.terms.breadcrumb"
      sections={sections}
      note={
        <>
          By continuing to use our site, you accept these terms. For questions, contact{" "}
          <a href="mailto:support@unseengadget.com" className="font-semibold text-primary hover:underline">
            support@unseengadget.com
          </a>
        </>
      }
    />
  );
}