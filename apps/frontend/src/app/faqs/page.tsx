import Link from "next/link";
import { ChevronRight, HelpCircle, Phone, Mail } from "lucide-react";

const cx = "mx-auto w-full max-w-[1320px] px-4";

const categories = [
  {
    label: "Orders & Payment",
    color: "bg-blue-50 text-blue-600",
    faqs: [
      {
        q: "How can I place an order?",
        a: "Browse our products, select what you want, and click 'Add to Cart'. Then proceed to checkout and fill in your delivery details.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept cash on delivery, bKash, Nagad, Rocket, and bank transfers. All online payments are processed securely.",
      },
    ],
  },
  {
    label: "Delivery",
    color: "bg-emerald-50 text-emerald-600",
    faqs: [
      {
        q: "How long does delivery take?",
        a: "Same-day delivery in Dhaka. For other areas, delivery typically takes 1–3 business days across Bangladesh.",
      },
      {
        q: "Do you deliver nationwide?",
        a: "Yes, we deliver to all 64 districts across Bangladesh through reliable courier partners.",
      },
    ],
  },
  {
    label: "Returns & Warranty",
    color: "bg-violet-50 text-violet-600",
    faqs: [
      {
        q: "Do you offer warranty on products?",
        a: "Yes, all our products come with official brand warranty. The warranty period varies by product and brand.",
      },
      {
        q: "What is your return policy?",
        a: "We have a 7-day return policy for defective products. The product must be in original condition with all accessories.",
      },
    ],
  },
  {
    label: "Product Authenticity",
    color: "bg-orange-50 text-orange-600",
    faqs: [
      {
        q: "Are all products genuine?",
        a: "Yes, we guarantee 100% authentic products sourced directly from authorized distributors and official brands.",
      },
      {
        q: "Can I verify product authenticity?",
        a: "Absolutely. All our products come with manufacturer serial numbers and warranty cards that can be verified.",
      },
    ],
  },
];

export default function FAQsPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white">
        <div className={cx}>
          <nav className="flex items-center gap-1.5 py-3 text-xs text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900">FAQs</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
        <div className={`${cx} text-center`}>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400">
            <HelpCircle className="h-3.5 w-3.5" />
            Help Center
          </div>
          <h1 className="mt-3 text-2xl font-bold text-white">Frequently Asked Questions</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-400">
            Find quick answers to the most common questions about shopping at Unseen Gadget.
          </p>
        </div>
      </div>

      <div className={`${cx} py-10`}>
        <div className="grid gap-6 lg:grid-cols-2">
          {categories.map((cat) => (
            <div key={cat.label} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${cat.color}`}>
                  {cat.label}
                </span>
              </div>
              <div className="space-y-4">
                {cat.faqs.map((faq) => (
                  <div key={faq.q} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <p className="flex items-start gap-2 text-sm font-semibold text-gray-900">
                      <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                      {faq.q}
                    </p>
                    <p className="mt-2 pl-6 text-xs leading-relaxed text-gray-600">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="text-white">
              <h2 className="text-lg font-bold">Still have questions?</h2>
              <p className="mt-1 text-sm text-blue-200">
                Our team is available 10 AM – 10 PM, 7 days a week to help you out.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:items-end sm:justify-center">
              <a
                href="tel:+8801714039409"
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                <Phone className="h-4 w-4" /> Call Us
              </a>
              <a
                href="mailto:support@unseengadget.com"
                className="flex items-center gap-2 rounded-xl bg-blue-500/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500/50"
              >
                <Mail className="h-4 w-4" /> Email Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
