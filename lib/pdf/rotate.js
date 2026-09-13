import { PDFDocument, degrees } from "@cantoo/pdf-lib";
import { loadPdfDocument, savePdf } from "./load";
import { parsePageRanges, allPageNumbers } from "./pages";
import { report } from "./progress";
import { assertPdfFile, replaceExtension } from "./validate";

export async function rotatePdf(file, options = {}, onStatus) {
  await assertPdfFile(file);
  const angle = Number(options.angle) || 90;
  report(onStatus, 12, "Opening PDF…");
  const pdf = await loadPdfDocument(file, options.password);
  const pageCount = pdf.getPageCount();
  const selected =
    options.pageMode === "selected"
      ? parsePageRanges(options.pageRange, pageCount)
      : allPageNumbers(pageCount);

  report(onStatus, 55, "Rotating pages…");
  selected.forEach((pageNumber) => {
    const page = pdf.getPage(pageNumber - 1);
    const current = page.getRotation().angle || 0;
    page.setRotation(degrees((current + angle) % 360));
  });

  const blob = await savePdf(pdf);
  report(onStatus, 100, "Preparing download…");
  return {
    blob,
    filename: replaceExtension(file.name, "pdf"),
    mime: "application/pdf",
    meta: { rotated: selected.length, angle },
  };
}
