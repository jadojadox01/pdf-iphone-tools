import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/admin-guard";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 4 * 1024 * 1024;

export async function GET(request) {
  const denied = await adminGuard();
  if (denied) return denied;
  const q = request.nextUrl.searchParams.get("q") || "";
  const media = await prisma.media.findMany({
    where: q
      ? {
          OR: [
            { filename: { contains: q } },
            { alt: { contains: q } },
            { caption: { contains: q } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      filename: true,
      mimeType: true,
      alt: true,
      caption: true,
      width: true,
      height: true,
      size: true,
      createdAt: true,
    },
  });
  return NextResponse.json({
    media: media.map((item) => ({ ...item, url: `/api/media/${item.id}` })),
  });
}

export async function POST(request) {
  const denied = await adminGuard();
  if (denied) return denied;
  const form = await request.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Choose an image file." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, WebP, and GIF images are allowed." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Images must be 4 MB or smaller." }, { status: 400 });
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  const media = await prisma.media.create({
    data: {
      filename: file.name.slice(0, 120),
      mimeType: file.type,
      alt: String(form.get("alt") || "").trim(),
      caption: String(form.get("caption") || "").trim(),
      size: bytes.length,
      data: bytes,
    },
  });
  return NextResponse.json({
    media: {
      id: media.id,
      filename: media.filename,
      alt: media.alt,
      caption: media.caption,
      url: `/api/media/${media.id}`,
    },
  });
}
