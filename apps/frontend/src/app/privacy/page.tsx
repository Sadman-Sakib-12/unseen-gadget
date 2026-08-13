import Link from "next/link";
import { ChevronRight, Shield, Eye, Database, Mail, Lock } from "lucide-react";

const cx = "mx-auto w-full max-w-[1320px] px-4";

const sections = [
  {
    icon: Database,
    title: "Information We Collect",
    color: "bg-blue-50 text-blue-600",
    content:
      "We collect information you provide directly to us, such as when you create an account, place an order, or contact us for support. This includes your name, email address, phone number, and delivery address.",
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    color: "bg-violet-50 text-violet-600",
    content:
      "We use the information we collect to process your orders, communicate with you about your purchases, improve our services, and send you updates about new products and promotions.",
  },
  {
    icon: Lock,
    title: "Data Security",
    color: "bg-emerald-50 text-emerald-600",
    content:
      "We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure. All payment data is encrypted and never stored on our servers.",
  },
  {
    icon: Shield,
    title: "Your Rights",
    color: "bg-orange-50 text-orange-600",
    content:
      "You have the right to access, update, or delete your personal information at any time. You may also opt out of promotional communications by clicking the unsubscribe link in any email.",
  },
  {
    icon: Mail,
    title: "Contact Us",
    color: "bg-pink-50 text-pink-600",
    content:
      "If you have any questions about this Privacy Policy or how we handle your data, please contact us at support@unseengadget.com or call +8801714039409.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <div className="border-b border-gray-100 bg-white">
        <div className={cx}>
          <nav className="flex items-center gap-1.5 py-3 text-xs text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900">Privacy Policy</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
        <div className={`${cx} text-center`}>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400">
            <Shield className="h-3.5 w-3.5" />
            Privacy Policy
          </div>
          <h1 className="mt-3 text-2xl font-bold text-white">Your Privacy Matters</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-400">
            We are committed to protecting your personal information and being transparent about how we use it.
          </p>
          <p className="mt-2 text-xs text-gray-500">Last updated: August 2026</p>
        </div>
      </div>

      <div className={`${cx} py-10`}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-sm font-bold text-gray-900">{s.title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-gray-600">{s.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6 text-center">
          <p className="text-sm font-medium text-gray-700">
            Questions about your data? Reach us at{" "}
            <a href="mailto:support@unseengadget.com" className="font-semibold text-blue-600 hover:underline">
              support@unseengadget.com
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
