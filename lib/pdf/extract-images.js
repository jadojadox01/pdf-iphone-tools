import { getPdfjs, openPdfDocument, canvasToBlob } from "./pdfjs";
import { report, span, yieldUi } from "./progress";
import { readFileBytes, replaceExtension, sanitizeFilename } from "./validate";
import { zipNamedBlobs } from "./zip";
import { ToolError } from "./errors";

const MIN_SIZE = 40;

export async function extractPdfImages(file, options = {}, onStatus) {
  if (typeof window === "undefined") {
    throw new ToolError(
      "CONVERSION_FAILED",
      "Image extraction runs in your browser.",
      "Open this tool in Safari or Chrome and try again.",
    );
  }

  const bytes = await readFileBytes(file);
  report(onStatus, 6, "Opening PDF…");
  const pdfjs = await getPdfjs();
  const pdf = await openPdfDocument(bytes, options.password);
  const images = [];
  const seen = new Set();
  const base = sanitizeFilename(file.name).replace(/\.[^.]+$/, "") || "image";

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    report(onStatus, span(10, 88, pageNumber - 1, pdf.numPages), `Looking for images on page ${pageNumber} of ${pdf.numPages}…`);
    await yieldUi();
    const page = await pdf.getPage(pageNumber);
    const operators = await page.getOperatorList();
    const opNames = Object.fromEntries(Object.entries(pdfjs.OPS || {}).map(([key, value]) => [value, key]));
    const names = [];
    for (let index = 0; index < operators.fnArray.length; index += 1) {
      const fn = operators.fnArray[index];
      const fnName = opNames[fn] || "";
      if (
        fn === pdfjs.OPS.paintImageXObject ||
        fn === pdfjs.OPS.paintImageXObjectRepeat ||
        fn === pdfjs.OPS.paintJpegXObject ||
        fn === pdfjs.OPS.paintInlineImageXObject ||
        /paintImage|paintJpeg|ImageXObject/i.test(fnName)
      ) {
        const args = operators.argsArray[index] || [];
        const name = imageNameFromArgs(args);
        if (name) names.push(name);
      }
    }

    for (const name of names) {
      const key = `${pageNumber}:${name}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const image = await getPageObject(page, name);
      if (!image?.width || !image?.height) continue;
      if (image.width < MIN_SIZE || image.height < MIN_SIZE) continue;
      const blob = await imageObjectToPng(image);
      if (!blob) continue;
      images.push({
        name: `${base}-p${pageNumber}-${images.length + 1}.png`,
        blob,
      });
    }
  }

  if (!images.length) {
    throw new ToolError(
      "CONVERSION_FAILED",
      "No embedded photos were found in this PDF.",
      "Scanned pages are pictures of the whole page. Use PDF to JPG or PDF to PNG to export those pages.",
    );
  }

  if (images.length === 1) {
    return {
      blob: images[0].blob,
      filename: replaceExtension(file.name, "png"),
      mime: "image/png",
      meta: { pages: 1, note: "This is an image stored inside the PDF, not a screenshot of the page." },
    };
  }

  onStatus?.("Creating ZIP…");
  const zip = await zipNamedBlobs(images, onStatus);
  return {
    blob: zip,
    filename: replaceExtension(file.name, "zip"),
    mime: "application/zip",
    meta: {
      pages: images.length,
      bundled: true,
      note: "These are images stored inside the PDF. Use PDF to JPG if you need a picture of each page.",
    },
  };
}

function imageNameFromArgs(args) {
  const list = Array.isArray(args) ? args : [args];
  for (const item of list) {
    if (typeof item === "string" && item) return item;
    if (typeof item === "number") continue;
    if (item && typeof item === "object") {
      if (typeof item.name === "string" && item.name) return item.name;
      if (typeof item.id === "string" && item.id) return item.id;
    }
  }
  return "";
}

function getPageObject(page, name) {
  return new Promise((resolve) => {
    try {
      const value = page.objs.get(name, (image) => resolve(image || null));
      if (value && typeof value.then === "function") {
        value.then((image) => resolve(image || null)).catch(() => resolve(null));
      }
    } catch {
      resolve(null);
    }
  });
}

async function imageObjectToPng(image) {
  const width = image.width;
  const height = image.height;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return null;

  if (image.bitmap) {
    context.drawImage(image.bitmap, 0, 0);
    return canvasToBlob(canvas, "image/png");
  }

  const pixels = context.createImageData(width, height);
  const src = image.data;
  if (!src) return null;

  const kind = image.kind;
  for (let index = 0; index < width * height; index += 1) {
    const dest = index * 4;
    if (kind === 3 || src.length >= width * height * 4) {
      const offset = index * 4;
      pixels.data[dest] = src[offset];
      pixels.data[dest + 1] = src[offset + 1];
      pixels.data[dest + 2] = src[offset + 2];
      pixels.data[dest + 3] = src[offset + 3] ?? 255;
    } else if (kind === 2 || src.length >= width * height * 3) {
      const offset = index * 3;
      pixels.data[dest] = src[offset];
      pixels.data[dest + 1] = src[offset + 1];
      pixels.data[dest + 2] = src[offset + 2];
      pixels.data[dest + 3] = 255;
    } else {
      const value = src[index] ?? 0;
      pixels.data[dest] = value;
      pixels.data[dest + 1] = value;
      pixels.data[dest + 2] = value;
      pixels.data[dest + 3] = 255;
    }
  }
  context.putImageData(pixels, 0, 0);
  return canvasToBlob(canvas, "image/png");
}
