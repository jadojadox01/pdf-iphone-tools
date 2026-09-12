import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/admin-guard";
import { buildGuideRecord, saveRevision, syncGuideRelations } from "@/lib/cms/guides";
import { getGuidePlanning, publishBlockReason } from "@/lib/cms/planning";

function includeGuide() {
  return {
    author: true,
    category: true,
    featuredImage: { select: { id: true, alt: true, caption: true } },
    tags: { include: { tag: true } },
    relatedTools: true,
    relatedFrom: { select: { toId: true } },
    revisions: { orderBy: { createdAt: "desc" }, take: 8, select: { id: true, title: true, createdAt: true } },
  };
}

export async function GET(request) {
  const denied = await adminGuard();
  if (denied) return denied;
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const authorId = searchParams.get("authorId") || "";
  const featured = searchParams.get("featured");
  const q = searchParams.get("q") || "";

  const where = {
    deletedAt: null,
    ...(status ? { status } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(authorId ? { authorId } : {}),
    ...(featured === "true" ? { featured: true } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q } },
            { slug: { contains: q } },
            { excerpt: { contains: q } },
          ],
        }
      : {}),
  };

  const guides = await prisma.guide.findMany({
    where,
    include: {
      author: true,
      category: true,
    },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ guides });
}

export async function POST(request) {
  const denied = await adminGuard();
  if (denied) return denied;
  const body = await request.json().catch(() => ({}));
  if (!String(body.title || "").trim()) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  const data = buildGuideRecord(body);
  if (data.status === "published") {
    const blocked = publishBlockReason(body, getGuidePlanning(body));
    if (blocked) return NextResponse.json({ error: blocked }, { status: 400 });
  }
  try {
    const guide = await prisma.guide.create({ data, include: includeGuide() });
    await syncGuideRelations(guide.id, {
      tags: body.tags || [],
      toolSlugs: body.relatedTools || [],
      relatedGuideIds: body.relatedGuideIds || [],
    });
    await saveRevision(guide);
    const saved = await prisma.guide.findUnique({ where: { id: guide.id }, include: includeGuide() });
    return NextResponse.json({ guide: saved });
  } catch (error) {
    if (String(error.message || "").includes("Unique constraint")) {
      return NextResponse.json({ error: "That slug is already used." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not save the guide." }, { status: 500 });
  }
}
