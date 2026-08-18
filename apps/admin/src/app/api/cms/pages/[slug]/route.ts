import { NextResponse } from "next/server";
import { readJson, writeJson } from "@unseen-gadget/cms-data/writer";
import type { CmsPage } from "@unseen-gadget/cms-data";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const pages = await readJson<CmsPage[]>("pages.json");
  const page = pages.find((p) => p.slug === slug);
  if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });
  return NextResponse.json(page);
}

export async function PUT(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const body = (await request.json()) as CmsPage;
  const pages = await readJson<CmsPage[]>("pages.json");
  const index = pages.findIndex((p) => p.slug === slug);
  if (index === -1) return NextResponse.json({ error: "Page not found" }, { status: 404 });
  pages[index] = { ...body, slug };
  await writeJson("pages.json", pages);
  return NextResponse.json(pages[index]);
}