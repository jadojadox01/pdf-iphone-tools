import { PDFDocument } from "@cantoo/pdf-lib";
import { loadPdfDocument, savePdf } from "./load";
import { assertPdfFiles } from "./validate";

export async function mergePdfs(files, options = {}, onStatus) {
  const list = await assertPdfFiles(files);
  onStatus?.("Preparing merged PDF…");
  const merged = await PDFDocument.create();

  for (let index = 0; index < list.length; index += 1) {
    const file = list[index];
    onStatus?.(`Adding ${file.name} (${index + 1} of ${list.length})…`);
    const source = await loadPdfDocument(file, options.passwords?.[index] || options.password);
    const pages = await merged.copyPages(source, source.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }

  onStatus?.("Saving merged PDF…");
  const blob = await savePdf(merged);
  return {
    blob,
    filename: "merged.pdf",
    mime: "application/pdf",
    meta: { files: list.length, pages: merged.getPageCount() },
  };
}
