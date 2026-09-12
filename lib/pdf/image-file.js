import { MAX_FILE_BYTES, MAX_MERGE_FILES, formatBytes } from "@/lib/site";
import { ToolError } from "./errors";
import { readFileBytes } from "./validate";

export const MAX_IMAGE_FILES = MAX_MERGE_FILES;

const JPEG_MAGIC = [0xff, 0xd8, 0xff];
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47];

export function sniffImageKind(bytes, file) {
  if (bytes.length >= 3 && JPEG_MAGIC.every((byte, index) => bytes[index] === byte)) return "jpeg";
  if (bytes.length >= 4 && PNG_MAGIC.every((byte, index) => bytes[index] === byte)) return "png";
  const name = (file?.name || "").toLowerCase();
  const type = (file?.type || "").toLowerCase();
  if (name.endsWith(".webp") || type === "image/webp") return "webp";
  if (name.endsWith(".gif") || type === "image/gif") return "gif";
  if (isHeicName(file)) return "heic";
  if (name.endsWith(".jpg") || name.endsWith(".jpeg") || type === "image/jpeg") return "jpeg";
  if (name.endsWith(".png") || type === "image/png") return "png";
  return "";
}

export function isHeicName(file) {
  const name = (file?.name || "").toLowerCase();
  const type = (file?.type || "").toLowerCase();
  return (
    name.endsWith(".heic") ||
    name.endsWith(".heif") ||
    type.includes("heic") ||
    type.includes("heif")
  );
}

export async function assertImageFile(file, { heicOnly = false } = {}) {
  if (!file) {
    throw new ToolError("INVALID_FILE", "Choose an image first.", "Tap the button to select a photo.");
  }
  if (file.size <= 0) {
    throw new ToolError("INVALID_FILE", "The selected file is empty.", "Choose a different image.");
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new ToolError(
      "TOO_LARGE",
      `This file is ${formatBytes(file.size)}, which is over the ${formatBytes(MAX_FILE_BYTES)} limit.`,
      "Use a smaller photo, or compress it first.",
    );
  }

  const bytes = file._sniffBytes || new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const kind = sniffImageKind(bytes, file);
  if (!kind) {
    throw new ToolError(
      "UNSUPPORTED",
      "This file is not a supported image.",
      heicOnly
        ? "Choose a .heic or .heif photo."
        : "Use JPG, PNG, WEBP, GIF, or HEIC.",
    );
  }
  if (heicOnly && kind !== "heic" && kind !== "jpeg") {
    throw new ToolError(
      "UNSUPPORTED",
      "This tool is for HEIC photos.",
      "On iPhone, Photos often stores camera shots as HEIC. JPG files can still be converted here.",
    );
  }
  return kind;
}

export async function assertImageFiles(files, { heicOnly = false, minFiles = 1 } = {}) {
  const list = Array.from(files || []).filter(Boolean);
  if (list.length < minFiles) {
    throw new ToolError(
      "INVALID_FILE",
      minFiles > 1 ? `Add at least ${minFiles} images.` : "Choose at least one image.",
      "Tap Add images to include files.",
    );
  }
  if (list.length > MAX_IMAGE_FILES) {
    throw new ToolError(
      "TOO_LARGE",
      `You can add up to ${MAX_IMAGE_FILES} images at a time.`,
      "Split them into smaller batches.",
    );
  }
  for (const file of list) {
    await assertImageFile(file, { heicOnly });
  }
  return list;
}

export async function rasterizeImageToJpeg(file, quality = 0.9, onStatus) {
  const bytes = await readFileBytes(file);
  const kind = sniffImageKind(bytes, file);

  if (kind === "jpeg") return bytes;

  if (kind === "heic") {
    onStatus?.("Reading HEIC photo…");
    const jpeg = await heicToJpeg(file, quality);
    if (jpeg) return jpeg;
  }

  if (typeof document === "undefined") {
    throw new ToolError(
      "UNSUPPORTED",
      "This image format needs a browser to convert.",
      "Open this tool in Safari or Chrome and try again.",
    );
  }

  onStatus?.("Preparing image…");
  const bitmap = await decodeToImage(file, kind);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, bitmap.width);
  canvas.height = Math.max(1, bitmap.height);
  const context = canvas.getContext("2d", { alpha: false });
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0);
  if (bitmap.close) bitmap.close();

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) reject(new Error("Could not encode this image as JPG."));
        else resolve(result);
      },
      "image/jpeg",
      quality,
    );
  });
  return new Uint8Array(await blob.arrayBuffer());
}

async function heicToJpeg(file, quality) {
  try {
    const native = await decodeToImage(file, "heic");
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, native.width);
    canvas.height = Math.max(1, native.height);
    const context = canvas.getContext("2d", { alpha: false });
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(native, 0, 0);
    if (native.close) native.close();
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((result) => (result ? resolve(result) : reject(new Error("encode"))), "image/jpeg", quality);
    });
    return new Uint8Array(await blob.arrayBuffer());
  } catch {
    /* native decode often fails outside Safari */
  }

  if (typeof window === "undefined") {
    throw new ToolError(
      "UNSUPPORTED",
      "HEIC conversion runs in your browser.",
      "Open this page in Safari on iPhone, or Chrome on a computer, then try again.",
    );
  }

  try {
    const heic2any = (await import("heic2any")).default;
    const converted = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality,
    });
    const blob = Array.isArray(converted) ? converted[0] : converted;
    return new Uint8Array(await blob.arrayBuffer());
  } catch {
    throw new ToolError(
      "UNSUPPORTED",
      "This HEIC photo could not be read.",
      "On iPhone, open the photo in Photos, export it as JPG, or try Safari. Some HEIC files from other apps are not supported.",
    );
  }
}

async function decodeToImage(file, kind) {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      if (kind !== "heic") {
        /* fall through to Image() */
      }
    }
  }

  if (typeof document === "undefined" || typeof Image === "undefined") {
    throw new ToolError(
      "UNSUPPORTED",
      "This image could not be decoded.",
      "Try JPG or PNG, or open the tool in a browser.",
    );
  }

  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("decode"));
      el.src = url;
    });
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}
