import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> | { nextauth: string[] } }
) {
  if (context?.params && typeof (context.params as any).then === "function") {
    context.params = await context.params;
  }
  return handler(req, context);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> | { nextauth: string[] } }
) {
  if (context?.params && typeof (context.params as any).then === "function") {
    context.params = await context.params;
  }
  return handler(req, context);
}


