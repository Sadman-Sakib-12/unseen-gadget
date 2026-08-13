import Link from "next/link";
import { ChevronRight, RefreshCw, Clock, Shield, CheckCircle, XCircle, Phone } from "lucide-react";

const cx = "mx-auto w-full max-w-[1320px] px-4";

const features = [
  {
    icon: Clock,
    title: "7-Day Returns",
    desc: "Return any defective product within 7 days of delivery — no questions asked.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: RefreshCw,
    title: "Easy Exchange",
    desc: "Exchange for a different color, variant, or model if available in stock.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Shield,
    title: "Full Refund",
    desc: "Get a complete refund if the product is defective or not as described.",
    color: "bg-violet-50 text-violet-600",
  },
];

const eligible = [
  "Product received is defective or damaged",
  "Wrong product delivered",
  "Product is not as described on the website",
  "Missing accessories or parts",
];

const notEligible = [
  "Physical damage caused by the customer",
  "Product opened and used without defect",
  "Return request made after 7 days",
  "Products with tampered serial numbers",
];

const steps = [
  { step: "Contact Us", desc: "Call or WhatsApp us at +8801714039409 with your order details and issue." },
  { step: "Verification", desc: "Our team will verify the issue and approve your return/exchange request." },
  { step: "Ship Back", desc: "We'll arrange a pickup or guide you on how to send the product back." },
  { step: "Resolution", desc: "Receive your replacement or refund within 3–5 business days." },
];

export default function ReturnsPage() {
  return (
    <>
      <div className="border-b border-gray-100 bg-white">
        <div className={cx}>
          <nav className="flex items-center gap-1.5 py-3 text-xs text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900">Return &amp; Exchange</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
        <div className={`${cx} text-center`}>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
            <RefreshCw className="h-3.5 w-3.5" />
            Returns Policy
          </div>
          <h1 className="mt-3 text-2xl font-bold text-white">Return &amp; Exchange Policy</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-400">
            We want you to be completely satisfied. If something is wrong, we&rsquo;ll make it right.
          </p>
        </div>
      </div>

      <div className={`${cx} py-10 space-y-8`}>
        {/* Feature cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm text-center">
              <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${f.color}`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Eligible / Not eligible */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-green-100 bg-green-50 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
              <CheckCircle className="h-4 w-4 text-green-600" /> Eligible for Return
            </h3>
            <ul className="space-y-2.5">
              {eligible.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-gray-700">
                  <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
              <XCircle className="h-4 w-4 text-red-500" /> Not Eligible for Return
            </h3>
            <ul className="space-y-2.5">
              {notEligible.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-gray-700">
                  <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Process steps */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-sm font-bold text-gray-900">How the Return Process Works</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="absolute left-5 top-5 hidden h-0.5 w-full bg-gray-100 lg:block" />
                )}
                <div className="relative flex flex-col gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{s.step}</p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="flex items-center gap-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20">
            <Phone className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">Need help with a return?</p>
            <p className="mt-0.5 text-xs text-blue-200">
              Call us at{" "}
              <a href="tel:+8801714039409" className="font-semibold text-white hover:underline">
                +8801714039409
              </a>{" "}
              — available 10 AM to 10 PM, 7 days a week.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
