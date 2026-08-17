import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/admin-guard";

export async function GET() {
  const denied = await adminGuard();
  if (denied) return denied;
  const row = await prisma.setting.findUnique({ where: { key: "notes" } });
  return NextResponse.json({ notes: row?.value || "" });
}

export async function POST(request) {
  const denied = await adminGuard();
  if (denied) return denied;
  const body = await request.json().catch(() => ({}));
  await prisma.setting.upsert({
    where: { key: "notes" },
    update: { value: String(body.notes || "") },
    create: { key: "notes", value: String(body.notes || "") },
  });
  return NextResponse.json({ ok: true });
}
