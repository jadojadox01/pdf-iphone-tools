export const BRAND = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "PDFFlow",
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || "Simple PDF tools for every device.",
  shortTagline: "Convert, merge, split, compress, and manage PDFs directly from your browser.",
  definition:
    "PDFFlow is a website of PDF tools that run in your browser. You can convert a PDF to Word, JPG, PNG, Excel, PowerPoint, or EPUB, turn Word files and photos into PDF, and merge, split, compress, rotate, sign, or password-protect a file. Processing stays on your device. Files are not uploaded for conversion.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://pdftoword-ten.vercel.app").replace(/\/$/, ""),
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "techpreneur3@gmail.com",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "+250 786328597",
  logoText: process.env.NEXT_PUBLIC_SITE_NAME || "PDFFlow",
  logoSrc: "/brand/logo.png",
  logoMarkSrc: "/brand/logo-mark.png",
};

export const SITE_NAME = BRAND.name;
export const SITE_TAGLINE = BRAND.tagline;
export const SITE_DEFINITION = BRAND.definition;
export const SITE_URL = BRAND.url;
export const CONTACT_EMAIL = BRAND.email;
export const CONTACT_WHATSAPP = BRAND.whatsapp;
export const CONTACT_WHATSAPP_URL = `https://wa.me/${BRAND.whatsapp.replace(/[^\d]/g, "")}`;

export const MAX_FILE_BYTES = 25 * 1024 * 1024;
export const MAX_MERGE_FILES = 20;
export const MAX_PAGES = 80;
export const MAX_OCR_PAGES = 15;

export const RESERVED_PATHS = new Set([
  "admin",
  "api",
  "tools",
  "guides",
  "about",
  "contact",
  "privacy",
  "terms",
  "cookies",
  "authors",
  "blog",
  "login",
  "iphone",
  "android",
  "windows",
  "mac",
]);

export function absoluteUrl(path = "/") {
  if (!path) return SITE_URL;
  if (path.startsWith("http")) return path;
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
