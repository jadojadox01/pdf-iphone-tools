import { loadPdfDocument, savePdf } from "./load";
import { report } from "./progress";
import { assertPdfFile, replaceExtension } from "./validate";

export async function signPdf(file, options = {}, onStatus) {
  await assertPdfFile(file);
  report(onStatus, 18, "Opening PDF…");
  const pdf = await loadPdfDocument(file, options.password);
  const pageIndex = Number(options.pageIndex) || 0;
  const page = pdf.getPage(pageIndex);
  const pngBytes = options.signaturePng;
  if (!pngBytes?.length) {
    throw new Error("Create a signature before saving.");
  }

  report(onStatus, 62, "Embedding signature…");
  const image = await pdf.embedPng(pngBytes);
  page.drawImage(image, {
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height,
  });

  const blob = await savePdf(pdf);
  report(onStatus, 100, "Preparing download…");
  return {
    blob,
    filename: replaceExtension(file.name, "pdf"),
    mime: "application/pdf",
    meta: { signed: true, page: pageIndex + 1 },
  };
}
