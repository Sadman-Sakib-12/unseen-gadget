import { NextResponse } from "next/server";
import { readJson } from "@unseen-gadget/cms-data/writer";
import type { CmsPage } from "@unseen-gadget/cms-data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const pages = await readJson<CmsPage[]>("pages.json");
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (slug) {
    const page = pages.find((p) => p.slug === slug);
    if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });
    return NextResponse.json(page);
  }
  return NextResponse.json(pages);
}