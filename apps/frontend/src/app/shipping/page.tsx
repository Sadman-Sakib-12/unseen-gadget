import Link from "next/link";
import { ChevronRight, Truck, Clock, MapPin, Package, CheckCircle } from "lucide-react";

const cx = "mx-auto w-full max-w-[1320px] px-4";

const features = [
  {
    icon: Truck,
    title: "Nationwide Delivery",
    desc: "We deliver to all 64 districts across Bangladesh through trusted courier partners.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Clock,
    title: "Same-Day in Dhaka",
    desc: "Order before 3 PM and receive your package the same day within Dhaka city.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: MapPin,
    title: "Live Tracking",
    desc: "Track your order in real-time from our warehouse to your doorstep.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: Package,
    title: "Safe Packaging",
    desc: "Every product is carefully packed to ensure it arrives in perfect condition.",
    color: "bg-orange-50 text-orange-600",
  },
];

const charges = [
  { zone: "Inside Dhaka City", time: "Same Day / Next Day", charge: "Free", highlight: true },
  { zone: "Dhaka Suburbs", time: "1–2 Business Days", charge: "৳60", highlight: false },
  { zone: "Divisional Cities", time: "1–3 Business Days", charge: "৳100", highlight: false },
  { zone: "District Towns", time: "2–4 Business Days", charge: "৳120", highlight: false },
  { zone: "Remote Areas", time: "3–5 Business Days", charge: "৳150–৳200", highlight: false },
];

const steps = [
  "Place your order online or call us at +8801714039409",
  "We confirm stock availability and process your order",
  "Order is packed and handed to our courier partner",
  "You receive an SMS with tracking details",
  "Order delivered to your doorstep",
];

export default function ShippingPage() {
  return (
    <>
      <div className="border-b border-gray-100 bg-white">
        <div className={cx}>
          <nav className="flex items-center gap-1.5 py-3 text-xs text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900">Shipping &amp; Delivery</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
        <div className={`${cx} text-center`}>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
            <Truck className="h-3.5 w-3.5" />
            Delivery Info
          </div>
          <h1 className="mt-3 text-2xl font-bold text-white">Shipping &amp; Delivery</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-400">
            Fast and reliable delivery across Bangladesh — with free delivery inside Dhaka.
          </p>
        </div>
      </div>

      <div className={`${cx} py-10 space-y-8`}>
        {/* Feature cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${f.color}`}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-gray-900">{f.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Delivery charges table */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-sm font-bold text-gray-900">Delivery Charges</h2>
            <p className="mt-0.5 text-xs text-gray-500">Charges vary by location</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Zone</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Estimated Time</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500">Charge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {charges.map((row) => (
                  <tr
                    key={row.zone}
                    className={row.highlight ? "bg-green-50" : "hover:bg-gray-50/50"}
                  >
                    <td className="px-6 py-3.5">
                      <span className="text-xs font-medium text-gray-800">{row.zone}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-xs text-gray-500">{row.time}</span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <span
                        className={`text-xs font-bold ${
                          row.highlight ? "text-emerald-600" : "text-gray-800"
                        }`}
                      >
                        {row.charge}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How it works */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-sm font-bold text-gray-900">How Delivery Works</h2>
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  {i + 1}
                </div>
                <p className="pt-0.5 text-xs leading-relaxed text-gray-600">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 text-center">
          <CheckCircle className="mx-auto h-6 w-6 text-blue-600" />
          <p className="mt-2 text-sm font-semibold text-gray-900">Free delivery on all orders inside Dhaka</p>
          <p className="mt-0.5 text-xs text-gray-500">No minimum order value required</p>
        </div>
      </div>
    </>
  );
}
