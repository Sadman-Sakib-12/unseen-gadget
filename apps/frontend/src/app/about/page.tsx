import { Shield, Users, Zap, Star, MapPin, Phone, Mail } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Authenticity Guaranteed",
    desc: "Every product we sell is 100% genuine, sourced directly from authorized distributors.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Users,
    title: "Customer First",
    desc: "Your satisfaction is our top priority. We go above and beyond to exceed expectations.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Zap,
    title: "Fast & Reliable",
    desc: "Same-day delivery in Dhaka. Nationwide delivery in 1–3 business days.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: Star,
    title: "Best Prices",
    desc: "Competitive pricing without compromising quality. We match the best deals.",
    color: "bg-orange-50 text-orange-600",
  },
];

const stats = [
  { value: "10,000+", label: "Happy Customers" },
  { value: "5,000+", label: "Products" },
  { value: "2024", label: "Founded" },
  { value: "64+", label: "Districts Served" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-400">
            About Us
          </span>
          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Bangladesh&rsquo;s Trusted Tech Store
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-400">
            Unseen Gadget is your trusted source for premium gadgets and accessories in Bangladesh.
            Established in 2024, we deliver authentic products with warranty support and fast nationwide delivery.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 sm:grid-cols-4 sm:divide-y-0">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center py-8">
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                <span className="mt-1 text-xs text-gray-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Our Story</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600">
                <p>
                  Our journey began with a simple mission: to provide Bangladeshi customers with genuine,
                  high-quality gadgets at competitive prices. We saw a gap in the market — customers
                  struggling to find authentic products with proper warranty support.
                </p>
                <p>
                  Today, we serve customers across Dhaka and all 64 districts nationwide with fast delivery,
                  authentic products, and exceptional customer service — whether you shop online or visit us
                  in person at Bashundhara City.
                </p>
                <p>
                  At Unseen Gadget, quality is our hallmark. Our team meticulously evaluates each product
                  to ensure excellence, partnering exclusively with dependable suppliers.
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Our Mission</h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                To become Bangladesh&rsquo;s most trusted online gadget store by providing authentic products,
                competitive pricing, and outstanding customer service. We aim to make premium technology
                accessible to everyone across the country.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Our Location</p>
                    <p className="text-xs text-gray-600">Shop #84, Block C, Level 05, Bashundhara City, Dhaka 1229</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Phone</p>
                    <p className="text-xs text-gray-600">+8801714039409</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Email</p>
                    <p className="text-xs text-gray-600">support@unseengadget.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-xl font-bold text-gray-900">Our Values</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${v.color}`}>
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-gray-900">{v.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
