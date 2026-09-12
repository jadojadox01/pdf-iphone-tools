import { openPdfDocument, renderPageToCanvas, canvasToBlob } from "./pdfjs";
import { parsePageRanges, allPageNumbers } from "./pages";
import { readFileBytes, replaceExtension, sanitizeFilename } from "./validate";
import { zipNamedBlobs } from "./zip";

const QUALITY_PRESETS = {
  high: { scale: 2, quality: 0.92 },
  recommended: { scale: 1.6, quality: 0.82 },
  small: { scale: 1.2, quality: 0.68 },
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
  onStatus?.("Opening PDF…");
  const pdf = await openPdfDocument(bytes, options.password);
  const selected =
    options.pageMode === "selected"
      ? parsePageRanges(options.pageRange, pdf.numPages)
      : allPageNumbers(pdf.numPages);

  const images = [];
  const base = sanitizeFilename(file.name).replace(/\.[^.]+$/, "") || "page";

  for (let index = 0; index < selected.length; index += 1) {
    const pageNumber = selected[index];
    onStatus?.(`Rendering page ${pageNumber} (${index + 1} of ${selected.length})…`);
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
    return {
      blob: images[0].blob,
      filename: images[0].name,
      mime,
      meta: { pages: images.length },
    };
  }

  onStatus?.("Creating ZIP…");
  const zip = await zipNamedBlobs(images, onStatus);
  return {
    blob: zip,
    filename: replaceExtension(file.name, "zip"),
    mime: "application/zip",
    meta: { pages: images.length, bundled: true },
  };
}
