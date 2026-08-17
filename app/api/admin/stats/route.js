import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";
import { getAdminStats } from "@/lib/cms/guides";

export async function GET() {
  const denied = await adminGuard();
  if (denied) return denied;
  const stats = await getAdminStats();
  return NextResponse.json(stats);
}

export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
