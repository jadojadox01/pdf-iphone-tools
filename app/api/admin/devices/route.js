import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/admin-guard";

export async function GET() {
  const denied = await adminGuard();
  if (denied) return denied;
  const devices = await prisma.device.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { tools: true, guides: true } } },
  });
  return NextResponse.json({ devices });
}
