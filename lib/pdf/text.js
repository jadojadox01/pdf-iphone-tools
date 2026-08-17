import { ToolError } from "./errors";
import { openPdfDocument } from "./pdfjs";
import { readFileBytes } from "./validate";

const LINE_TOLERANCE = 3;

export async function extractPdfText(file, password = "", onStatus) {
  const bytes = await readFileBytes(file);
  const pdf = await openPdfDocument(bytes, password);
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    onStatus?.(`Reading page ${pageNumber} of ${pdf.numPages}…`);
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const lines = groupItemsIntoLines(textContent.items);
    pages.push({
      pageNumber,
      lines,
      text: lines.join("\n").trim(),
    });
  }

  const fullText = pages.map((page) => page.text).filter(Boolean).join("\n\n");
  const chars = fullText.replace(/\s+/g, "").length;
  const scanned = pdf.numPages > 0 && chars / pdf.numPages < 25;

  return {
    pageCount: pdf.numPages,
    pages,
    fullText,
    chars,
    scanned,
  };
}

export function assertExtractableText(extracted, action = "convert this PDF") {
  if (extracted.scanned || extracted.chars < 20) {
    throw new ToolError(
      "OCR_REQUIRED",
      "This looks like a scanned or image-only PDF.",
      `There is not enough extractable text to ${action}. Optical character recognition (OCR) is not available here, so photographed pages cannot be turned into editable text.`,
    );
  }
}

function groupItemsIntoLines(items) {
  const lines = [];
  let current = [];
  let lastY = null;

  for (const item of items) {
    const text = (item.str || "").replace(/\s+$/g, "");
    if (!text && !item.hasEOL) continue;
    const y = item.transform ? item.transform[5] : 0;

    if (lastY !== null && Math.abs(lastY - y) > LINE_TOLERANCE && current.length) {
      lines.push(current.join("").trim());
      current = [];
    }

    current.push(text);
    if (item.hasEOL) {
      lines.push(current.join("").trim());
      current = [];
      lastY = null;
    } else {
      lastY = y;
    }
  }

  if (current.length) lines.push(current.join("").trim());
  return lines.filter(Boolean);
}
