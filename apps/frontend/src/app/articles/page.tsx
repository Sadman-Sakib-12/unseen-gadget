"use client";

import { useState, useEffect } from "react";
import { ChevronRight, BookOpen, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { apiRequest } from "@/lib/api";

interface Article {
  id: string;
  title: string;
  slug: string;
  category?: string;
  excerpt?: string;
  author?: string;
  featuredImage?: string;
  createdAt: string;
}

export default function ArticlesPage() {
  const { t } = useTranslation();
  const [list, setList] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiRequest("/article")
      .then((res) => {
        setList(res.data || []);
      })
      .catch(() => {
        setList([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="container-gadget py-6">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-primary">{t("shop.breadcrumbHome")}</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">{t("articles.title")}</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t("articles.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("articles.hint")}</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary hover:shadow-md"
            >
              <div className="flex aspect-video items-center justify-center bg-muted">
                {article.featuredImage ? (
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <BookOpen className="h-10 w-10 text-muted-foreground" strokeWidth={1.2} />
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">
                    {article.category || "Blog"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="mt-2 text-sm font-semibold text-foreground line-clamp-2 transition-colors group-hover:text-primary">
                  {article.title}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{article.excerpt}</p>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                      GB
                    </span>
                    <span className="text-xs text-muted-foreground">{article.author || "Admin"}</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-primary">
                    {t("common.readMore")} <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
