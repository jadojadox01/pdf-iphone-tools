import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/admin-guard";
import { slugify } from "@/lib/slug";

export async function PUT(request, { params }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const category = await prisma.category.update({
    where: { id },
    data: {
      name: body.name != null ? String(body.name).trim() : undefined,
      slug: body.slug ? slugify(body.slug) : undefined,
      description: body.description != null ? String(body.description) : undefined,
      sortOrder: body.sortOrder != null ? Number(body.sortOrder) : undefined,
    },
  });
  return NextResponse.json({ category });
}

export async function DELETE(request, { params }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const { id } = await params;
  const count = await prisma.guide.count({ where: { categoryId: id, deletedAt: null } });
  if (count) {
    return NextResponse.json({ error: "Move or delete guides in this category first." }, { status: 400 });
  }
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
