"use client";

import { useEffect, useState } from "react";
import { Mail, MapPin, Loader2, ShieldCheck } from "lucide-react";
import { apiRequest } from "@/lib/api";

interface SubsectionItem {
  term?: string;
  text: string;
}

interface Subsection {
  title?: string;
  paragraph?: string;
  items?: SubsectionItem[];
  footerParagraph?: string;
  hasDividerAfter?: boolean;
}

interface SectionBlock {
  id: string;
  heading: string;
  subsections?: Subsection[];
}

interface PrivacyPageData {
  title?: string;
  lastUpdated?: string;
  intro?: string;
  sections?: SectionBlock[];
  contactInfo?: {
    email?: string;
    address?: string;
  };
}

export default function PrivacyPage() {
  const [data, setData] = useState<PrivacyPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest("/cms/pages/privacy")
      .then((res) => {
        if (res.data) {
          const content = res.data.content || {};
          setData({
            title: res.data.title || content.title || "Privacy Policy",
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
        console.error("Failed to load privacy policy from CMS API:", err);
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
        <ShieldCheck className="h-12 w-12 text-muted-foreground/50 mb-3" />
        <h1 className="text-xl font-bold text-foreground">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-md">
          Privacy policy content is currently being updated in the admin panel. Please check back shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          {data.lastUpdated && (
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Last Update: {data.lastUpdated}
            </p>
          )}
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {data.title || "Privacy Policy"}
          </h1>
          {data.intro && (
            <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground whitespace-pre-line">
              {data.intro}
            </p>
          )}
        </div>

        {/* Dynamic Sections from Admin API */}
        <div className="space-y-6">
          {data.sections?.map((sec, secIdx) => (
            <section key={sec.id || secIdx} className="pt-2">
              {sec.heading && (
                <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                  {sec.heading}
                </h2>
              )}

              <div className="mt-2.5 space-y-4">
                {sec.subsections?.map((sub, idx) => (
                  <div key={idx} className="space-y-2">
                    {sub.title && (
                      <h3 className="text-[14px] font-bold text-foreground">
                        {sub.title}
                      </h3>
                    )}

                    {sub.paragraph && (
                      <div className="text-[13px] leading-relaxed text-muted-foreground whitespace-pre-line">
                        {sub.paragraph}
                      </div>
                    )}

                    {sub.items && sub.items.length > 0 && (
                      <ul className="list-disc list-outside pl-5 space-y-1.5 text-[13px] leading-relaxed text-muted-foreground">
                        {sub.items.map((item, itemIdx) => (
                          <li key={itemIdx}>
                            {item.term ? (
                              <>
                                <strong className="font-bold text-foreground">
                                  {item.term}:
                                </strong>{" "}
                                {item.text}
                              </>
                            ) : (
                              item.text
                            )}
                          </li>
                        ))}
                      </ul>
                    )}

                    {sub.footerParagraph && (
                      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground whitespace-pre-line">
                        {sub.footerParagraph}
                      </p>
                    )}

                    {sub.hasDividerAfter && (
                      <hr className="my-5 border-border/60" />
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Dynamic Contact Us Details from Admin API */}
        {data.contactInfo && (data.contactInfo.email || data.contactInfo.address) && (
          <div className="mt-6 pt-2 space-y-2.5 text-[13px] text-muted-foreground">
            {data.contactInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>
                  <strong className="font-semibold text-foreground">Email:</strong>{" "}
                  <a
                    href={`mailto:${data.contactInfo.email}`}
                    className="text-primary hover:underline"
                  >
                    {data.contactInfo.email}
                  </a>
                </span>
              </div>
            )}
            {data.contactInfo.address && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong className="font-semibold text-foreground">Address:</strong>{" "}
                  {data.contactInfo.address}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
