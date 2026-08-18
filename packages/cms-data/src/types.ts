/** Shared CMS data model used by both the admin app (editing) and the
 *  public storefront (rendering). Content is structured as blocks so it can
 *  be rendered safely without dangerouslySetInnerHTML. */

export type TextMark = "bold" | "italic" | "link";

export interface InlineText {
  text: string;
  marks?: TextMark[];
  url?: string;
}

export type ContentBlock =
  | { type: "heading"; level: 2 | 3 | 4; text: string }
  | { type: "paragraph"; text: InlineText[] }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "features"; items: { title: string; desc: string }[] }
  | { type: "quote"; text: string; cite?: string }
  | {
      type: "note";
      variant?: "info" | "warning" | "success";
      title?: string;
      text: string;
    }
  | { type: "table"; head?: string[]; rows: string[][] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "cta"; label: string; href: string }
  | {
      type: "contactRow";
      icon: "phone" | "mail" | "map" | "clock";
      label: string;
      value: string;
      sub?: string;
    }
  | { type: "divider" };

export interface CmsPage {
  slug: string;
  title: string;
  description?: string;
  blocks: ContentBlock[];
}

export interface FooterLink {
  key: string;
  label: string;
  href: string;
}

export interface FooterSection {
  key: string;
  titleKey: string;
  title: string;
  links: FooterLink[];
}

export interface FooterCms {
  sections: FooterSection[];
}

export interface Job {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  active: boolean;
}

export type PostStatus = "draft" | "published" | "archived";

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string | null;
  featuredImage: string | null;
  seoTitle?: string;
  seoDescription?: string;
  status: PostStatus;
  blocks: ContentBlock[];
}

export type PromotionIcon = "zap" | "tag" | "gift";

export interface Promotion {
  id: string;
  title: string;
  badge: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  icon: PromotionIcon;
  gradient: string;
  startDate: string | null;
  endDate: string | null;
  order: number;
  active: boolean;
}