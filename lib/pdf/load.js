import { MAX_PAGES } from "@/lib/site";
import { ToolError, toToolError } from "./errors";
import { readFileBytes } from "./validate";

export async function loadPdfDocument(file, password = "") {
  const { PDFDocument } = await import("@cantoo/pdf-lib");
  const bytes = file instanceof Uint8Array ? file : await readFileBytes(file);

  try {
    const pdf = await PDFDocument.load(bytes, {
      password: password || undefined,
      ignoreEncryption: false,
    });

    if (pdf.getPageCount() > MAX_PAGES) {
      throw new ToolError(
        "TOO_LARGE",
        `This PDF has ${pdf.getPageCount()} pages. This tool supports up to ${MAX_PAGES} pages.`,
        "Split the PDF first, then process the part you need.",
      );
    }

    return pdf;
  } catch (error) {
    if (error instanceof ToolError) throw error;
    throw toToolError(error);
  }
}

export async function inspectPdf(file, password = "") {
  const pdf = await loadPdfDocument(file, password);
  const pages = pdf.getPageCount();
  const first = pages ? pdf.getPage(0).getSize() : { width: 0, height: 0 };
  return {
    pages,
    encrypted: Boolean(pdf.isEncrypted),
    width: first.width,
    height: first.height,
  };
}

export async function savePdf(pdf, { useObjectStreams = true } = {}) {
  const bytes = await pdf.save({ useObjectStreams });
  return new Blob([bytes], { type: "application/pdf" });
}
