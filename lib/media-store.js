import { NextResponse } from "next/server";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";
import { mediaPublicUrl } from "@/lib/media";
import {
  BLOB_SETUP_MESSAGE,
  deleteMediaBlob,
  getMediaBlob,
  mediaBlobPath,
  putMediaBlob,
  runningOnVercel,
} from "@/lib/cms-storage";

const EXT = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
};

const MIME_FROM_EXT = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

export const ALLOWED_MEDIA_TYPES = new Set(Object.keys(EXT));
export const MAX_MEDIA_BYTES = 8 * 1024 * 1024;

export function mediaFileExtension(mimeType, filename = "") {
  if (EXT[mimeType]) return EXT[mimeType];
  const match = String(filename).toLowerCase().match(/\.[a-z0-9]+$/);
  return match ? match[0] : ".img";
}

export function sniffImageMime(filename = "", reportedType = "", bytes) {
  const reported = String(reportedType || "").toLowerCase().trim();
  if (reported === "image/jpg" || reported === "image/pjpeg") return "image/jpeg";
  if (reported === "image/x-png") return "image/png";
  if (ALLOWED_MEDIA_TYPES.has(reported)) return reported;

  const header = bytes ? Buffer.from(bytes.subarray(0, 16)) : Buffer.alloc(0);
  if (header.length >= 3 && header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) return "image/jpeg";
  if (header.length >= 8 && header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47) {
    return "image/png";
  }
  if (header.length >= 6 && header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46) return "image/gif";
  if (
    header.length >= 12 &&
    header[0] === 0x52 &&
    header[1] === 0x49 &&
    header[2] === 0x46 &&
    header[3] === 0x46 &&
    header[8] === 0x57 &&
    header[9] === 0x45 &&
    header[10] === 0x42 &&
    header[11] === 0x50
  ) {
    return "image/webp";
  }
  const start = header.toString("utf8");
  if (start.includes("<svg") || start.includes("<?xml")) return "image/svg+xml";

  const ext = String(filename).toLowerCase().match(/\.[a-z0-9]+$/)?.[0] || "";
  return MIME_FROM_EXT[ext] || "";
}

export function prismaWriteError(error) {
  const message = String(error?.message || error || "");
  if (message.includes("live CMS cannot save")) return BLOB_SETUP_MESSAGE;
  if (/readonly|SQLITE_READONLY|EPERM|EROFS|readonly database/i.test(message)) {
    return BLOB_SETUP_MESSAGE;
  }
  if (/token|store|BLOB_/i.test(message) && runningOnVercel()) {
    return BLOB_SETUP_MESSAGE;
  }
  if (/SQLITE_BUSY|database is locked/i.test(message)) {
    return "The CMS database is busy. Wait a moment and try the upload again.";
  }
  return "The image could not be saved. Try a JPEG or PNG under 8 MB.";
}

export async function persistMediaFile(id, bytes, mimeType, filename) {
  const ext = mediaFileExtension(mimeType, filename);
  if (runningOnVercel()) {
    try {
      const url = await putMediaBlob(mediaBlobPath(id, ext), bytes, mimeType);
      return url || `/media/${id}`;
    } catch {
      throw new Error(BLOB_SETUP_MESSAGE);
    }
  }
  try {
    const dir = path.join(process.cwd(), "public", "uploads", "media");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, `${id}${ext}`), bytes);
  } catch {
    /* Serving still works from the database blob at /media/[id]. */
  }
  return `/media/${id}`;
}

export async function removePersistedMediaFile(id) {
  const dir = path.join(process.cwd(), "public", "uploads", "media");
  await Promise.all([
    ...[...Object.values(EXT), ".img", ".jpeg"].map((ext) => unlink(path.join(dir, `${id}${ext}`)).catch(() => undefined)),
    ...[...Object.values(EXT), ".img", ".jpeg"].map((ext) => deleteMediaBlob(mediaBlobPath(id, ext))),
  ]);
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

  const ext = mediaFileExtension(media.mimeType, media.filename);
  const fromBlob = await getMediaBlob(mediaBlobPath(media.id, ext));
  if (fromBlob?.bytes?.length) {
    const filename = String(media.filename || "image").replace(/"/g, "");
    return new NextResponse(fromBlob.bytes, {
      headers: {
        "Content-Type": fromBlob.contentType || media.mimeType || "application/octet-stream",
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
