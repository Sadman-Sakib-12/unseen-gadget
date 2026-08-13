import articles from "@/data/articles.json";
import { ChevronRight, Clock, User, BookOpen, Tag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const cx = "mx-auto w-full max-w-[1320px] px-4";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = (articles as any[]).find((a) => a.id === parseInt(id));
  if (!article) notFound();

  const related = (articles as any[]).filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white">
        <div className={cx}>
          <nav className="flex items-center gap-1.5 py-3 text-xs text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/blog" className="hover:text-blue-600">Blog</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="line-clamp-1 text-gray-900">{article.title}</span>
          </nav>
        </div>
      </div>

      <div className={`${cx} py-8`}>
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main article */}
          <article className="lg:col-span-2">
            {/* Category + meta */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600">
                <Tag className="h-3 w-3" /> {article.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" /> {article.date}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <User className="h-3 w-3" /> {article.author}
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-bold leading-snug text-gray-900">
              {article.title}
            </h1>

            {/* Cover image */}
            <div className="mt-5 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
              {article.image ? (
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-auto w-full object-cover"
                />
              ) : (
                <div className="flex aspect-video items-center justify-center">
                  <BookOpen className="h-16 w-16 text-gray-300" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="prose-custom mt-6 space-y-4 text-sm leading-relaxed text-gray-700">
              <p className="font-medium text-gray-800">{article.excerpt}</p>
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
            <div className="mt-8 flex items-center gap-3 border-t border-gray-100 pt-6">
              <span className="text-xs font-semibold text-gray-500">Share this article:</span>
              {["Facebook", "Twitter", "Copy Link"].map((s) => (
                <button
                  key={s}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-blue-500 hover:text-blue-600"
                >
                  {s}
                </button>
              ))}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <h3 className="mb-4 text-sm font-bold text-gray-900">Related Articles</h3>
              <div className="space-y-4">
                {related.map((rel: any) => (
                  <Link
                    key={rel.id}
                    href={`/articles/${rel.id}`}
                    className="group flex gap-3"
                  >
                    <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200">
                      {rel.image && (
                        <img
                          src={rel.image}
                          alt={rel.title}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="line-clamp-2 text-xs font-medium text-gray-800 group-hover:text-blue-600">
                        {rel.title}
                      </p>
                      <p className="mt-0.5 text-[10px] text-gray-400">{rel.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-2xl bg-blue-600 p-5 text-center text-white">
              <BookOpen className="mx-auto h-8 w-8 text-blue-200" />
              <p className="mt-2 text-sm font-bold">Looking for a product?</p>
              <p className="mt-1 text-xs text-blue-200">Browse our full collection of genuine tech.</p>
              <Link
                href="/"
                className="mt-4 inline-block rounded-lg bg-white px-4 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Shop Now
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
