import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/admin-guard";
import { getTools } from "@/lib/tools";
import { toolPath } from "@/lib/paths";
import { ensureCatalogToolsInCms } from "@/lib/cms/sync-catalog-tools";

export async function GET() {
  const denied = await adminGuard();
  if (denied) return denied;
  await ensureCatalogToolsInCms();
  const catalog = getTools();
  const tools = await prisma.tool.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      devices: { include: { device: true } },
      _count: { select: { guides: true } },
      guides: {
        include: {
          guide: {
            select: { id: true, title: true, slug: true, status: true, category: { select: { slug: true } } },
          },
        },
      },
    },
  });
  return NextResponse.json({
    tools: tools.map((tool) => ({
      ...tool,
      publicPath: toolPath(tool.slug),
      catalogLive: catalog.some((item) => item.slug === tool.slug),
    })),
  });
}
