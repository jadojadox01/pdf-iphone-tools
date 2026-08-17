export const SITE_NAME = "PDF iPhone Tools";
export const SITE_TAGLINE = "Free PDF Tools for iPhone — No App Required";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://pdftoword-ten.vercel.app"
).replace(/\/$/, "");

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@pdftoword-ten.vercel.app";

export const MAX_FILE_BYTES = 25 * 1024 * 1024;
export const MAX_MERGE_FILES = 20;
export const MAX_PAGES = 80;

export function absoluteUrl(path = "/") {
  if (!path.startsWith("/")) return `${SITE_URL}/${path}`;
  return `${SITE_URL}${path}`;
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function percentChange(original, next) {
  if (!original) return 0;
  return Math.round(((original - next) / original) * 100);
}
