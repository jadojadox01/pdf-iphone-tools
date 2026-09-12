import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/admin-guard";
import { slugify } from "@/lib/slug";

export async function GET() {
  const denied = await adminGuard();
  if (denied) return denied;
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { guides: true } } },
  });
  return NextResponse.json({ tags });
}

export async function POST(request) {
  const denied = await adminGuard();
  if (denied) return denied;
  const body = await request.json().catch(() => ({}));
  const name = String(body.name || "").trim();
  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  const tag = await prisma.tag.create({
    data: { name, slug: slugify(body.slug || name) },
  });
  return NextResponse.json({ tag });
}
