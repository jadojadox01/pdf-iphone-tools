import { PDFDocument } from "@cantoo/pdf-lib";
import { assertImageFiles, rasterizeImageToJpeg, sniffImageKind } from "./image-file";
import { ToolError } from "./errors";
import { readFileBytes, replaceExtension, sanitizeFilename } from "./validate";
import { savePdf } from "./load";

const A4 = { width: 595.28, height: 841.89 };

export async function convertImagesToPdf(files, options = {}, onStatus) {
  const list = await assertImageFiles(files, { minFiles: 1 });
  onStatus?.("Building PDF…");
  const pdf = await PDFDocument.create();

  for (let index = 0; index < list.length; index += 1) {
    const file = list[index];
    onStatus?.(`Adding image ${index + 1} of ${list.length}…`);
    const bytes = await readFileBytes(file);
    const kind = sniffImageKind(bytes, file);
    let image;
    if (kind === "jpeg") {
      image = await pdf.embedJpg(bytes);
    } else if (kind === "png") {
      try {
        image = await pdf.embedPng(bytes);
      } catch {
        if (typeof document === "undefined") {
          throw new ToolError(
            "CONVERSION_FAILED",
            "This PNG could not be placed in a PDF.",
            "Try saving it as JPG, or open this tool in a browser.",
          );
        }
        const jpeg = await rasterizeImageToJpeg(file, 0.9, onStatus);
        image = await pdf.embedJpg(jpeg);
      }
    } else {
      const jpeg = await rasterizeImageToJpeg(file, 0.9, onStatus);
      image = await pdf.embedJpg(jpeg);
    }

    const { width, height } = fitToPage(image.width, image.height, A4.width, A4.height);
    const page = pdf.addPage([width, height]);
    page.drawImage(image, { x: 0, y: 0, width, height });
  }

  onStatus?.("Saving PDF…");
  const blob = await savePdf(pdf);
  const first = sanitizeFilename(list[0].name);
  return {
    blob,
    filename: list.length === 1 ? replaceExtension(first, "pdf") : "images.pdf",
    mime: "application/pdf",
    meta: { pages: pdf.getPageCount(), note: "Images are placed full-page without cropping." },
  };
}

function fitToPage(imgW, imgH, maxW, maxH) {
  const scale = Math.min(maxW / Math.max(imgW, 1), maxH / Math.max(imgH, 1), 1);
  return {
    width: Math.max(1, imgW * scale),
    height: Math.max(1, imgH * scale),
  };
}
