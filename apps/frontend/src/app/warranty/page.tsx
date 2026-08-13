import Link from "next/link";
import { ChevronRight, Shield, CheckCircle, XCircle, Clock, Phone, Wrench } from "lucide-react";

const cx = "mx-auto w-full max-w-[1320px] px-4";

const covered = [
  "Manufacturing defects",
  "Hardware component failures",
  "Software or firmware issues",
  "Battery defects (capacity below 80% within warranty)",
  "Display or speaker malfunctions",
];

const notCovered = [
  "Physical damage from drops or impacts",
  "Water or liquid damage",
  "Unauthorized repairs or modifications",
  "Accidental damage",
  "Normal wear and tear",
];

const periods = [
  { product: "iPhones & iPads", period: "1 Year", provider: "Apple Official", color: "bg-blue-50 text-blue-700" },
  { product: "MacBooks & iMac", period: "1 Year", provider: "Apple Official", color: "bg-blue-50 text-blue-700" },
  { product: "Samsung Devices", period: "1 Year", provider: "Samsung Bangladesh", color: "bg-indigo-50 text-indigo-700" },
  { product: "Accessories", period: "6 Months", provider: "Brand Warranty", color: "bg-violet-50 text-violet-700" },
  { product: "Headphones & Audio", period: "6–12 Months", provider: "Brand Warranty", color: "bg-emerald-50 text-emerald-700" },
  { product: "Smartwatches", period: "1 Year", provider: "Brand Warranty", color: "bg-orange-50 text-orange-700" },
];

export default function WarrantyPage() {
  return (
    <>
      <div className="border-b border-gray-100 bg-white">
        <div className={cx}>
          <nav className="flex items-center gap-1.5 py-3 text-xs text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900">Warranty</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
        <div className={`${cx} text-center`}>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400">
            <Shield className="h-3.5 w-3.5" />
            Warranty Info
          </div>
          <h1 className="mt-3 text-2xl font-bold text-white">Official Warranty on All Products</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-400">
            Every product sold at Unseen Gadget comes with the official manufacturer warranty.
            Shop with confidence.
          </p>
        </div>
      </div>

      <div className={`${cx} py-10 space-y-8`}>
        {/* Covered / Not covered */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
              <CheckCircle className="h-4 w-4 text-green-600" /> What&rsquo;s Covered
            </h3>
            <ul className="space-y-2.5">
              {covered.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-gray-700">
                  <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
              <XCircle className="h-4 w-4 text-red-500" /> What&rsquo;s Not Covered
            </h3>
            <ul className="space-y-2.5">
              {notCovered.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-gray-700">
                  <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Warranty periods */}
        <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-sm font-bold text-gray-900">Warranty Periods by Product</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Product Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Warranty Period</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Provider</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {periods.map((row) => (
                  <tr key={row.product} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3.5">
                      <span className="text-xs font-medium text-gray-800">{row.product}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="flex items-center gap-1 text-xs text-gray-600">
                        <Clock className="h-3 w-3 text-gray-400" /> {row.period}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${row.color}`}>
                        {row.provider}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Claim process */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
          <h2 className="mb-5 flex items-center gap-2 text-sm font-bold text-gray-900">
            <Wrench className="h-4 w-4 text-blue-600" /> How to Claim Warranty
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { n: "1", title: "Contact Support", desc: "Call or message us with your order number and a description of the issue." },
              { n: "2", title: "Diagnosis", desc: "We'll assess the issue and determine if it falls under warranty coverage." },
              { n: "3", title: "Resolution", desc: "Receive a repair, replacement, or refund depending on the nature of the defect." },
            ].map((s) => (
              <div key={s.n} className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {s.n}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">{s.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{s.desc}</p>
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
            <p className="text-sm font-bold text-white">Warranty claim or product issue?</p>
            <p className="mt-0.5 text-xs text-blue-200">
              Reach our support team at{" "}
              <a href="tel:+8801714039409" className="font-semibold text-white hover:underline">
                +8801714039409
              </a>{" "}
              or{" "}
              <a href="mailto:support@unseengadget.com" className="font-semibold text-white hover:underline">
                support@unseengadget.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
