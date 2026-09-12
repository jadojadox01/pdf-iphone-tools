import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/admin-guard";
import { getAdminStats } from "@/lib/cms/guides";
import { prisma } from "@/lib/db";

export async function GET() {
  const denied = await adminGuard();
  if (denied) return denied;
  const [stats, authors, categories, guides, devices] = await Promise.all([
    getAdminStats(),
    prisma.author.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.guide.findMany({
      where: { deletedAt: null },
      select: { id: true, title: true, slug: true, status: true },
      orderBy: { title: "asc" },
    }),
    prisma.device.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  return NextResponse.json({ stats, authors, categories, guides, devices });
}
