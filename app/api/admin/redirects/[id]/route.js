import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/admin-guard";

export async function DELETE(request, { params }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const { id } = await params;
  await prisma.redirect.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
