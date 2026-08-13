import Link from "next/link";
import { ChevronRight, BookOpen, Clock, User } from "lucide-react";
import articles from "@/data/articles.json";

const cx = "mx-auto w-full max-w-[1320px] px-4";

export default function BlogPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white">
        <div className={cx}>
          <nav className="flex items-center gap-1.5 py-3 text-xs text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900">Blog</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
        <div className={`${cx} text-center`}>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400">
            <BookOpen className="h-3.5 w-3.5" />
            Our Blog
          </div>
          <h1 className="mt-3 text-2xl font-bold text-white">Tech Tips & Buying Guides</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-400">
            Stay up to date with the latest tech news, product reviews, and buying guides from our team.
          </p>
        </div>
      </div>

      <div className={`${cx} py-8`}>
        {articles.length > 0 ? (
          <>
            {/* Featured article */}
            <Link
              href={`/articles/${articles[0].id}`}
              className="group mb-8 grid overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:shadow-lg sm:grid-cols-2"
            >
              <div className="aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 sm:aspect-auto">
                {(articles[0] as any).image ? (
                  <img
                    src={(articles[0] as any).image}
                    alt={articles[0].title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full min-h-[200px] items-center justify-center">
                    <BookOpen className="h-14 w-14 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center p-6">
                <span className="inline-flex w-fit items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600">
                  {articles[0].category}
                </span>
                <h2 className="mt-3 text-lg font-bold text-gray-900 group-hover:text-blue-600">
                  {articles[0].title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-3">
                  {articles[0].excerpt}
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" /> {articles[0].author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {articles[0].date}
                  </span>
                </div>
              </div>
            </Link>

            {/* Rest of articles */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.slice(1).map((article: any) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.id}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-blue-500 hover:shadow-md"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {article.image ? (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="h-10 w-10 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <span className="inline-flex w-fit rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                      {article.category}
                    </span>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600">
                      {article.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-gray-500 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="mt-auto flex items-center gap-3 pt-3 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" /> {article.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {article.date}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-20 text-center">
            <BookOpen className="h-10 w-10 text-gray-200" />
            <p className="mt-3 text-sm font-medium text-gray-500">Blog posts coming soon</p>
          </div>
        )}
      </div>
    </>
  );
}
