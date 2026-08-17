import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/admin-guard";
import { slugify } from "@/lib/slug";

export async function GET() {
  const denied = await adminGuard();
  if (denied) return denied;
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { guides: true } } },
  });
  return NextResponse.json({ categories });
}

export async function POST(request) {
  const denied = await adminGuard();
  if (denied) return denied;
  const body = await request.json().catch(() => ({}));
  const name = String(body.name || "").trim();
  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  const category = await prisma.category.create({
    data: {
      name,
      slug: slugify(body.slug || name),
      description: String(body.description || "").trim(),
      sortOrder: Number(body.sortOrder) || 0,
    },
  });
  return NextResponse.json({ category });
}
