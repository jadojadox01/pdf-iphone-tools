import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/admin-guard";
import { getTool } from "@/lib/tools";
import { getToolExplain, explainToOverlay } from "@/lib/explain";
import { getExplainOverride, saveExplainOverride } from "@/lib/explain-store";
import { toolPath } from "@/lib/paths";

export async function GET(_request, { params }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const { id } = await params;
  const row = await prisma.tool.findUnique({
    where: { id },
    include: { devices: { include: { device: true } } },
  });
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const catalog = getTool(row.slug);
  const cmsExplain = await getExplainOverride(row.slug);
  const explain = getToolExplain(catalog || row, { cmsExplain });
  return NextResponse.json({
    tool: {
      ...row,
      publicPath: toolPath(row.slug),
      catalogLive: Boolean(catalog),
    },
    explain: explainToOverlay(explain),
  });
}

export async function PUT(_request, { params }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const { id } = await params;
  const body = await _request.json().catch(() => ({}));
  const tool = await prisma.tool.update({
    where: { id },
    data: {
      name: body.name != null ? String(body.name).trim() : undefined,
      description: body.description != null ? String(body.description) : undefined,
      intro: body.intro != null ? String(body.intro) : undefined,
      cta: body.cta != null ? String(body.cta) : undefined,
      seoTitle: body.seoTitle != null ? String(body.seoTitle) : undefined,
      seoDescription: body.seoDescription != null ? String(body.seoDescription) : undefined,
      status: body.status != null ? String(body.status) : undefined,
    },
  });
  if (body.explain != null) {
    await saveExplainOverride(tool.slug, body.explain);
  }
  if (body.iphone) {
    const iphone = await prisma.device.findUnique({ where: { slug: "iphone" } });
    if (iphone) {
      await prisma.toolDevice.upsert({
        where: { toolId_deviceId: { toolId: id, deviceId: iphone.id } },
        update: {
          headline: String(body.iphone.headline || ""),
          intro: String(body.iphone.intro || ""),
          featured: Boolean(body.iphone.featured),
        },
        create: {
          toolId: id,
          deviceId: iphone.id,
          headline: String(body.iphone.headline || ""),
          intro: String(body.iphone.intro || ""),
          featured: Boolean(body.iphone.featured),
        },
      });
    }
  }
  return NextResponse.json({ tool });
}
