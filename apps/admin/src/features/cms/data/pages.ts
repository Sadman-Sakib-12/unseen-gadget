import { apiRequest } from "@/lib/api";
import type { CmsPage, CmsPageSlug } from "@unseen-gadget/types";

/** CMS Pages data access boundary.
 *
 *  The UI only talks to this module. It calls the backend CMS API
 *  (GET/PUT /api/cms/pages/[slug]) via the shared apiRequest helper. */
export async function getPage(slug: CmsPageSlug): Promise<CmsPage> {
  const res = await apiRequest(`/cms/pages/${slug}`, { cache: "no-store" });
  return res.data as CmsPage;
}

export async function savePage(page: CmsPage): Promise<CmsPage> {
  const res = await apiRequest(`/cms/pages/${page.slug}`, {
    method: "PUT",
    body: JSON.stringify(page),
  });
  return res.data as CmsPage;
}
