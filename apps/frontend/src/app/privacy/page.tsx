"use client";

import { Shield, Eye, Database, Mail, Lock } from "lucide-react";
import { PolicyPage } from "@/components/policy-page";

const sections = [
  {
    icon: Database,
    title: "Information We Collect",
    content:
      "We collect information you provide directly to us, such as when you create an account, place an order, or contact us for support. This includes your name, email address, phone number, and delivery address.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    content:
      "We use the information we collect to process your orders, communicate with you about your purchases, improve our services, and send you updates about new products and promotions.",
    color: "bg-violet-500/10 text-violet-500",
  },
  {
    icon: Lock,
    title: "Data Security",
    content:
      "We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure. All payment data is encrypted and never stored on our servers.",
    color: "bg-success/10 text-success",
  },
  {
    icon: Shield,
    title: "Your Rights",
    content:
      "You have the right to access, update, or delete your personal information at any time. You may also opt out of promotional communications by clicking the unsubscribe link in any email.",
    color: "bg-warning/10 text-warning",
  },
  {
    icon: Mail,
    title: "Contact Us",
    content:
      "If you have any questions about this Privacy Policy or how we handle your data, please contact us at support@unseengadget.com or call +8801714039409.",
    color: "bg-error/10 text-error",
  },
];

export default function PrivacyPage() {
  return (
    <PolicyPage
      kickerKey="policy.privacy.kicker"
      titleKey="policy.privacy.title"
      hintKey="policy.privacy.hint"
      updatedKey="policy.privacy.updated"
      breadcrumbKey="policy.privacy.breadcrumb"
      sections={sections}
      note={
        <>
          Questions about your data? Reach us at{" "}
          <a href="mailto:support@unseengadget.com" className="font-semibold text-primary hover:underline">
            support@unseengadget.com
          </a>
        </>
      }
    />
  );
}
