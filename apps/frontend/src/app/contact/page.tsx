import { Mail, Phone, MapPin, Clock } from "lucide-react";

const info = [
  {
    icon: Phone,
    title: "Phone",
    lines: ["+8801714039409"],
    sub: "Available 10 AM – 10 PM",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["support@unseengadget.com"],
    sub: "We reply within 24 hours",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: MapPin,
    title: "Address",
    lines: ["Shop #84, Block C, Level 05", "Bashundhara City, Dhaka 1229"],
    sub: "Bangladesh",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: Clock,
    title: "Working Hours",
    lines: ["Sat – Thu: 10 AM – 10 PM", "Friday: 10 AM – 8 PM"],
    sub: "",
    color: "bg-orange-50 text-orange-600",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-400">
            Contact Us
          </span>
          <h1 className="mt-3 text-3xl font-bold text-white">Get in Touch</h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-gray-400">
            Have questions? We&rsquo;re here to help. Reach out through any channel below.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-10">
        <div className="mx-auto max-w-5xl px-4">
          {/* Info cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {info.map((item) => (
              <div
                key={item.title}
                className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">{item.title}</p>
                  {item.lines.map((l) => (
                    <p key={l} className="mt-0.5 text-xs text-gray-600">{l}</p>
                  ))}
                  {item.sub && <p className="mt-0.5 text-[11px] text-gray-400">{item.sub}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Send us a Message</h2>
            <p className="mt-1 text-xs text-gray-500">Fill in the form and we&rsquo;ll get back to you within 24 hours.</p>
            <form className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  placeholder="+880..."
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  placeholder="How can we help?"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Message</label>
                <textarea
                  rows={5}
                  className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="button"
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
