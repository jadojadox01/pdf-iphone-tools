import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/admin-guard";
import { slugify } from "@/lib/slug";

export async function PUT(request, { params }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const tag = await prisma.tag.update({
    where: { id },
    data: {
      name: body.name != null ? String(body.name).trim() : undefined,
      slug: body.slug ? slugify(body.slug) : undefined,
    },
  });
  return NextResponse.json({ tag });
}

export async function DELETE(request, { params }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const { id } = await params;
  await prisma.guideTag.deleteMany({ where: { tagId: id } });
  await prisma.tag.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
