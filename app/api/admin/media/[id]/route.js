import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/admin-guard";

export async function PATCH(request, { params }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const media = await prisma.media.update({
    where: { id },
    data: {
      alt: body.alt != null ? String(body.alt) : undefined,
      caption: body.caption != null ? String(body.caption) : undefined,
    },
    select: { id: true, alt: true, caption: true, filename: true },
  });
  return NextResponse.json({ media: { ...media, url: `/api/media/${media.id}` } });
}

export async function DELETE(request, { params }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const { id } = await params;
  await prisma.guide.updateMany({ where: { featuredImageId: id }, data: { featuredImageId: null } });
  await prisma.guide.updateMany({ where: { ogImageId: id }, data: { ogImageId: null } });
  await prisma.author.updateMany({ where: { avatarId: id }, data: { avatarId: null } });
  await prisma.media.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
