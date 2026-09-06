/** Shared CMS data model used across admin, frontend and backend */

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

export type CmsPageSlug = "shop" | "contact" | "delivery-return" | "terms" | "privacy" | "warranty" | "shipping";

export type PageStatus = "draft" | "published";

export interface CmsSeo {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
}

export interface CtaLink {
  label: string;
  url: string;
}

export interface ShopHero {
  eyebrow: string;
  heading: string;
  description: string;
  image: string;
  primaryCta: CtaLink;
  secondaryCta?: CtaLink;
}

export interface ShopCategoryItem {
  categoryRef: string;
  order: number;
  enabled: boolean;
}

export interface ShopPromoBanner {
  title: string;
  description: string;
  image: string;
  cta: CtaLink;
  enabled: boolean;
}

export interface ShopProductItem {
  productRef: string;
  order: number;
  enabled: boolean;
}

export interface ShopBottomCta {
  heading: string;
  description: string;
  cta: CtaLink;
  image: string;
}

export interface ShopPageContent {
  type: "shop";
  hero: ShopHero;
  featuredCategories: { title: string; description: string; items: ShopCategoryItem[] };
  promoBanner: ShopPromoBanner;
  featuredProducts: { title: string; items: ShopProductItem[] };
  bottomCta: ShopBottomCta;
}

export interface ContactHero {
  heading: string;
  description: string;
}

export type ContactIcon = "phone" | "mail" | "map" | "clock";

export interface ContactItem {
  label: string;
  value: string;
  icon: ContactIcon;
  link?: string;
  enabled: boolean;
  order: number;
}

export interface SocialLink {
  platform: string;
  url: string;
  enabled: boolean;
}

export interface ContactPageContent {
  type: "contact";
  hero: ContactHero;
  contactInfo: { items: ContactItem[] };
  location: { address: string; mapUrl: string };
  socialLinks: { items: SocialLink[] };
  contactCta: { heading: string; description: string; cta: CtaLink };
}

export interface DeliveryHero {
  heading: string;
  description: string;
}

export interface DeliveryInfo {
  areas: string[];
  charges: string;
  time: string;
  notes: string;
}

export type DeliveryStepIcon = "check" | "package" | "truck" | "home";

export interface DeliveryStep {
  title: string;
  description: string;
  icon: DeliveryStepIcon;
  order: number;
  enabled: boolean;
}

export interface ReturnPolicy {
  eligibility: string;
  returnWindow: string;
  conditions: string[];
  nonReturnable: string[];
  process: string[];
  refundInfo: string;
}

export interface DeliveryReturnPageContent {
  type: "delivery-return";
  hero: DeliveryHero;
  delivery: DeliveryInfo;
  deliveryProcess: { steps: DeliveryStep[] };
  returnPolicy: ReturnPolicy;
  importantNotes: ContentBlock[];
}

export interface LegalPageContent {
  type: "terms" | "privacy" | "warranty" | "shipping";
  effectiveDate?: string;
}

export type CmsPageContent =
  | ShopPageContent
  | ContactPageContent
  | DeliveryReturnPageContent
  | LegalPageContent;

export interface CmsPage {
  slug: CmsPageSlug;
  title: string;
  description?: string;
  status: PageStatus;
  lastUpdated: string | null;
  seo: CmsSeo;
  blocks: ContentBlock[];
  content: CmsPageContent;
}

export interface FooterLink {
  key: string;
  label: string;
  href: string;
}

export interface FooterShowroom {
  name: string;
  addr: string;
}

export interface FooterSocials {
  facebook?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
  instagram?: string;
}

export interface FooterSection {
  key: string;
  titleKey: string;
  title: string;
  links: FooterLink[];
}

export interface FooterCms {
  sections: FooterSection[];
  showrooms?: FooterShowroom[];
  socials?: FooterSocials;
  copyright?: string;
  paymentMethods?: string[];
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
  _count?: {
    applications: number;
  };
}

export interface JobApplication {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone?: string | null;
  coverLetter?: string | null;
  resume?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
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

export interface LandingSectionMeta {
  id: string;
  title: string;
  isActive: boolean;
}

export interface WhyCard {
  title: string;
  desc: string;
}

export interface WhyChooseUsData {
  kicker?: string;
  title?: string;
  cards: WhyCard[];
}

export interface SeoTextSection {
  title?: string;
  paragraph1?: string;
  paragraph2?: string;
}

export interface SeoBrandStoryData {
  section1?: SeoTextSection;
  section2?: SeoTextSection;
}

export interface LandingCmsConfig {
  sections: LandingSectionMeta[];
  whyChooseUs?: WhyChooseUsData;
  seoStory?: SeoBrandStoryData;
}
