import { MAX_FILE_BYTES, MAX_MERGE_FILES, formatBytes } from "@/lib/site";
import { ToolError } from "./errors";

const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46]; // %PDF

export function sanitizeFilename(name, fallback = "document") {
  const cleaned = String(name || fallback)
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
  return cleaned || fallback;
}

export function replaceExtension(filename, ext) {
  const base = sanitizeFilename(filename).replace(/\.[^.]+$/, "");
  return `${base}.${ext.replace(/^\./, "")}`;
}

export async function readFileBytes(file) {
  const buffer = await file.arrayBuffer();
  return new Uint8Array(buffer);
}

export async function assertPdfFile(file, { maxBytes = MAX_FILE_BYTES } = {}) {
  if (!file) {
    throw new ToolError("INVALID_FILE", "Choose a PDF file first.", "Tap Choose PDF to select a file.");
  }

  if (file.size <= 0) {
    throw new ToolError("INVALID_FILE", "The selected file is empty.", "Choose a different PDF.");
  }

  if (file.size > maxBytes) {
    throw new ToolError(
      "TOO_LARGE",
      `This file is ${formatBytes(file.size)}, which is over the ${formatBytes(maxBytes)} limit.`,
      "Compress the PDF first, or split it into smaller files.",
    );
  }

  const name = (file.name || "").toLowerCase();
  const type = (file.type || "").toLowerCase();
  const looksLikePdf =
    name.endsWith(".pdf") || type === "application/pdf" || type === "application/x-pdf";

  if (!looksLikePdf && type && !type.startsWith("application/octet-stream")) {
    throw new ToolError(
      "UNSUPPORTED",
      "Only PDF files are accepted.",
      "Select a file with a .pdf extension.",
    );
  }

  const header = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const isPdf = PDF_MAGIC.every((byte, index) => header[index] === byte);
  if (!isPdf) {
    throw new ToolError(
      "INVALID_FILE",
      "This file is not a valid PDF.",
      "The file extension may be wrong, or the file may be damaged.",
    );
  }

  return true;
}

export async function assertPdfFiles(files, { maxFiles = MAX_MERGE_FILES } = {}) {
  const list = Array.from(files || []).filter(Boolean);
  if (list.length < 2) {
    throw new ToolError(
      "INVALID_FILE",
      "Add at least two PDF files to merge.",
      "Use Add PDF to include more files.",
    );
  }
  if (list.length > maxFiles) {
    throw new ToolError(
      "TOO_LARGE",
      `You can merge up to ${maxFiles} files at a time.`,
      "Merge in smaller batches.",
    );
  }
  for (const file of list) {
    await assertPdfFile(file);
  }
  return list;
}
