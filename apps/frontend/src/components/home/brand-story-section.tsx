"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BrandStoryItem {
  title: string;
  paragraph1: string;
  paragraph2?: string;
  href: string;
}

export interface BrandStoryData {
  welcome: BrandStoryItem | null;
  apple: BrandStoryItem | null;
}

interface BrandStorySectionProps {
  data: BrandStoryData;
  containerClass?: string;
  readMoreLabel?: string;
}

export function BrandStorySection({
  data,
  containerClass = "mx-auto w-full max-w-[1440px] px-4",
  readMoreLabel = "Read More",
}: BrandStorySectionProps) {
  if (!data.welcome && !data.apple) return null;

  return (
    <section className="border-t border-border py-6">
      <div className={containerClass}>
        {/* Welcome Story */}
        {data.welcome && (
          <div>
            <h2 className="text-[15px] font-bold text-foreground">{data.welcome.title}</h2>
            <p className="mt-2 max-w-3xl text-[12.5px] leading-relaxed text-muted-foreground whitespace-pre-line">
              {data.welcome.paragraph1}
            </p>
            {data.welcome.paragraph2 && (
              <p className="mt-2 max-w-3xl text-[12.5px] leading-relaxed text-muted-foreground whitespace-pre-line">
                {data.welcome.paragraph2}
              </p>
            )}
            <Link
              href={data.welcome.href}
              aria-label={`${readMoreLabel} - ${data.welcome.title}`}
              className="btn-outline mt-3 !h-8 !px-3.5 !text-[11.5px] inline-flex items-center gap-1.5"
            >
              {readMoreLabel} <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        )}

        {/* Apple Products Story */}
        {data.apple && (
          <div className="mt-7">
            <h2 className="text-[15px] font-bold text-foreground">{data.apple.title}</h2>
            <p className="mt-2 max-w-3xl text-[12.5px] leading-relaxed text-muted-foreground whitespace-pre-line">
              {data.apple.paragraph1}
            </p>
            {data.apple.paragraph2 && (
              <p className="mt-2 max-w-3xl text-[12.5px] leading-relaxed text-muted-foreground whitespace-pre-line">
                {data.apple.paragraph2}
              </p>
            )}
            <Link
              href={data.apple.href}
              aria-label={`${readMoreLabel} - ${data.apple.title}`}
              className="btn-outline mt-3 !h-8 !px-3.5 !text-[11.5px] inline-flex items-center gap-1.5"
            >
              {readMoreLabel} <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
