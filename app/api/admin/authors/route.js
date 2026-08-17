import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/admin-guard";
import { slugify } from "@/lib/slug";

export async function GET() {
  const denied = await adminGuard();
  if (denied) return denied;
  const authors = await prisma.author.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ authors });
}

export async function POST(request) {
  const denied = await adminGuard();
  if (denied) return denied;
  const body = await request.json().catch(() => ({}));
  const name = String(body.name || "").trim();
  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  const author = await prisma.author.create({
    data: {
      name,
      slug: slugify(body.slug || name),
      bio: String(body.bio || "").trim(),
      role: String(body.role || "").trim(),
      website: String(body.website || "").trim(),
      avatarId: body.avatarId || null,
    },
  });
  return NextResponse.json({ author });
}
