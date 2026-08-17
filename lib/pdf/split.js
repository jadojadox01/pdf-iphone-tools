import { PDFDocument } from "@cantoo/pdf-lib";
import { loadPdfDocument, savePdf } from "./load";
import { parsePageRanges, allPageNumbers } from "./pages";
import { assertPdfFile, replaceExtension, sanitizeFilename } from "./validate";
import { zipNamedBlobs } from "./zip";
import { ToolError } from "./errors";

export async function splitPdf(file, options = {}, onStatus) {
  await assertPdfFile(file);
  onStatus?.("Opening PDF…");
  const source = await loadPdfDocument(file, options.password);
  const pageCount = source.getPageCount();
  const mode = options.mode || "extract";
  const groups = [];

  if (mode === "every") {
    allPageNumbers(pageCount).forEach((page) => groups.push([page]));
  } else if (mode === "ranges") {
    const pages = parsePageRanges(options.pageRange, pageCount);
    if (options.splitEachRange) {
      String(options.pageRange)
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
        .forEach((part) => {
          groups.push(parsePageRanges(part, pageCount));
        });
    } else {
      groups.push(pages);
    }
  } else {
    const pages = parsePageRanges(options.pageRange, pageCount);
    groups.push(pages);
  }

  if (!groups.length) {
    throw new ToolError("INVALID_FILE", "No pages were selected to split.");
  }

  const outputs = [];
  const base = sanitizeFilename(file.name).replace(/\.[^.]+$/, "") || "split";

  for (let index = 0; index < groups.length; index += 1) {
    const pages = groups[index];
    onStatus?.(`Creating PDF ${index + 1} of ${groups.length}…`);
    const doc = await PDFDocument.create();
    const copied = await doc.copyPages(
      source,
      pages.map((page) => page - 1),
    );
    copied.forEach((page) => doc.addPage(page));
    const blob = await savePdf(doc);
    const label =
      pages.length === 1 ? `page-${pages[0]}` : `pages-${pages[0]}-${pages[pages.length - 1]}`;
    outputs.push({
      name: groups.length === 1 ? replaceExtension(file.name, "pdf") : `${base}-${label}.pdf`,
      blob,
    });
  }

  if (outputs.length === 1) {
    return {
      blob: outputs[0].blob,
      filename: outputs[0].name,
      mime: "application/pdf",
      meta: { files: 1 },
    };
  }

  const zip = await zipNamedBlobs(outputs, onStatus);
  return {
    blob: zip,
    filename: `${base}-split.zip`,
    mime: "application/zip",
    meta: { files: outputs.length, bundled: true },
  };
}
