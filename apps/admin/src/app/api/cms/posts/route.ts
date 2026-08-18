import { NextResponse } from "next/server";
import { readJson, updateCollection } from "@unseen-gadget/cms-data/writer";
import type { Post } from "@unseen-gadget/cms-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = await readJson<Post[]>("posts.json");
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Post;
  const post: Post = { ...body, id: body.id || `POST-${Date.now().toString().slice(-4)}` };
  const next = await updateCollection<Post>("posts.json", "create", post);
  return NextResponse.json({ item: post, items: next });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as Post;
  const next = await updateCollection<Post>("posts.json", "update", body);
  return NextResponse.json({ item: body, items: next });
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const next = await updateCollection<Post>("posts.json", "delete", undefined as never, id);
  return NextResponse.json({ items: next });
}