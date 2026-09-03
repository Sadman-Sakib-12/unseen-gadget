"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  Phone,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

interface StoryItem {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  coverImage?: string | null;
  mainImage?: string | null;
  content: string;
  highlights: string[];
}

export default function StoryDetailsPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "welcome";

  const [story, setStory] = useState<StoryItem | null>(null);
  const [allStories, setAllStories] = useState<Record<string, StoryItem>>({});
  const [supportPhone, setSupportPhone] = useState<string>("");
  const [showrooms, setShowrooms] = useState<{ name: string; addr?: string; address?: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiRequest("/cms/stories").catch(() => ({ data: {} })),
      apiRequest("/cms/general").catch(() => ({ data: {} })),
      apiRequest("/cms/footer").catch(() => ({ data: {} })),
    ])
      .then(([storiesRes, genRes, footerRes]) => {
        if (storiesRes?.data && typeof storiesRes.data === "object") {
          setAllStories(storiesRes.data);
          if (storiesRes.data[slug]) {
            setStory(storiesRes.data[slug]);
          }
        }
        if (genRes?.data?.supportPhone || genRes?.data?.storePhone) {
          setSupportPhone(genRes.data.supportPhone || genRes.data.storePhone);
        }
        if (footerRes?.data?.showrooms && Array.isArray(footerRes.data.showrooms)) {
          setShowrooms(footerRes.data.showrooms);
        }
      })
      .catch((err) => {
        console.error("Failed to load story details:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const otherSlug = slug === "welcome" ? "apple-products" : "welcome";
  const otherStory = allStories[otherSlug] || null;

  if (loading) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-xl font-bold text-foreground">Story Not Found</h1>
        <p className="text-sm text-muted-foreground mt-1">
          This story page has not been configured in the admin panel yet.
        </p>
        <Link href="/" className="btn-primary mt-4 text-xs">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* ═══ Top Breadcrumbs ═══ */}
      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto flex max-w-[1440px] items-center gap-2 px-4 py-3 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>Brand Story</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-none">
            {story.title}
          </span>
        </div>
      </div>

      {/* ═══ Hero Header ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 sm:py-20 text-white border-b border-border/40">
        {story.coverImage && (
          <>
            <img
              src={story.coverImage}
              alt={story.title}
              className="absolute inset-0 h-full w-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
          </>
        )}
        <div className="relative mx-auto w-full max-w-[1440px] px-4">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 border border-primary/30 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-primary-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Official Brand Story &bull; Unseen Gadget</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              {story.title}
            </h1>

            <p className="text-sm sm:text-base leading-relaxed text-slate-300">
              {story.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ Main Content: 2-Column Story + Sidebar ═══ */}
      <main className="mx-auto max-w-[1440px] px-4 pt-10">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* ── Left / Main Content (8 cols) ── */}
          <div className="lg:col-span-8 space-y-8">
            {story.mainImage && (
              <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
                <img
                  src={story.mainImage}
                  alt={story.title}
                  className="h-64 sm:h-96 w-full object-cover transition duration-500 hover:scale-[1.01]"
                />
              </div>
            )}

            {/* Story Paragraphs */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground whitespace-pre-line">
                {story.content}
              </div>
            </div>

            {/* Key Takeaways Box */}
            {story.highlights && story.highlights.length > 0 && (
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 sm:p-8 space-y-4">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Key Highlights & Guarantees
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {story.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation to other story */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-muted/40 p-5">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Homepage
              </Link>
              <Link
                href={`/story/${otherSlug}`}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-700 transition-all"
              >
                Read: {otherStory.title} <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* ── Right Sidebar (4 cols) ── */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Hotline Card */}
            {supportPhone && (
              <div className="rounded-2xl border border-primary/40 bg-gradient-to-br from-card to-primary/5 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <Phone className="h-4 w-4" />
                  <span>Need Assistance? Call Hotline</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Have questions about genuine Apple gadgets, warranties, or order delivery?
                </p>
                <a
                  href={`tel:${supportPhone}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 text-xs sm:text-sm font-bold text-white shadow-sm transition-all hover:bg-primary-700"
                >
                  <Phone className="h-4 w-4" /> {supportPhone}
                </a>
              </div>
            )}

            {/* Showroom Addresses */}
            {showrooms.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Visit Our Showrooms
                </h3>

                <div className="space-y-3 text-xs leading-relaxed">
                  {showrooms.map((s, idx) => (
                    <div key={idx} className="rounded-xl border border-border bg-muted/30 p-3">
                      <p className="font-bold text-foreground">{s.name}</p>
                      <p className="text-muted-foreground mt-1">
                        {s.addr || s.address}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Story Card */}
            {otherStory && (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Related Story
                </span>
                <h4 className="text-sm font-bold text-foreground">{otherStory.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {otherStory.excerpt}
                </p>
                <Link
                  href={`/story/${otherSlug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline pt-1"
                >
                  Read Full Story <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
