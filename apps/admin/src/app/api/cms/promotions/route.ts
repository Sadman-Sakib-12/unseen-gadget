import { NextResponse } from "next/server";
import { readJson, updateCollection } from "@unseen-gadget/cms-data/writer";
import type { Promotion } from "@unseen-gadget/cms-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const promotions = await readJson<Promotion[]>("promotions.json");
  return NextResponse.json(promotions);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Promotion;
  const promo: Promotion = { ...body, id: body.id || `PROMO-${Date.now().toString().slice(-6)}` };
  const next = await updateCollection<Promotion>("promotions.json", "create", promo);
  return NextResponse.json({ item: promo, items: next });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as Promotion;
  const next = await updateCollection<Promotion>("promotions.json", "update", body);
  return NextResponse.json({ item: body, items: next });
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const next = await updateCollection<Promotion>("promotions.json", "delete", undefined as never, id);
  return NextResponse.json({ items: next });
}