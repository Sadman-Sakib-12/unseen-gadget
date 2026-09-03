"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";

export interface HomeArticleItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
}

interface HomeArticlesSectionProps {
  articles: HomeArticleItem[];
  isLoading: boolean;
  containerClass?: string;
}

export function HomeArticlesSection({
  articles,
  isLoading,
  containerClass = "mx-auto w-full max-w-[1440px] px-4",
}: HomeArticlesSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="border-t border-border py-6">
      <div className={containerClass}>
        <h2 className="mb-4 text-[18px] font-bold text-foreground">{t("home.section.articles")}</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col overflow-hidden rounded-xl border border-border bg-card animate-pulse">
                <div className="aspect-[16/9] w-full bg-muted/70" />
                <div className="p-3 space-y-2">
                  <div className="h-3 w-20 rounded bg-muted/60" />
                  <div className="h-4 w-5/6 rounded bg-muted/80" />
                  <div className="h-3 w-full rounded bg-muted/50" />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {articles.slice(0, 4).map((a) => (
              <Link
                key={a.id}
                href={`/articles/${a.slug || a.id}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:shadow-md"
              >
                <div className="aspect-[16/9] overflow-hidden bg-muted">
                  {a.image ? (
                    <img
                      src={a.image}
                      alt={a.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20">
                      <span className="text-[11px] font-medium text-primary">{a.category}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <p className="text-[10px] text-muted-foreground">
                    {a.category}&nbsp;/&nbsp;{a.date}
                  </p>
                  <h3 className="mt-1.5 line-clamp-2 text-[12.5px] font-semibold text-foreground group-hover:text-primary">
                    {a.title}
                  </h3>
                  <p className="mt-1 line-clamp-3 text-[11.5px] leading-relaxed text-muted-foreground">
                    {a.excerpt}
                  </p>
                  <span className="mt-auto pt-2.5 text-[11.5px] font-semibold text-primary group-hover:underline">
                    {t("home.continueReading")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
