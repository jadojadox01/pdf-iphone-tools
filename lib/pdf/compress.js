import { PDFDocument } from "@cantoo/pdf-lib";
import { loadPdfDocument, savePdf } from "./load";
import { openPdfDocument, renderPageToCanvas, canvasToJpegBytes } from "./pdfjs";
import { assertPdfFile, readFileBytes, replaceExtension } from "./validate";
import { percentChange } from "@/lib/site";

const LEVELS = {
  low: { label: "Low compression / high quality", raster: false },
  recommended: { label: "Recommended", raster: false },
  strong: { label: "Strong compression / smaller file", raster: true, scale: 1.15, quality: 0.52 },
};

export async function compressPdf(file, options = {}, onStatus) {
  await assertPdfFile(file);
  const level = LEVELS[options.level] || LEVELS.recommended;
  const originalSize = file.size;

  let blob;
  if (level.raster) {
    onStatus?.("Rebuilding pages as compressed images…");
    blob = await rasterizePdf(file, options.password, level, onStatus);
  } else {
    onStatus?.("Optimizing PDF structure…");
    const pdf = await loadPdfDocument(file, options.password);
    pdf.setTitle(pdf.getTitle() || "");
    pdf.setProducer("PDF iPhone Tools");
    const rebuilt = await PDFDocument.create();
    const pages = await rebuilt.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => rebuilt.addPage(page));
    blob = await savePdf(rebuilt, { useObjectStreams: true });
  }

  const reduction = percentChange(originalSize, blob.size);
  return {
    blob,
    filename: replaceExtension(file.name, "pdf"),
    mime: "application/pdf",
    meta: {
      originalSize,
      compressedSize: blob.size,
      reduction,
      increased: blob.size >= originalSize,
      rasterized: Boolean(level.raster),
      note: level.raster
        ? "Strong compression converts pages to images. Text may no longer be selectable."
        : "Recommended compression keeps original page objects and may not shrink every file.",
    },
  };
}

async function rasterizePdf(file, password, level, onStatus) {
  const { PDFDocument } = await import("@cantoo/pdf-lib");
  const bytes = await readFileBytes(file);
  const pdfjsDoc = await openPdfDocument(bytes, password);
  const out = await PDFDocument.create();

  for (let pageNumber = 1; pageNumber <= pdfjsDoc.numPages; pageNumber += 1) {
    onStatus?.(`Compressing page ${pageNumber} of ${pdfjsDoc.numPages}…`);
    const page = await pdfjsDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
    const { canvas } = await renderPageToCanvas(page, level.scale);
    const jpg = await canvasToJpegBytes(canvas, level.quality);
    const image = await out.embedJpg(jpg);
    const next = out.addPage([viewport.width, viewport.height]);
    next.drawImage(image, {
      x: 0,
      y: 0,
      width: viewport.width,
      height: viewport.height,
    });
  }

  return savePdf(out, { useObjectStreams: true });
}
