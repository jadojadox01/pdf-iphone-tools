import PptxGenJS from "pptxgenjs";
import { openPdfDocument, renderPageToCanvas } from "./pdfjs";
import { allPageNumbers } from "./pages";
import { readFileBytes, replaceExtension } from "./validate";

export async function convertPdfToPpt(file, options = {}, onStatus) {
  const bytes = await readFileBytes(file);
  onStatus?.("Opening PDF…");
  const pdf = await openPdfDocument(bytes, options.password);
  const pages = allPageNumbers(pdf.numPages);
  const pptx = new PptxGenJS();
  let layoutName = "PDF_PAGE";

  for (let index = 0; index < pages.length; index += 1) {
    const pageNumber = pages[index];
    onStatus?.(`Placing page ${pageNumber} on a slide (${index + 1} of ${pages.length})…`);
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
    const widthIn = viewport.width / 72;
    const heightIn = viewport.height / 72;
    if (index === 0) {
      layoutName = `PDF_${Math.round(widthIn * 100)}x${Math.round(heightIn * 100)}`;
      pptx.defineLayout({ name: layoutName, width: widthIn, height: heightIn });
      pptx.layout = layoutName;
    }

    const { canvas } = await renderPageToCanvas(page, 1.8);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.86);
    const slide = pptx.addSlide();
    slide.addImage({
      data: dataUrl,
      x: 0,
      y: 0,
      w: widthIn,
      h: heightIn,
    });
  }

  onStatus?.("Creating PowerPoint file…");
  const output = await pptx.write({ outputType: "blob" });
  const blob =
    output instanceof Blob
      ? output
      : new Blob([output], {
          type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        });
  return {
    blob,
    filename: replaceExtension(file.name, "pptx"),
    mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    meta: {
      pages: pages.length,
      note: "Each PDF page was placed on a slide as an image. Text on the slides is not independently editable.",
    },
  };
}
