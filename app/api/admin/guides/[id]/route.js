import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/admin-guard";
import { buildGuideRecord, robotsForStatus, saveRevision, syncGuideRelations } from "@/lib/cms/guides";
import { getGuidePlanning, publishBlockReason } from "@/lib/cms/planning";

function includeGuide() {
  return {
    author: true,
    category: true,
    featuredImage: { select: { id: true, alt: true, caption: true } },
    tags: { include: { tag: true } },
    relatedTools: { include: { tool: true } },
    relatedFrom: { select: { toId: true } },
    revisions: { orderBy: { createdAt: "desc" }, take: 8, select: { id: true, title: true, createdAt: true } },
  };
}

export async function GET(request, { params }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const { id } = await params;
  const guide = await prisma.guide.findUnique({ where: { id }, include: includeGuide() });
  if (!guide || guide.deletedAt) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    guide: {
      ...guide,
      tags: guide.tags.map((item) => item.tag.name),
      relatedTools: guide.relatedTools.map((item) => item.tool?.slug).filter(Boolean),
      relatedGuideIds: guide.relatedFrom.map((item) => item.toId),
      planning: getGuidePlanning(guide),
    },
  });
}

export async function PUT(request, { params }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const { id } = await params;
  const existing = await prisma.guide.findUnique({ where: { id } });
  if (!existing || existing.deletedAt) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await request.json().catch(() => ({}));
  const data = buildGuideRecord(body, existing);
  if (data.status === "published") {
    const blocked = publishBlockReason({ ...existing, ...body }, getGuidePlanning(body.planning ? body : { ...existing, ...body }));
    if (blocked) return NextResponse.json({ error: blocked }, { status: 400 });
  }
  try {
    const guide = await prisma.guide.update({ where: { id }, data });
    await syncGuideRelations(id, {
      tags: body.tags || [],
      toolSlugs: body.relatedTools || [],
      relatedGuideIds: body.relatedGuideIds || [],
    });
    await saveRevision(guide);
    const saved = await prisma.guide.findUnique({ where: { id }, include: includeGuide() });
    return NextResponse.json({ guide: saved });
  } catch (error) {
    if (String(error.message || "").includes("Unique constraint")) {
      return NextResponse.json({ error: "That slug is already used." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not save the guide." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const { id } = await params;
  await prisma.guide.update({
    where: { id },
    data: { deletedAt: new Date(), status: "unpublished", robots: "noindex,follow" },
  });
  return NextResponse.json({ ok: true });
}

export async function PATCH(request, { params }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const existing = await prisma.guide.findUnique({ where: { id }, include: includeGuide() });
  if (!existing || existing.deletedAt) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (body.action === "duplicate") {
    const copy = await prisma.guide.create({
      data: {
        title: `Copy of ${existing.title}`,
        slug: `${existing.slug}-copy-${Date.now().toString().slice(-4)}`,
        excerpt: existing.excerpt,
        template: existing.template,
        blocksJson: existing.blocksJson,
        searchText: existing.searchText,
        status: "draft",
        featured: false,
        robots: "noindex,follow",
        readingTime: existing.readingTime,
        seoTitle: existing.seoTitle,
        seoDescription: existing.seoDescription,
        authorId: existing.authorId,
        categoryId: existing.categoryId,
        deviceId: existing.deviceId,
      },
    });
    await syncGuideRelations(copy.id, {
      tags: existing.tags.map((item) => item.tag.name),
      toolSlugs: existing.relatedTools.map((item) => item.tool?.slug).filter(Boolean),
      relatedGuideIds: existing.relatedFrom.map((item) => item.toId),
    });
    return NextResponse.json({ guide: copy });
  }

  if (body.action === "restore-revision" && body.revisionId) {
    const revision = await prisma.guideRevision.findUnique({ where: { id: body.revisionId } });
    if (!revision || revision.guideId !== id) {
      return NextResponse.json({ error: "Revision not found." }, { status: 404 });
    }
    const guide = await prisma.guide.update({
      where: { id },
      data: {
        title: revision.title,
        excerpt: revision.excerpt,
        blocksJson: revision.blocksJson,
      },
    });
    return NextResponse.json({ guide });
  }

  const status = body.status;
  const data = {};
  if (status === "published") {
    const blocked = publishBlockReason(existing, getGuidePlanning(existing));
    if (blocked) return NextResponse.json({ error: blocked }, { status: 400 });
    data.status = "published";
    data.publishedAt = existing.publishedAt || new Date();
    data.scheduledAt = null;
    data.robots = robotsForStatus("published", existing.robots);
  } else if (status === "unpublished" || status === "draft" || status === "scheduled" || status === "archived") {
    data.status = status;
    data.robots = robotsForStatus(status, existing.robots);
    if (status === "scheduled") data.scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : existing.scheduledAt;
  }
  const guide = await prisma.guide.update({ where: { id }, data });
  return NextResponse.json({ guide });
}
