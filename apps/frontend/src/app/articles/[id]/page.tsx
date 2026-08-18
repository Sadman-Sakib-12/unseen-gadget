import { ChevronRight, Clock, User, BookOpen, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import articles from "@/data/articles.json";

interface Article {
  id: number;
  title: string;
  category: string;
  date: string;
  image?: string;
  excerpt?: string;
  author: string;
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = (articles as Article[]).find((a) => a.id === parseInt(id));
  if (!article) notFound();

  const related = (articles as Article[]).filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <>
      {/* Breadcrumb */}
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
          {/* Main article */}
          <article className="lg:col-span-2">
            {/* Category + meta */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                <Tag className="h-3 w-3" /> {article.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> {article.date}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" /> {article.author}
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-bold leading-snug text-foreground">
              {article.title}
            </h1>

            {/* Cover image */}
            <div className="mt-5 overflow-hidden rounded-2xl bg-muted">
              {article.image ? (
                <img src={article.image} alt={article.title} className="h-auto w-full object-cover" />
              ) : (
                <div className="flex aspect-video items-center justify-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground" strokeWidth={1.2} />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p className="font-medium text-foreground">{article.excerpt}</p>
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
            </div>

            {/* Share */}
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

          {/* Sidebar */}
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
                      {rel.image && (
                        <img src={rel.image} alt={rel.title} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="line-clamp-2 text-xs font-medium text-foreground transition-colors group-hover:text-primary">
                        {rel.title}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">{rel.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA */}
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
