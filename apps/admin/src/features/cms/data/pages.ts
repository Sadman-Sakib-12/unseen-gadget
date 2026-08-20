import type { CmsPage, CmsPageSlug } from "@unseen-gadget/cms-data";

const endpoint = (slug: CmsPageSlug) => `/api/cms/pages/${slug}`;

/** CMS Pages data access boundary.
 *
 *  The UI only talks to this module. Today it hits the existing mock JSON
 *  API (GET/PUT /api/cms/pages/[slug]) which persists to pages.json.
 *  When a real backend lands, only this file changes — the editors stay. */
export async function getPage(slug: CmsPageSlug): Promise<CmsPage> {
  const res = await fetch(endpoint(slug), { cache: "no-store" });
  if (!res.ok) {
    throw new Error(res.status === 404 ? "Page not found" : "Failed to load page");
  }
  return (await res.json()) as CmsPage;
}

export async function savePage(page: CmsPage): Promise<CmsPage> {
  const res = await fetch(endpoint(page.slug), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(page),
  });
  if (!res.ok) {
    throw new Error("Failed to save page");
  }
  return (await res.json()) as CmsPage;
}