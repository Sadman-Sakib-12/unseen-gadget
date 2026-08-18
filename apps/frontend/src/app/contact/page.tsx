"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import type { TranslationKey } from "@/lib/i18n";
import { useTranslation } from "@/hooks/use-translation";

const info: {
  icon: typeof Phone;
  title: TranslationKey;
  lines: string[];
  sub: string;
  color: string;
}[] = [
  {
    icon: Phone,
    title: "contact.phone",
    lines: ["+8801714039409"],
    sub: "Available 10 AM – 10 PM",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Mail,
    title: "contact.email",
    lines: ["support@unseengadget.com"],
    sub: "We reply within 24 hours",
    color: "bg-success/10 text-success",
  },
  {
    icon: MapPin,
    title: "contact.address",
    lines: ["Shop #84, Block C, Level 05", "Bashundhara City, Dhaka 1229"],
    sub: "Bangladesh",
    color: "bg-violet-500/10 text-violet-500",
  },
  {
    icon: Clock,
    title: "contact.hours",
    lines: ["Sat – Thu: 10 AM – 10 PM", "Friday: 10 AM – 8 PM"],
    sub: "",
    color: "bg-warning/10 text-warning",
  },
];

export default function ContactPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t("contact.sent"));
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 via-primary to-primary-600 py-12">
        <div className="mx-auto w-full max-w-4xl px-4 text-center">
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
            {t("contact.kicker")}
          </span>
          <h1 className="mt-3 text-3xl font-bold text-white">{t("contact.title")}</h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/70">
            {t("contact.subtitle")}
          </p>
        </div>
      </section>

      <section className="bg-muted/50 py-10">
        <div className="mx-auto w-full max-w-5xl px-4">
          {/* Info cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {info.map((item) => (
              <div
                key={item.title}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{t(item.title)}</p>
                  {item.lines.map((l) => (
                    <p key={l} className="mt-0.5 text-xs text-muted-foreground">{l}</p>
                  ))}
                  {item.sub && <p className="mt-0.5 text-[11px] text-muted-foreground/70">{item.sub}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h2 className="text-lg font-bold text-foreground">{t("contact.sendMessage")}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{t("contact.sendHint")}</p>
            <form onSubmit={submit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">{t("contact.name")}</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">{t("contact.emailField")}</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">{t("contact.phoneField")}</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-field"
                  placeholder="+880..."
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">{t("contact.subject")}</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="input-field"
                  placeholder="How can we help?"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-foreground">{t("contact.message")}</label>
                <textarea
                  rows={5}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input-field resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="btn-primary">
                  <Send className="h-4 w-4" />
                  {t("contact.sendBtn")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
