"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Globe, Loader2, FileText } from "lucide-react";
import { apiRequest } from "@/lib/api";

interface TermSubsection {
  title?: string;
  paragraph?: string;
  items?: string[];
  footerParagraph?: string;
}

interface TermSection {
  id: string;
  heading: string;
  paragraph?: string;
  items?: string[];
  subsections?: TermSubsection[];
  hasDividerAfter?: boolean;
}

interface TermsPageData {
  title?: string;
  lastUpdated?: string;
  intro?: string;
  sections?: TermSection[];
  contactInfo?: {
    companyName?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
}

export default function TermsPage() {
  const [data, setData] = useState<TermsPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest("/cms/pages/terms")
      .then((res) => {
        if (res.data) {
          const content = res.data.content || {};
          setData({
            title: res.data.title || content.title || "Terms and Conditions",
            lastUpdated:
              content.lastUpdated ||
              (res.data.lastUpdated
                ? new Date(res.data.lastUpdated).toLocaleDateString("en-GB")
                : ""),
            intro: content.intro || res.data.description || "",
            sections: Array.isArray(content.sections) ? content.sections : [],
            contactInfo: content.contactInfo || null,
          });
        }
      })
      .catch((err) => {
        console.error("Failed to load terms from CMS:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data || (!data.intro && (!data.sections || data.sections.length === 0))) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center px-4 text-center">
        <FileText className="h-12 w-12 text-muted-foreground/50 mb-3" />
        <h1 className="text-xl font-bold text-foreground">Terms and Conditions</h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-md">
          Terms & conditions content is currently being updated in the admin panel. Please check back shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {data.title || "Terms and Conditions – Unseen Gadget"}
          </h1>
          <hr className="my-4 border-border/80" />
          {data.lastUpdated && (
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Last Update: {data.lastUpdated}
            </p>
          )}
          {data.intro && (
            <p className="text-[13.5px] leading-relaxed text-muted-foreground whitespace-pre-line">
              {data.intro}
            </p>
          )}
          <hr className="my-5 border-border/60" />
        </div>

        {/* Dynamic Sections from Admin API */}
        <div className="space-y-5">
          {data.sections?.map((sec, secIdx) => (
            <section key={sec.id || secIdx}>
              {sec.heading && (
                <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight mb-2">
                  {sec.heading}
                </h2>
              )}

              {sec.paragraph && (
                <p className="text-[13px] leading-relaxed text-muted-foreground whitespace-pre-line mb-2">
                  {sec.paragraph}
                </p>
              )}

              {sec.items && sec.items.length > 0 && (
                <ul className="list-disc list-outside pl-5 space-y-1.5 text-[13px] leading-relaxed text-muted-foreground mb-2">
                  {sec.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      {item.includes("click here") ? (
                        <>
                          {item.replace("click here", "")}{" "}
                          <Link href="/delivery-return" className="text-primary font-semibold hover:underline">
                            click here
                          </Link>
                        </>
                      ) : (
                        item
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {sec.subsections?.map((sub, idx) => (
                <div key={idx} className="mt-3 space-y-2">
                  {sub.title && (
                    <h3 className="text-[14px] font-bold text-foreground">
                      {sub.title}
                    </h3>
                  )}
                  {sub.paragraph && (
                    <p className="text-[13px] leading-relaxed text-muted-foreground whitespace-pre-line">
                      {sub.paragraph}
                    </p>
                  )}
                  {sub.items && sub.items.length > 0 && (
                    <ul className="list-disc list-outside pl-5 space-y-1.5 text-[13px] leading-relaxed text-muted-foreground">
                      {sub.items.map((item, itemIdx) => (
                        <li key={itemIdx}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              <hr className="my-5 border-border/60" />
            </section>
          ))}
        </div>

        {/* Contact Information Footer from Admin API */}
        {data.contactInfo && (
          <div className="pt-2">
            <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight mb-3">
              Contact Information
            </h2>
            <div className="space-y-1.5 text-[13px] text-muted-foreground">
              {data.contactInfo.companyName && (
                <p className="font-semibold text-foreground">{data.contactInfo.companyName}</p>
              )}
              {data.contactInfo.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{data.contactInfo.address}</span>
                </div>
              )}
              {data.contactInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <a href={`tel:${data.contactInfo.phone}`} className="text-primary hover:underline">
                    Phone: {data.contactInfo.phone}
                  </a>
                </div>
              )}
              {data.contactInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <a href={`mailto:${data.contactInfo.email}`} className="text-primary hover:underline">
                    Email: {data.contactInfo.email}
                  </a>
                </div>
              )}
              {data.contactInfo.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary shrink-0" />
                  <a
                    href={data.contactInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Website: {data.contactInfo.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
