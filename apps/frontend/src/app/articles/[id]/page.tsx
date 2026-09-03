"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Clock, User, BookOpen, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

interface Article {
  id: string;
  title: string;
  slug: string;
  category?: string;
  excerpt?: string;
  content?: string;
  author?: string;
  featuredImage?: string;
  createdAt: string;
}

export default function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    apiRequest(`/article/${id}`)
      .then((res) => {
        setArticle(res.data);
      })
      .catch(() => {
        setArticle(null);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;

    apiRequest("/article")
      .then((res) => {
        const all = res.data || [];
        setRelated(all.filter((a: Article) => a.id !== id).slice(0, 3));
      })
      .catch(() => {});
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container-gadget py-8 text-center">
        <p className="text-muted-foreground">Article not found.</p>
        <Link href="/blog" className="btn-primary mt-4 inline-flex items-center gap-1">
          Back to Blog <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="border-b border-border">
        <div className="container-gadget">
          <nav className="flex items-center gap-1.5 py-3 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-primary">Home</Link>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <Link href="/blog" className="transition-colors hover:text-primary">Blog</Link>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className="line-clamp-1 text-foreground">{article.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-gadget py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <article className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                <Tag className="h-3 w-3" /> {article.category || "Blog"}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> {new Date(article.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" /> {article.author || "Admin"}
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-bold leading-snug text-foreground">
              {article.title}
            </h1>

            <div className="mt-5 overflow-hidden rounded-2xl bg-muted">
              {article.featuredImage ? (
                <img src={article.featuredImage} alt={article.title} className="h-auto w-full object-cover" />
              ) : (
                <div className="flex aspect-video items-center justify-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground" strokeWidth={1.2} />
                </div>
              )}
            </div>

            <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
              {article.excerpt && <p className="font-medium text-foreground">{article.excerpt}</p>}
              {article.content ? (
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              ) : (
                <>
                  <p>
                    This is a detailed article about {article.title.toLowerCase()}.
                    In this article, we cover all the important aspects you need to know before making a
                    purchase decision. Our team at Unseen Gadget has researched thoroughly to bring you
                    the most accurate and up-to-date information.
                  </p>
                  <p>
                    We hope this guide helps you make an informed decision. If you have any questions or
                    need further clarification, feel free to contact our support team. We&rsquo;re always
                    here to help you find the best products that fit your needs and budget.
                  </p>
                </>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
              <span className="text-xs font-semibold text-foreground">Share this article:</span>
              {["Facebook", "Twitter", "Copy Link"].map((s) => (
                <button
                  key={s}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          </article>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 text-sm font-bold text-foreground">Related Articles</h3>
              <div className="space-y-4">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/articles/${rel.id}`}
                    className="group flex gap-3"
                  >
                    <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {rel.featuredImage && (
                        <img src={rel.featuredImage} alt={rel.title} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="line-clamp-2 text-xs font-medium text-foreground transition-colors group-hover:text-primary">
                        {rel.title}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">{new Date(rel.createdAt).toLocaleDateString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-800 p-5 text-center text-white">
              <BookOpen className="mx-auto h-8 w-8 text-white/60" />
              <p className="mt-2 text-sm font-bold">Looking for a product?</p>
              <p className="mt-1 text-xs text-white/70">Browse our full collection of genuine tech.</p>
              <Link
                href="/products"
                className="mt-4 inline-flex items-center gap-1 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-muted"
              >
                Shop Now <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
