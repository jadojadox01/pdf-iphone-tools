import { openPdfDocument, renderPageToCanvas, canvasToBlob } from "./pdfjs";
import { parsePageRanges, allPageNumbers } from "./pages";
import { readFileBytes, replaceExtension, sanitizeFilename } from "./validate";
import { zipNamedBlobs } from "./zip";

const QUALITY_PRESETS = {
  high: { scale: 2, quality: 0.92, label: "High" },
  recommended: { scale: 1.6, quality: 0.82, label: "Recommended" },
  small: { scale: 1.2, quality: 0.68, label: "Smaller file" },
};

export async function convertPdfToJpg(file, options = {}, onStatus) {
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
    const blob = await canvasToBlob(canvas, "image/jpeg", preset.quality);
    images.push({
      name: selected.length === 1 ? replaceExtension(file.name, "jpg") : `${base}-page-${pageNumber}.jpg`,
      blob,
    });
  }

  if (images.length === 1) {
    return {
      blob: images[0].blob,
      filename: images[0].name,
      mime: "image/jpeg",
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
