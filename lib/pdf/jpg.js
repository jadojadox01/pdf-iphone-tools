import { openPdfDocument, renderPageToCanvas, canvasToBlob } from "./pdfjs";
import { parsePageRanges, allPageNumbers } from "./pages";
import { report, span, yieldUi } from "./progress";
import { readFileBytes, replaceExtension, sanitizeFilename } from "./validate";
import { zipNamedBlobs } from "./zip";

const QUALITY_PRESETS = {
  high: { scale: 2.4, quality: 0.94 },
  recommended: { scale: 2, quality: 0.88 },
  small: { scale: 1.4, quality: 0.74 },
};

export async function convertPdfToJpg(file, options = {}, onStatus) {
  return convertPdfToRaster(file, { ...options, format: "jpg" }, onStatus);
}

export async function convertPdfToPng(file, options = {}, onStatus) {
  return convertPdfToRaster(file, { ...options, format: "png" }, onStatus);
}

export async function convertPdfToRaster(file, options = {}, onStatus) {
  const format = options.format === "png" ? "png" : "jpg";
  const mime = format === "png" ? "image/png" : "image/jpeg";
  const preset = QUALITY_PRESETS[options.quality] || QUALITY_PRESETS.recommended;
  const bytes = await readFileBytes(file);
  report(onStatus, 6, "Opening PDF…");
  const pdf = await openPdfDocument(bytes, options.password);
  const selected =
    options.pageMode === "selected"
      ? parsePageRanges(options.pageRange, pdf.numPages)
      : allPageNumbers(pdf.numPages);

  const images = [];
  const base = sanitizeFilename(file.name).replace(/\.[^.]+$/, "") || "page";

  for (let index = 0; index < selected.length; index += 1) {
    const pageNumber = selected[index];
    report(onStatus, span(10, 88, index, selected.length), `Rendering page ${pageNumber} (${index + 1} of ${selected.length})…`);
    await yieldUi();
    const page = await pdf.getPage(pageNumber);
    const { canvas } = await renderPageToCanvas(page, preset.scale);
    const blob =
      format === "png"
        ? await canvasToBlob(canvas, mime)
        : await canvasToBlob(canvas, mime, preset.quality);
    images.push({
      name:
        selected.length === 1
          ? replaceExtension(file.name, format)
          : `${base}-page-${pageNumber}.${format}`,
      blob,
    });
  }

  if (images.length === 1) {
    report(onStatus, 100, "Preparing download…");
    return {
      blob: images[0].blob,
      filename: images[0].name,
      mime,
      meta: { pages: images.length },
    };
  }

  report(onStatus, 92, "Creating ZIP…");
  const zip = await zipNamedBlobs(images, onStatus);
  return {
    blob: zip,
    filename: replaceExtension(file.name, "zip"),
    mime: "application/zip",
    meta: { pages: images.length, bundled: true },
  };
}
