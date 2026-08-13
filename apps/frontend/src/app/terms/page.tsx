import Link from "next/link";
import { ChevronRight, FileText, ShoppingBag, CreditCard, AlertTriangle, Scale } from "lucide-react";

const cx = "mx-auto w-full max-w-[1320px] px-4";

const sections = [
  {
    icon: FileText,
    title: "Acceptance of Terms",
    color: "bg-blue-50 text-blue-600",
    content:
      "By accessing or using our website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.",
  },
  {
    icon: ShoppingBag,
    title: "Products & Pricing",
    color: "bg-emerald-50 text-emerald-600",
    content:
      "All products are subject to availability. We reserve the right to discontinue any product at any time. Prices are subject to change without notice. We make every effort to display accurate product information and pricing.",
  },
  {
    icon: CreditCard,
    title: "Orders & Payments",
    color: "bg-violet-50 text-violet-600",
    content:
      "By placing an order, you confirm the information provided is accurate. We reserve the right to refuse or cancel any order for reasons including product availability, errors in pricing, or suspected fraud.",
  },
  {
    icon: AlertTriangle,
    title: "Limitation of Liability",
    color: "bg-orange-50 text-orange-600",
    content:
      "Unseen Gadget shall not be liable for any indirect, incidental, special, or consequential damages arising from the use or inability to use our products or services.",
  },
  {
    icon: Scale,
    title: "Governing Law",
    color: "bg-pink-50 text-pink-600",
    content:
      "These Terms shall be governed by and construed in accordance with the laws of Bangladesh. Any disputes shall be resolved through the courts of Dhaka, Bangladesh.",
  },
];

export default function TermsPage() {
  return (
    <>
      <div className="border-b border-gray-100 bg-white">
        <div className={cx}>
          <nav className="flex items-center gap-1.5 py-3 text-xs text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900">Terms &amp; Conditions</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
        <div className={`${cx} text-center`}>
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-400">
            <FileText className="h-3.5 w-3.5" />
            Legal
          </div>
          <h1 className="mt-3 text-2xl font-bold text-white">Terms &amp; Conditions</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-400">
            Please read these terms carefully before using our website or placing an order.
          </p>
          <p className="mt-2 text-xs text-gray-500">Last updated: August 2026</p>
        </div>
      </div>

      <div className={`${cx} py-10`}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <div key={s.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-sm font-bold text-gray-900">{s.title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-gray-600">{s.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center">
          <p className="text-sm text-gray-600">
            By continuing to use our site, you accept these terms. For questions, contact{" "}
            <a href="mailto:support@unseengadget.com" className="font-semibold text-blue-600 hover:underline">
              support@unseengadget.com
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
