import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/admin-guard";

export async function PUT(request, { params }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const current = await prisma.device.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (body.status === "published" && current.slug !== "iphone") {
    return NextResponse.json(
      {
        error:
          "Do not publish this device hub until it has unique copy. Android, Windows, and Mac should stay draft until they are not iPhone pages with the name swapped.",
      },
      { status: 400 },
    );
  }
  const device = await prisma.device.update({
    where: { id },
    data: {
      name: body.name != null ? String(body.name).trim() : undefined,
      description: body.description != null ? String(body.description) : undefined,
      intro: body.intro != null ? String(body.intro) : undefined,
      seoTitle: body.seoTitle != null ? String(body.seoTitle) : undefined,
      seoDescription: body.seoDescription != null ? String(body.seoDescription) : undefined,
      status: body.status != null ? String(body.status) : undefined,
    },
  });
  return NextResponse.json({ device });
}
