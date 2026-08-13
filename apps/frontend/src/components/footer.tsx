import Link from "next/link";
import { Facebook, Twitter, Youtube, Linkedin } from "lucide-react";

const W = "mx-auto w-full max-w-[1320px] px-4";

const footerCols = {
  categories: {
    title: "Categories",
    links: [
      { label: "iPhones",             href: "/category/smartphones/iphones" },
      { label: "Macbook",             href: "/category/computers/macbooks" },
      { label: "iPhone Cases",        href: "/category/cases-protectors/iphone" },
      { label: "Computer and Laptop", href: "/category/computers/laptops" },
      { label: "Accessories",         href: "/category/accessories" },
    ],
  },
  help: {
    title: "Help",
    links: [
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Delivery & Return",  href: "/shipping" },
      { label: "Privacy Policy",     href: "/privacy" },
      { label: "Career",             href: "/careers" },
    ],
  },
  useful: {
    title: "Useful Links",
    links: [
      { label: "Our Blogs",         href: "/blog" },
      { label: "Our contacts",      href: "/contact" },
      { label: "Promotions",        href: "/promotions" },
      { label: "The Shop",          href: "/about" },
      { label: "Delivery & Return", href: "/returns" },
    ],
  },
};

const showrooms = [
  { name: "Showroom 01 (Main Branch)", addr: "Shop # 84, Block: C, Level: 05, Bashundhara City, Panthapath, Dhaka" },
  { name: "Showroom 02",               addr: "Shop # 115, Block: D, Level: 06, Bashundhara City, Panthapath, Dhaka" },
  { name: "Corporate Office",          addr: "House: 01, Main Road, Block: H,  Rampura-Banasree, Dhaka" },
];

const socials = [
  { Icon: Facebook, href: "https://facebook.com",  label: "Facebook",  color: "hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white" },
  { Icon: Twitter,  href: "https://twitter.com",   label: "Twitter",   color: "hover:bg-black hover:border-black hover:text-white" },
  { Icon: Youtube,  href: "https://youtube.com",   label: "YouTube",   color: "hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white" },
  { Icon: Linkedin, href: "https://linkedin.com",  label: "LinkedIn",  color: "hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white" },
];

const payments = ["VISA", "MasterCard", "PayPal", "bKash", "Nagad", "Rocket"];

export function Footer() {
  return (
    <footer className="bg-white text-gray-700">

      {/* ── Showroom row — GadgetBD style ─────────────────── */}
      <div className="border-t border-gray-200">
        <div className={`${W} py-6`}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {showrooms.map((s) => (
              <div key={s.name}>
                <p className="text-[13px] font-bold text-gray-900">{s.name}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-gray-500">{s.addr}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200" />

      {/* ── Main footer columns ───────────────────────────── */}
      <div className={`${W} py-8`}>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-[2fr_1fr_1fr_1fr_1.5fr]">

          {/* Brand + social */}
          <div className="col-span-2 lg:col-span-1">
            {/* Logo same style as navbar */}
            <Link href="/">
              <span className="text-[22px] font-black leading-none tracking-tight text-gray-900">
                <span className="text-blue-600">Unseen Gadget</span>bd
                <sup className="ml-[1px] text-[9px] font-bold text-gray-500">.com</sup>
              </span>
            </Link>

            <p className="mt-5 text-[12px] font-semibold text-gray-700">Subscribe us</p>
            <div className="mt-2 flex gap-2">
              {socials.map(({ Icon, href, label, color }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  className={`flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition ${color}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.values(footerCols).map((col) => (
            <div key={col.title}>
              <h3 className="text-[13px] font-semibold text-gray-900">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((lk) => (
                  <li key={lk.label}>
                    <Link href={lk.href}
                      className="text-[12.5px] text-gray-500 transition hover:text-blue-600"
                    >
                      {lk.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* App download — GadgetBD style */}
          <div>
            <h3 className="text-[13px] font-semibold text-gray-900">Download App on Mobile:</h3>
            <p className="mt-1 text-[11.5px] text-gray-400">Free Delivery on your first purchase</p>
            <div className="mt-3 flex flex-col gap-2">
              {/* Google Play */}
              <a href="#"
                className="flex h-10 w-[136px] items-center gap-2 rounded-md border border-gray-800 bg-gray-900 px-3 text-white transition hover:bg-gray-700"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-white">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.75.75 0 01-.61-.74V2.555a.75.75 0 01.609-.741zM14.85 13.06l2.302 2.302-8.937 5.108 6.635-7.41zm3.211-1.06a1.25 1.25 0 010 2l-1.96 1.121L13.584 12l2.517-3.121 1.96 1.121zM8.215 3.53l8.937 5.108-2.302 2.302-6.635-7.41z"/>
                </svg>
                <div className="flex flex-col leading-none">
                  <span className="text-[8px] text-gray-300 uppercase tracking-wide">GET IT ON</span>
                  <span className="text-[11px] font-semibold">Google Play</span>
                </div>
              </a>
              {/* App Store */}
              <a href="#"
                className="flex h-10 w-[136px] items-center gap-2 rounded-md border border-gray-800 bg-gray-900 px-3 text-white transition hover:bg-gray-700"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="flex flex-col leading-none">
                  <span className="text-[8px] text-gray-300 uppercase tracking-wide">Download on the</span>
                  <span className="text-[11px] font-semibold">App Store</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────── */}
      <div className="border-t border-gray-200 bg-white">
        <div className={`${W} flex flex-col items-center justify-between gap-3 py-4 sm:flex-row`}>
          <p className="text-[12px] text-gray-500">
            All rights reserved to Gadget BD &copy; 2013&ndash;{new Date().getFullYear()}
          </p>
          {/* Payment icons */}
          <div className="flex items-center gap-1.5">
            {payments.map((m) => (
              <span key={m}
                className="inline-flex h-6 items-center rounded border border-gray-200 bg-white px-2 text-[10px] font-bold text-gray-500"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
