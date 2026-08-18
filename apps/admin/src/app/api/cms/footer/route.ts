import { NextResponse } from "next/server";
import { readJson, writeJson } from "@unseen-gadget/cms-data/writer";
import type { FooterCms } from "@unseen-gadget/cms-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const footer = await readJson<FooterCms>("footer.json");
  return NextResponse.json(footer);
}

export async function PUT(request: Request) {
  const body = (await request.json()) as FooterCms;
  await writeJson("footer.json", body);
  return NextResponse.json(body);
}