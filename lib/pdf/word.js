import { Document, HeadingLevel, ImageRun, Packer, Paragraph, TextRun } from "docx";
import { extractPdfTextWithOcr } from "./ocr";
import { canvasToBlob, openPdfDocument, renderPageToCanvas } from "./pdfjs";
import { report } from "./progress";
import { readFileBytes, replaceExtension } from "./validate";

export async function convertPdfToWord(file, options = {}, onStatus) {
  report(onStatus, 4, "Reading PDF…");
  const extracted = await extractPdfTextWithOcr(file, options.password, onStatus);

  report(onStatus, 88, "Creating Word document…");
  const children = [];
  const medianSize =
    median(extracted.pages.flatMap((page) => (page.layout || []).map((line) => line.height)).filter(Boolean)) || 12;

  for (let pageIndex = 0; pageIndex < extracted.pages.length; pageIndex += 1) {
    const page = extracted.pages[pageIndex];
    if (pageIndex > 0) {
      children.push(
        new Paragraph({
          pageBreakBefore: true,
          children: [new TextRun("")],
        }),
      );
    }

    const blocks = linesToParagraphs(page.layout?.length ? page.layout : fallbackLayout(page), medianSize);
    blocks.forEach((block) => {
      children.push(
        new Paragraph({
          heading: block.heading ? HeadingLevel.HEADING_2 : undefined,
          spacing: {
            after: block.heading ? 160 : 140,
            line: 276,
            lineRule: "auto",
          },
          indent: block.indent ? { left: 360 } : undefined,
          children: [
            new TextRun({
              text: block.text,
              bold: block.heading || block.bold,
              italics: block.italic,
              size: block.heading ? 32 : Math.round(Math.min(36, Math.max(20, (block.size || 12) * 1.85))),
              font: "Calibri",
            }),
          ],
        }),
      );
    });

    const thinText = String(page.text || "").replace(/\s+/g, "").length < 80;
    if (!blocks.length || (page.ocr && thinText)) {
      const image = await pageImageRun(file, page.pageNumber, options.password);
      if (image) {
        children.push(new Paragraph({ spacing: { before: 120, after: 200 }, children: [image] }));
      } else if (!blocks.length) {
        children.push(
          new Paragraph({
            spacing: { after: 120 },
            children: [new TextRun({ text: "", size: 22, font: "Calibri" })],
          }),
        );
      }
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 720, right: 720 },
          },
        },
        children: children.length ? children : [new Paragraph({ children: [new TextRun("")] })],
      },
    ],
  });

  report(onStatus, 97, "Preparing download…");
  const blob = await Packer.toBlob(doc);
  return {
    blob,
    filename: replaceExtension(file.name, "docx"),
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    meta: {
      pages: extracted.pageCount,
      ocr: Boolean(extracted.ocr),
      note: extracted.ocr
        ? extracted.ocrWeak
          ? "Little printed text could be read, so page images were added to the Word file. Check the result."
          : `OCR read ${extracted.ocrPages} scanned page${extracted.ocrPages === 1 ? "" : "s"} in your browser. Check names and numbers in the Word file.`
        : "Text was taken from the PDF in reading order. Complex columns and graphics may not match the original page design.",
    },
  };
}

async function pageImageRun(file, pageNumber, password) {
  try {
    const bytes = await readFileBytes(file);
    const pdf = await openPdfDocument(bytes, password);
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
    const { canvas } = await renderPageToCanvas(page, 1.7);
    const blob = await canvasToBlob(canvas, "image/jpeg", 0.86);
    const data = new Uint8Array(await blob.arrayBuffer());
    const width = 520;
    const height = Math.max(1, Math.round((width * viewport.height) / Math.max(viewport.width, 1)));
    return new ImageRun({
      type: "jpg",
      data,
      transformation: { width, height },
    });
  } catch {
    return null;
  }
}

function fallbackLayout(page) {
  return (page.lines || String(page.text || "").split(/\n/))
    .map((text) => String(text || "").trim())
    .filter(Boolean)
    .map((text, index) => ({ text, x: 0, y: -index, height: 12, bold: false, italic: false }));
}

function linesToParagraphs(layout, medianSize) {
  const lines = (layout || []).filter((line) => String(line.text || "").trim());
  if (!lines.length) return [];

  const lefts = lines.map((line) => line.x || 0).sort((a, b) => a - b);
  const leftEdge = lefts[Math.floor(lefts.length * 0.2)] || 0;
  const paragraphs = [];
  let current = null;

  lines.forEach((line, index) => {
    const text = String(line.text).trim();
    const previous = lines[index - 1];
    const gap = previous ? Math.abs((previous.y || 0) - (line.y || 0)) : 0;
    const heading = (line.height || 12) > medianSize * 1.28 || (line.bold && (line.height || 12) > medianSize * 1.08);
    const indent = (line.x || 0) - leftEdge > Math.max(18, medianSize * 1.4);
    const shouldBreak =
      !current ||
      heading ||
      current.heading ||
      gap > (line.height || 12) * 1.45 ||
      looksLikeNewParagraph(text, current.text);

    if (shouldBreak) {
      current = {
        text,
        heading,
        bold: Boolean(line.bold),
        italic: Boolean(line.italic),
        size: line.height || 12,
        indent,
      };
      paragraphs.push(current);
      return;
    }

    current.text = `${current.text} ${text}`.replace(/\s+/g, " ").trim();
    current.bold = current.bold && line.bold;
    current.italic = current.italic || line.italic;
  });

  return paragraphs;
}

function looksLikeNewParagraph(text, previous) {
  if (/^[•·‣◦\-\u2013\u2014]\s+/.test(text) || /^\d+[.)]\s+/.test(text)) return true;
  if (previous && /[.!?:]$/.test(previous) && /^[A-Z0-9“"]/.test(text)) return true;
  return false;
}

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}
