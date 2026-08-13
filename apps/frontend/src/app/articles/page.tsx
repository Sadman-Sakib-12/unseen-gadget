import articles from "@/data/articles.json";
import { ChevronRight, Heart } from "lucide-react";
import Link from "next/link";

export default function ArticlesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Our Articles</span>
        </nav>

        {}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Our Articles</h1>
          <p className="mt-1 text-sm text-gray-600">
            Stay updated with the latest tech news, buying guides, and tips.
          </p>
        </div>

        {}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article: any) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="group rounded-lg border border-gray-200 bg-white overflow-hidden transition-shadow hover:shadow-md"
            >
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400 text-xs">Article Image</span>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{article.category}</span>
                  <span>|</span>
                  <span>{article.date}</span>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600">
                  {article.title}
                </h3>
                <p className="mt-2 text-xs text-gray-500 line-clamp-2">{article.excerpt}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
                      <span className="text-xs font-medium text-gray-600">GB</span>
                    </div>
                    <span className="text-xs text-gray-500">Gadget BD</span>
                  </div>
                  <button className="text-gray-400 hover:text-blue-600">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
    </div>
  );
}
