import { MAX_OCR_PAGES } from "@/lib/site";
import { ToolError } from "./errors";
import { openPdfDocument, renderPageToCanvas } from "./pdfjs";
import { report, span, yieldUi } from "./progress";
import { readFileBytes } from "./validate";

const MIN_PAGE_CHARS = 25;
const OCR_DPI = 300;
const OCR_MAX_EDGE = 2600;
const MIN_WORD_CONFIDENCE = 35;

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

  report(onStatus, 42, "Loading OCR engine… the first run can take a moment.");
  const { createWorker } = await import("tesseract.js");
  const assetBase = `${window.location.origin}/tesseract`;
  const worker = await createWorker("eng", 1, {
    workerPath: `${assetBase}/worker.min.js`,
    corePath: assetBase,
    langPath: assetBase,
    logger: (message) => {
      if (message.status === "recognizing text" && Number.isFinite(message.progress)) {
        const percent = Math.round(message.progress * 100);
        if (percent === 0 || percent === 100 || percent % 5 === 0) {
          onStatus?.(`Reading printed text… ${percent}%`);
        }
      }
    },
  });

  try {
    await worker.setParameters({
      tessedit_pageseg_mode: "3",
      preserve_interword_spaces: "1",
      user_defined_dpi: "300",
    });
  } catch {
    /* older local tessdata still works with defaults */
  }

  const bytes = await readFileBytes(file);
  const pdf = await openPdfDocument(bytes, password);
  const pages = [];

  try {
    for (let index = 0; index < uniquePages.length; index += 1) {
      const pageNumber = uniquePages[index];
      report(
        onStatus,
        span(42, 84, index, uniquePages.length),
        `Reading scanned page ${pageNumber} (${index + 1} of ${uniquePages.length})…`,
      );
      await yieldUi();
      const page = await pdf.getPage(pageNumber);
      const base = page.getViewport({ scale: 1 });
      const longest = Math.max(base.width, base.height, 1);
      const scale = Math.min(OCR_DPI / 72, OCR_MAX_EDGE / longest);
      const { canvas } = await renderPageToCanvas(page, scale);
      const prepared = prepareOcrCanvas(canvas);
      const { data } = await worker.recognize(prepared);
      const parsed = parseOcrData(data);
      pages.push({
        pageNumber,
        lines: parsed.lines,
        text: parsed.text,
        boxes: parsed.boxes,
        layout: parsed.layout,
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
  report(onStatus, 8, "Reading PDF text…");
  const extracted = await extractPdfText(file, password, onStatus);
  const ocrPageNumbers = extracted.pages.filter(pageNeedsOcr).map((page) => page.pageNumber);

  if (!ocrPageNumbers.length) {
    report(onStatus, 70, "Embedded text found. Building the file…");
    return { ...extracted, ocr: false, ocrPages: 0 };
  }

  report(onStatus, 16, "Some pages have little or no embedded text. Reading those page images…");
  const ocrPages = await ocrPdfPages(file, ocrPageNumbers, password, onStatus);
  const byNumber = new Map(ocrPages.map((page) => [page.pageNumber, page]));
  const pages = extracted.pages.map((page) => byNumber.get(page.pageNumber) || page);
  const fullText = pages.map((page) => page.text).filter(Boolean).join("\n\n");
  const chars = fullText.replace(/\s+/g, "").length;

  if (chars < 20) {
    report(onStatus, 86, "Little text was found. The download will include page images so you can still read it.");
    return {
      pageCount: extracted.pageCount,
      pages,
      fullText,
      chars,
      scanned: true,
      ocr: true,
      ocrWeak: true,
      ocrPages: ocrPageNumbers.length,
    };
  }

  report(onStatus, 86, "OCR finished. Building the download…");
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

function prepareOcrCanvas(source) {
  const longest = Math.max(source.width, source.height, 1);
  const boost = longest < 1600 ? Math.min(2, 2000 / longest) : 1;
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(source.width * boost));
  canvas.height = Math.max(1, Math.round(source.height * boost));
  const context = canvas.getContext("2d", { willReadFrequently: true, alpha: false });
  if (!context) return source;
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(source, 0, 0, canvas.width, canvas.height);

  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = image.data;
  let min = 255;
  let max = 0;
  for (let index = 0; index < pixels.length; index += 4) {
    const gray = 0.299 * pixels[index] + 0.587 * pixels[index + 1] + 0.114 * pixels[index + 2];
    pixels[index] = gray;
    if (gray < min) min = gray;
    if (gray > max) max = gray;
  }
  const range = Math.max(1, max - min);
  for (let index = 0; index < pixels.length; index += 4) {
    let gray = ((pixels[index] - min) / range) * 255;
    gray = Math.max(0, Math.min(255, (gray - 128) * 1.45 + 128));
    pixels[index] = pixels[index + 1] = pixels[index + 2] = gray;
    pixels[index + 3] = 255;
  }
  context.putImageData(image, 0, 0);
  return canvas;
}

function parseOcrData(data) {
  const words = (data.words || [])
    .map((word) => ({
      text: String(word.text || "").trim(),
      confidence: Number(word.confidence) || 0,
      x: word.bbox?.x0 || 0,
      y: word.bbox?.y0 || 0,
      x1: word.bbox?.x1 || 0,
      y1: word.bbox?.y1 || 0,
    }))
    .filter((word) => word.text && word.confidence >= MIN_WORD_CONFIDENCE);

  const lines = words.length ? clusterOcrLines(words) : fallbackOcrLines(data);
  const text = lines.join("\n").trim() || String(data.text || "").trim();
  const layout = lines.map((line, index) => ({
    text: line,
    x: 0,
    y: -index,
    height: 12,
    bold: false,
    italic: false,
  }));
  const boxes = words.map((word) => ({
    text: word.text,
    x: word.x,
    y: -word.y,
    width: Math.max(0, word.x1 - word.x),
  }));

  return { lines, text, boxes, layout };
}

function clusterOcrLines(words) {
  const sorted = [...words].sort((a, b) => a.y - b.y || a.x - b.x);
  const lines = [];
  sorted.forEach((word) => {
    const height = Math.max(8, word.y1 - word.y);
    const match = lines.find((line) => Math.abs(line.y - word.y) <= height * 0.55);
    if (match) {
      match.words.push(word);
      match.y = (match.y * (match.words.length - 1) + word.y) / match.words.length;
    } else {
      lines.push({ y: word.y, words: [word] });
    }
  });
  return lines.map((line) =>
    line.words
      .sort((a, b) => a.x - b.x)
      .map((word) => word.text)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim(),
  ).filter(Boolean);
}

function fallbackOcrLines(data) {
  const fromEngine = (data.lines || [])
    .map((line) => String(line.text || "").trim())
    .filter(Boolean);
  if (fromEngine.length) return fromEngine;
  return String(data.text || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}
