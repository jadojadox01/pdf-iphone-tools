import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/admin-guard";
import { slugify } from "@/lib/slug";

export async function PUT(request, { params }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const author = await prisma.author.update({
    where: { id },
    data: {
      name: body.name != null ? String(body.name).trim() : undefined,
      slug: body.slug ? slugify(body.slug) : undefined,
      bio: body.bio != null ? String(body.bio) : undefined,
      role: body.role != null ? String(body.role) : undefined,
      website: body.website != null ? String(body.website) : undefined,
      avatarId: body.avatarId === undefined ? undefined : body.avatarId,
    },
  });
  return NextResponse.json({ author });
}

export async function DELETE(request, { params }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const { id } = await params;
  const count = await prisma.guide.count({ where: { authorId: id, deletedAt: null } });
  if (count) {
    return NextResponse.json({ error: "Reassign this author's guides first." }, { status: 400 });
  }
  await prisma.author.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
