import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";
import { mediaPublicUrl } from "@/lib/media";

const EXT = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
};

export function mediaFileExtension(mimeType, filename = "") {
  if (EXT[mimeType]) return EXT[mimeType];
  const match = String(filename).toLowerCase().match(/\.[a-z0-9]+$/);
  return match ? match[0] : ".img";
}

export async function persistMediaFile(id, bytes, mimeType, filename) {
  const ext = mediaFileExtension(mimeType, filename);
  const relative = `/uploads/media/${id}${ext}`;
  try {
    const dir = path.join(process.cwd(), "public", "uploads", "media");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, `${id}${ext}`), bytes);
    return relative;
  } catch {
    return `/media/${id}`;
  }
}

export function serializeMedia(media) {
  if (!media) return null;
  return {
    id: media.id,
    filename: media.filename,
    mimeType: media.mimeType,
    alt: media.alt,
    caption: media.caption,
    width: media.width,
    height: media.height,
    size: media.size,
    url: mediaPublicUrl(media),
  };
}

export async function serveMedia(id) {
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return new NextResponse("Not found", { status: 404 });

  const url = String(media.url || "").trim();
  if (url && /^https?:\/\//i.test(url) && !media.data) {
    return NextResponse.redirect(url);
  }

  if (media.data && media.data.length) {
    const filename = String(media.filename || "image").replace(/"/g, "");
    return new NextResponse(Buffer.from(media.data), {
      headers: {
        "Content-Type": media.mimeType || "application/octet-stream",
        "Cache-Control": "public, max-age=86400",
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  }

  if (url.startsWith("/") && !url.startsWith("/api/") && !url.startsWith("/media/")) {
    return NextResponse.redirect(url);
  }

  return new NextResponse("Not found", { status: 404 });
}
