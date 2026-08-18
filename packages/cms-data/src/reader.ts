import footerData from "./data/footer.json";
import pagesData from "./data/pages.json";
import jobsData from "./data/jobs.json";
import postsData from "./data/posts.json";
import promotionsData from "./data/promotions.json";
import type { CmsPage, FooterCms, Job, Post, Promotion } from "./types";

export const getFooter = (): FooterCms => footerData as FooterCms;

export const getPages = (): CmsPage[] => pagesData as CmsPage[];

export const getPage = (slug: string): CmsPage | undefined =>
  (pagesData as CmsPage[]).find((p) => p.slug === slug);

export const getJobs = (): Job[] => jobsData as Job[];

export const getActiveJobs = (): Job[] =>
  (jobsData as Job[]).filter((j) => j.active);

export const getPosts = (): Post[] => postsData as Post[];

export const getPostBySlug = (slug: string): Post | undefined =>
  (postsData as Post[]).find((p) => p.slug === slug);

export const getPublishedPosts = (): Post[] =>
  (postsData as Post[])
    .filter((p) => p.status === "published")
    .sort(
      (a, b) =>
        new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime()
    );

export const getPromotions = (): Promotion[] =>
  (promotionsData as Promotion[])
    .filter((p) => p.active)
    .sort((a, b) => a.order - b.order);

export type {
  CmsPage,
  ContentBlock,
  FooterCms,
  FooterLink,
  FooterSection,
  InlineText,
  Job,
  Post,
  PostStatus,
  Promotion,
  PromotionIcon,
  TextMark,
} from "./types";