import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/admin-guard";
import { getGuidePlanning, publishBlockReason } from "@/lib/cms/planning";

export async function POST(request) {
  const denied = await adminGuard();
  if (denied) return denied;
  const body = await request.json().catch(() => ({}));
  const ids = Array.isArray(body.ids) ? body.ids : [];
  if (!ids.length) return NextResponse.json({ error: "No guides selected." }, { status: 400 });

  if (body.action === "publish") {
    const items = await prisma.guide.findMany({
      where: { id: { in: ids }, deletedAt: null },
      select: { id: true, publishedAt: true, title: true, excerpt: true, blocksJson: true },
    });
    const skipped = [];
    for (const item of items) {
      const blocked = publishBlockReason(item, getGuidePlanning(item));
      if (blocked) {
        skipped.push(item.title);
        continue;
      }
      await prisma.guide.update({
        where: { id: item.id },
        data: { status: "published", publishedAt: item.publishedAt || new Date(), scheduledAt: null },
      });
    }
    return NextResponse.json({ ok: true, skipped });
  } else if (body.action === "unpublish") {
    await prisma.guide.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { status: "unpublished" },
    });
  } else if (body.action === "delete") {
    await prisma.guide.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: new Date(), status: "unpublished" },
    });
  } else {
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
