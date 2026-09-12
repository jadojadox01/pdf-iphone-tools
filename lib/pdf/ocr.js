import { MAX_OCR_PAGES } from "@/lib/site";
import { ToolError } from "./errors";
import { openPdfDocument, renderPageToCanvas } from "./pdfjs";
import { readFileBytes } from "./validate";

const MIN_PAGE_CHARS = 25;

export function pageNeedsOcr(page) {
  return String(page?.text || "").replace(/\s+/g, "").length < MIN_PAGE_CHARS;
}

export async function ocrPdfPages(file, pageNumbers, password = "", onStatus) {
  if (typeof window === "undefined") {
    throw new ToolError(
      "OCR_REQUIRED",
      "OCR only runs in your browser.",
      "Open this tool in Safari or another browser and try again.",
    );
  }

  const uniquePages = [...new Set(pageNumbers)].sort((a, b) => a - b);
  if (!uniquePages.length) return [];
  if (uniquePages.length > MAX_OCR_PAGES) {
    throw new ToolError(
      "TOO_LARGE",
      `OCR can read up to ${MAX_OCR_PAGES} scanned pages in one go.`,
      "Split the PDF first, then convert the pages you need. Text-based pages do not count toward this limit.",
    );
  }

  onStatus?.("Loading OCR engine… the first run can take a moment.");
  const { createWorker } = await import("tesseract.js");
  const assetBase = `${window.location.origin}/tesseract`;
  const worker = await createWorker("eng", 1, {
    workerPath: `${assetBase}/worker.min.js`,
    corePath: assetBase,
    langPath: assetBase,
    logger: (message) => {
      if (message.status === "recognizing text" && Number.isFinite(message.progress)) {
        const percent = Math.round(message.progress * 100);
        if (percent === 0 || percent === 100 || percent % 20 === 0) {
          onStatus?.(`Reading text from the page image… ${percent}%`);
        }
      }
    },
  });

  const bytes = await readFileBytes(file);
  const pdf = await openPdfDocument(bytes, password);
  const pages = [];

  try {
    for (let index = 0; index < uniquePages.length; index += 1) {
      const pageNumber = uniquePages[index];
      onStatus?.(
        `OCR page ${pageNumber} (${index + 1} of ${uniquePages.length}). This can take a minute on iPhone.`,
      );
      const page = await pdf.getPage(pageNumber);
      const base = page.getViewport({ scale: 1 });
      const scale = Math.min(2, 1600 / Math.max(base.width, base.height, 1));
      const { canvas } = await renderPageToCanvas(page, scale);
      const { data } = await worker.recognize(canvas);
      const lines = (data.lines || [])
        .map((line) => String(line.text || "").trim())
        .filter(Boolean);
      const text = (data.text || lines.join("\n")).trim();
      const boxes = (data.words || [])
        .map((word) => ({
          text: String(word.text || "").trim(),
          x: word.bbox?.x0 || 0,
          y: -(word.bbox?.y0 || 0),
          width: Math.max(0, (word.bbox?.x1 || 0) - (word.bbox?.x0 || 0)),
        }))
        .filter((item) => item.text);
      pages.push({
        pageNumber,
        lines,
        text,
        boxes,
        ocr: true,
      });
    }
  } finally {
    await worker.terminate();
  }

  return pages;
}

export async function extractPdfTextWithOcr(file, password = "", onStatus) {
  const { extractPdfText } = await import("./text");
  const extracted = await extractPdfText(file, password, onStatus);
  const ocrPageNumbers = extracted.pages.filter(pageNeedsOcr).map((page) => page.pageNumber);

  if (!ocrPageNumbers.length) {
    return { ...extracted, ocr: false, ocrPages: 0 };
  }

  onStatus?.("Some pages have little or no embedded text. Running OCR on those page images…");
  const ocrPages = await ocrPdfPages(file, ocrPageNumbers, password, onStatus);
  const byNumber = new Map(ocrPages.map((page) => [page.pageNumber, page]));
  const pages = extracted.pages.map((page) => byNumber.get(page.pageNumber) || page);
  const fullText = pages.map((page) => page.text).filter(Boolean).join("\n\n");
  const chars = fullText.replace(/\s+/g, "").length;

  if (chars < 20) {
    throw new ToolError(
      "OCR_FAILED",
      "OCR could not read enough text from this PDF.",
      "The scan may be blurry, sideways, handwritten, or too low-resolution. Try a clearer scan. English text works best.",
    );
  }

  return {
    pageCount: extracted.pageCount,
    pages,
    fullText,
    chars,
    scanned: true,
    ocr: true,
    ocrPages: ocrPageNumbers.length,
  };
}
