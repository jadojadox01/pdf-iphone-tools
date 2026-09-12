import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/admin-guard";
import {
  ALLOWED_MEDIA_TYPES,
  MAX_MEDIA_BYTES,
  persistMediaFile,
  prismaWriteError,
  serializeMedia,
  sniffImageMime,
} from "@/lib/media-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

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
      url: true,
      width: true,
      height: true,
      size: true,
      createdAt: true,
    },
  });
  return NextResponse.json({
    media: media.map(serializeMedia),
  });
}

export async function POST(request) {
  const denied = await adminGuard();
  if (denied) return denied;

  try {
    let form;
    try {
      form = await request.formData();
    } catch {
      return NextResponse.json(
        { error: "The image did not arrive intact. Try a smaller JPEG or PNG under 8 MB." },
        { status: 400 }
      );
    }
    const file = form.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Choose an image file." }, { status: 400 });
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    if (!bytes.length) {
      return NextResponse.json({ error: "That file is empty. Choose a JPEG or PNG image." }, { status: 400 });
    }
    if (bytes.length > MAX_MEDIA_BYTES) {
      return NextResponse.json({ error: "Images must be 8 MB or smaller." }, { status: 400 });
    }
    const mimeType = sniffImageMime(file.name, file.type, bytes);
    if (!ALLOWED_MEDIA_TYPES.has(mimeType)) {
      return NextResponse.json({ error: "Use a JPEG, PNG, WebP, GIF, or SVG image." }, { status: 400 });
    }

    const created = await prisma.media.create({
      data: {
        filename: String(file.name || "image").slice(0, 120) || `image${mimeType === "image/jpeg" ? ".jpg" : ".png"}`,
        mimeType,
        alt: String(form.get("alt") || "").trim(),
        caption: String(form.get("caption") || "").trim(),
        size: bytes.length,
        data: bytes,
      },
    });
    const url = await persistMediaFile(created.id, bytes, mimeType, file.name);
    const media = await prisma.media.update({
      where: { id: created.id },
      data: { url },
    });
    return NextResponse.json({
      media: serializeMedia(media),
    });
  } catch (error) {
    console.error("Media upload failed:", error);
    return NextResponse.json({ error: prismaWriteError(error) }, { status: 500 });
  }
}
