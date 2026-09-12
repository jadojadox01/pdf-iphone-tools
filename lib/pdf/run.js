import { toToolError } from "./errors";

export async function runTool(slug, files, options, onStatus) {
  try {
    switch (slug) {
      case "pdf-to-word": {
        const { convertPdfToWord } = await import("./word");
        return convertPdfToWord(files[0], options, onStatus);
      }
      case "pdf-to-jpg": {
        const { convertPdfToJpg } = await import("./jpg");
        return convertPdfToJpg(files[0], options, onStatus);
      }
      case "pdf-to-excel": {
        const { convertPdfToExcel } = await import("./excel");
        return convertPdfToExcel(files[0], options, onStatus);
      }
      case "pdf-to-ppt": {
        const { convertPdfToPpt } = await import("./ppt");
        return convertPdfToPpt(files[0], options, onStatus);
      }
      case "pdf-to-ebook": {
        const { convertPdfToEpub } = await import("./epub");
        return convertPdfToEpub(files[0], options, onStatus);
      }
      case "merge-pdf": {
        const { mergePdfs } = await import("./merge");
        return mergePdfs(files, options, onStatus);
      }
      case "split-pdf": {
        const { splitPdf } = await import("./split");
        return splitPdf(files[0], options, onStatus);
      }
      case "compress-pdf": {
        const { compressPdf } = await import("./compress");
        return compressPdf(files[0], options, onStatus);
      }
      case "rotate-pdf": {
        const { rotatePdf } = await import("./rotate");
        return rotatePdf(files[0], options, onStatus);
      }
      case "protect-pdf": {
        const { protectPdf } = await import("./protect");
        return protectPdf(files[0], options, onStatus);
      }
      case "unlock-pdf": {
        const { unlockPdf } = await import("./unlock");
        return unlockPdf(files[0], options, onStatus);
      }
      case "sign-pdf": {
        const { signPdf } = await import("./sign");
        return signPdf(files[0], options, onStatus);
      }
      case "word-to-pdf": {
        const { convertDocxToPdf } = await import("./word-to-pdf");
        return convertDocxToPdf(files[0], options, onStatus);
      }
      case "image-to-pdf": {
        const { convertImagesToPdf } = await import("./image-to-pdf");
        return convertImagesToPdf(files, options, onStatus);
      }
      case "pdf-to-png": {
        const { convertPdfToPng } = await import("./jpg");
        return convertPdfToPng(files[0], options, onStatus);
      }
      case "heic-to-jpg":
      case "image-to-jpg": {
        const { convertImagesToJpg } = await import("./image-to-jpg");
        return convertImagesToJpg(files, { ...options, heicOnly: slug === "heic-to-jpg" }, onStatus);
      }
      case "extract-images": {
        const { extractPdfImages } = await import("./extract-images");
        return extractPdfImages(files[0], options, onStatus);
      }
      default:
        throw new Error("Unknown tool.");
    }
  } catch (error) {
    throw toToolError(error);
  }
}
