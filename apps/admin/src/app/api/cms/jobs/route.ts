import { NextResponse } from "next/server";
import { readJson, updateCollection } from "@unseen-gadget/cms-data/writer";
import type { Job } from "@unseen-gadget/cms-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const jobs = await readJson<Job[]>("jobs.json");
  return NextResponse.json(jobs);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Job;
  const job: Job = { ...body, id: body.id || `JOB-${Date.now().toString().slice(-6)}` };
  const next = await updateCollection<Job>("jobs.json", "create", job);
  return NextResponse.json({ item: job, items: next });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as Job;
  const next = await updateCollection<Job>("jobs.json", "update", body);
  return NextResponse.json({ item: body, items: next });
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const next = await updateCollection<Job>("jobs.json", "delete", undefined as never, id);
  return NextResponse.json({ items: next });
}