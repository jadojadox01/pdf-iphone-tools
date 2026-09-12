export const MAX_CLIENT_MEDIA_BYTES = 8 * 1024 * 1024;
const TARGET_BYTES = 3.5 * 1024 * 1024;
const MAX_EDGE = 1600;

function defaultAlt(filename) {
  return String(filename || "image")
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();
}

function looksLikeImage(file) {
  const type = String(file.type || "").toLowerCase();
  if (type.startsWith("image/")) return true;
  return /\.(jpe?g|png|webp|gif|svg)$/i.test(file.name || "");
}

async function blobFromCanvas(canvas, type, quality) {
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, quality));
  return blob;
}

async function compressImage(file) {
  if (typeof createImageBitmap !== "function") return file;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close?.();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const preferPng = /png|svg|gif/i.test(file.type || file.name || "");
  let blob = preferPng ? await blobFromCanvas(canvas, "image/png") : await blobFromCanvas(canvas, "image/jpeg", 0.86);
  if (blob && blob.size > TARGET_BYTES) {
    blob = await blobFromCanvas(canvas, "image/jpeg", 0.78);
  }
  if (!blob || blob.size >= file.size) return file;

  const ext = blob.type === "image/png" ? ".png" : ".jpg";
  const name = String(file.name || "image").replace(/\.[^.]+$/, ext);
  return new File([blob], name, { type: blob.type });
}

export async function prepareMediaFile(file) {
  if (!file) {
    throw new Error("Choose an image file.");
  }
  if (!file.size) {
    throw new Error("That file is empty. Choose a JPEG or PNG image.");
  }
  if (!looksLikeImage(file)) {
    throw new Error("Use a JPEG, PNG, WebP, GIF, or SVG image.");
  }
  if (/\.svg$/i.test(file.name || "") || file.type === "image/svg+xml") {
    if (file.size > MAX_CLIENT_MEDIA_BYTES) {
      throw new Error("Images must be 8 MB or smaller.");
    }
    return file;
  }
  if (file.size > MAX_CLIENT_MEDIA_BYTES) {
    const compressed = await compressImage(file);
    if (compressed.size > MAX_CLIENT_MEDIA_BYTES) {
      throw new Error("Images must be 8 MB or smaller. Try a smaller JPEG or PNG.");
    }
    return compressed;
  }
  const missingType = !file.type || file.type === "application/octet-stream";
  if (missingType || file.size > TARGET_BYTES) {
    return compressImage(file);
  }
  return file;
}

export async function uploadAdminMedia(file, fields = {}) {
  const prepared = await prepareMediaFile(file);
  const body = new FormData();
  body.append("file", prepared);
  body.append("alt", String(fields.alt || defaultAlt(prepared.name)));
  if (fields.caption) body.append("caption", String(fields.caption));
  const response = await fetch("/api/admin/media", {
    method: "POST",
    body,
    credentials: "same-origin",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Upload failed (${response.status}).`);
  }
  if (!data.media?.id) {
    throw new Error("Upload finished but the image was not saved. Try again.");
  }
  return data.media;
}
