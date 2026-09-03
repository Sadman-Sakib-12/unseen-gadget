"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, BookOpen, Clock, User, ArrowRight } from "lucide-react";
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
  publishedAt?: string;
  createdAt: string;
}

export default function BlogPage() {
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
    <>
      <div className="border-b border-border">
        <div className="container-gadget">
          <nav className="flex items-center gap-1.5 py-3 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-primary">{t("shop.breadcrumbHome")}</Link>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className="text-foreground">{t("blog.breadcrumb")}</span>
          </nav>
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary-800 via-primary to-primary-600 py-12">
        <div className="container-gadget text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
            <BookOpen className="h-3.5 w-3.5" />
            {t("blog.kicker")}
          </div>
          <h1 className="mt-3 text-2xl font-bold text-white">{t("blog.title")}</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/70">
            {t("blog.hint")}
          </p>
        </div>
      </div>

      <div className="container-gadget py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : list.length > 0 ? (
          <>
            <Link
              href={`/articles/${list[0].id}`}
              className="group mb-8 grid overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md sm:grid-cols-2"
            >
              <div className="aspect-video overflow-hidden bg-muted sm:aspect-auto">
                {list[0].featuredImage ? (
                  <img
                    src={list[0].featuredImage}
                    alt={list[0].title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full min-h-[200px] items-center justify-center">
                    <BookOpen className="h-14 w-14 text-muted-foreground" strokeWidth={1.2} />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center p-6">
                <span className="inline-flex w-fit items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                  {t("blog.featured")}
                </span>
                <h2 className="mt-3 text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                  {list[0].title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {list[0].excerpt}
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" /> {list[0].author || "Admin"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {new Date(list[0].createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.slice(1).map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.id}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary hover:shadow-md"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-muted">
                    {article.featuredImage ? (
                      <img
                        src={article.featuredImage}
                        alt={article.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="h-10 w-10 text-muted-foreground" strokeWidth={1.2} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <span className="inline-flex w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {article.category || "Blog"}
                    </span>
                    <h3 className="mt-2 text-sm font-semibold text-foreground line-clamp-2 transition-colors group-hover:text-primary">
                      {article.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" /> {article.author || "Admin"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card py-20 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground" strokeWidth={1.2} />
            <p className="mt-3 text-sm font-medium text-foreground">{t("blog.empty")}</p>
            <Link href="/products" className="btn-primary mt-4 rounded-xl">
              {t("common.startShopping")} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
