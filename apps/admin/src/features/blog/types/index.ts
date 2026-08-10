export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string | null;
  category: string;
  tags: string[];
  status: string;
  author: string;
  publishedAt: string | null;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: string;
  updatedAt: string;
}
