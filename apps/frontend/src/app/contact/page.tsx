"use client";

import { useEffect, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";

interface ShowroomBranch {
  name: string;
  address: string;
}

interface ContactPageData {
  mapEmbedUrl?: string;
  heading?: string;
  paragraphs?: string[];
  bengaliNote?: string;
  hotline?: {
    phone?: string;
    details?: string;
  };
  showrooms?: ShowroomBranch[];
  corporateHq?: {
    name?: string;
    address?: string;
  };
}

export default function ContactPage() {
  const [data, setData] = useState<ContactPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    apiRequest("/cms/pages/contact")
      .then((res) => {
        if (res.data) {
          const content = res.data.content || {};
          setData({
            mapEmbedUrl: content.mapEmbedUrl || "",
            heading: content.heading || res.data.title || "Contact Us",
            paragraphs: Array.isArray(content.paragraphs) ? content.paragraphs : (content.paragraphs ? [content.paragraphs] : []),
            bengaliNote: content.bengaliNote || "",
            hotline: content.hotline || null,
            showrooms: Array.isArray(content.showrooms) ? content.showrooms : [],
            corporateHq: content.corporateHq || null,
          });
        }
      })
      .catch((err) => {
        console.error("Failed to load contact data from CMS:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiRequest("/contact", {
        method: "POST",
        body: JSON.stringify(form),
      });
      toast.success("Thank you! Your message has been sent successfully.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-background py-6 sm:py-10">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 space-y-8">
        {/* ═══ 1. Google Map Embed at Top ═══ */}
        {data.mapEmbedUrl && (
          <div className="overflow-hidden rounded-2xl border border-border shadow-xs">
            <iframe
              src={data.mapEmbedUrl}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Shop Location"
              className="w-full"
            />
          </div>
        )}

        {/* ═══ 2. Narrative / Descriptions ═══ */}
        <div className="space-y-3">
          {data.heading && (
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {data.heading}
            </h1>
          )}

          {data.paragraphs?.map((p, idx) => (
            <p key={idx} className="text-sm leading-relaxed text-muted-foreground max-w-5xl">
              {p}
            </p>
          ))}

          {data.bengaliNote && (
            <p className="text-[13px] leading-relaxed text-muted-foreground/90 font-medium italic pt-1 max-w-5xl">
              {data.bengaliNote}
            </p>
          )}

          <hr className="my-6 border-border/80" />
        </div>

        {/* ═══ 3. Two Columns: Form & Info ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column: Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                placeholder=""
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Your Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                placeholder=""
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Subject
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                placeholder=""
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Your Message
              </label>
              <textarea
                rows={5}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs resize-none"
                placeholder=""
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" /> Send
                </>
              )}
            </button>
          </form>

          {/* Right Column: Showroom & Office Info */}
          <div className="lg:col-span-5 space-y-6 text-center md:text-center">
            {/* Hotline */}
            {data.hotline && (
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-foreground">
                  Hotline
                </h3>
                {data.hotline.phone && (
                  <p className="text-sm font-bold text-foreground">
                    {data.hotline.phone}
                  </p>
                )}
                {data.hotline.details && (
                  <p className="text-xs text-muted-foreground">
                    {data.hotline.details}
                  </p>
                )}
              </div>
            )}

            {/* Showroom 1, Showroom 2, etc. */}
            {data.showrooms?.map((branch, idx) => (
              <div key={idx} className="space-y-1">
                <h3 className="text-base font-extrabold text-foreground">
                  {branch.name}
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  {branch.address}
                </p>
              </div>
            ))}

            {/* Corporate HQ */}
            {data.corporateHq && (
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-foreground">
                  {data.corporateHq.name || "Corporate HQ"}
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  {data.corporateHq.address}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
