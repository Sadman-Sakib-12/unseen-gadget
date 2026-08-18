export type { Post } from "@unseen-gadget/cms-data";

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: string;
  updatedAt: string;
}