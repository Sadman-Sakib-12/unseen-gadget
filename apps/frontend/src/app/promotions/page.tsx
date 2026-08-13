import Link from "next/link";
import { ChevronRight, Tag, Zap, Gift } from "lucide-react";

const cx = "mx-auto w-full max-w-[1320px] px-4";

const promos = [
  {
    icon: Zap,
    badge: "Up to 20% OFF",
    title: "Apple Shopping Event",
    desc: "Hurry and grab massive discounts on all Apple devices. Limited time offer — shop before stocks run out!",
    href: "/brand/apple",
    cta: "Shop Apple Deals",
    gradient: "from-gray-900 to-gray-700",
    badgeColor: "bg-yellow-400 text-gray-900",
  },
  {
    icon: Tag,
    badge: "New Launch",
    title: "MacBook Air M5",
    desc: "Experience the next generation of performance. The new M5 chip delivers blazing-fast speed and all-day battery life.",
    href: "/category/computers/macbooks",
    cta: "Explore MacBooks",
    gradient: "from-blue-700 to-blue-500",
    badgeColor: "bg-white text-blue-700",
  },
  {
    icon: Gift,
    badge: "Sale On",
    title: "iPad Accessories Sale",
    desc: "Personalize your iPad with top-branded accessories. Cases, keyboards, pencils and more — all at great prices.",
    href: "/category/cases-protectors/ipad",
    cta: "Browse Accessories",
    gradient: "from-violet-700 to-violet-500",
    badgeColor: "bg-white text-violet-700",
  },
];

export default function PromotionsPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white">
        <div className={cx}>
          <nav className="flex items-center gap-1.5 py-3 text-xs text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900">Promotions</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 py-12">
        <div className={`${cx} text-center`}>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
            <Tag className="h-3.5 w-3.5" />
            Limited Time Offers
          </div>
          <h1 className="mt-3 text-2xl font-bold text-white">Current Promotions</h1>
          <p className="mt-1 text-sm text-red-100">
            Exclusive deals on the latest tech — don&rsquo;t miss out!
          </p>
        </div>
      </div>

      <div className={`${cx} py-10`}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {promos.map((promo) => (
            <div
              key={promo.title}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${promo.gradient} p-6 text-white`}
            >
              {/* Badge */}
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${promo.badgeColor}`}>
                {promo.badge}
              </span>

              {/* Icon bg */}
              <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <promo.icon className="h-6 w-6 text-white" />
              </div>

              <h3 className="mt-4 text-lg font-bold">{promo.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">{promo.desc}</p>

              <Link
                href={promo.href}
                className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-gray-900 transition hover:bg-gray-100"
              >
                {promo.cta} <ChevronRight className="h-3.5 w-3.5" />
              </Link>

              {/* Decorative circle */}
              <div className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/5" />
              <div className="pointer-events-none absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-white/5" />
            </div>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-8 text-center">
          <h2 className="text-lg font-bold text-gray-900">Never Miss a Deal</h2>
          <p className="mt-1 text-sm text-gray-500">Subscribe and be the first to know about our latest promotions.</p>
          <div className="mx-auto mt-4 flex max-w-md gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <button className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
