import { PDFDocument, degrees } from "@cantoo/pdf-lib";
import { Document, Packer, Paragraph, TextRun } from "docx";
import ExcelJS from "exceljs";
import JSZip from "jszip";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

async function samplePdf() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  page.drawText("Quarter Sales", { x: 50, y: 740, size: 18 });
  page.drawText("Region    Q1    Q2", { x: 50, y: 700, size: 12 });
  page.drawText("North     10    12", { x: 50, y: 680, size: 12 });
  page.drawText("South     8     15", { x: 50, y: 660, size: 12 });
  page.drawText("This is a second paragraph of extractable text for Word output.", {
    x: 50,
    y: 620,
    size: 12,
  });
  const second = pdf.addPage([612, 792]);
  second.drawText("Page two", { x: 50, y: 740, size: 18 });
  return pdf.save();
}

async function main() {
  const outDir = path.join(process.cwd(), ".tmp-test");
  await mkdir(outDir, { recursive: true });
  const original = await samplePdf();
  await writeFile(path.join(outDir, "sample.pdf"), original);

  const first = await PDFDocument.load(original);
  const second = await PDFDocument.load(original);
  const merged = await PDFDocument.create();
  for (const source of [first, second]) {
    const pages = await merged.copyPages(source, source.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }
  const mergedBytes = await merged.save();
  if (merged.getPageCount() !== 4) throw new Error("Merge did not keep all pages");
  await writeFile(path.join(outDir, "merged.pdf"), mergedBytes);

  const splitSource = await PDFDocument.load(mergedBytes);
  const onlySecond = await PDFDocument.create();
  const copied = await onlySecond.copyPages(splitSource, [1]);
  onlySecond.addPage(copied[0]);
  await writeFile(path.join(outDir, "split.pdf"), await onlySecond.save());

  const rotated = await PDFDocument.load(original);
  rotated.getPage(0).setRotation(degrees(90));
  await writeFile(path.join(outDir, "rotated.pdf"), await rotated.save());

  const locked = await PDFDocument.load(original);
  locked.encrypt({ userPassword: "secret", ownerPassword: "secret" });
  const lockedBytes = await locked.save();
  await writeFile(path.join(outDir, "locked.pdf"), lockedBytes);
  const unlocked = await PDFDocument.load(lockedBytes, { password: "secret" });
  await writeFile(path.join(outDir, "unlocked.pdf"), await unlocked.save());

  const doc = new Document({
    sections: [{ children: [new Paragraph({ children: [new TextRun("Quarter Sales")] })] }],
  });
  const word = await Packer.toBuffer(doc);
  if (word.length < 1000) throw new Error("DOCX looks too small");
  await writeFile(path.join(outDir, "sample.docx"), word);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Sheet1");
  sheet.addRows([
    ["Region", "Q1", "Q2"],
    ["North", 10, 12],
    ["South", 8, 15],
  ]);
  const xlsx = await workbook.xlsx.writeBuffer();
  await writeFile(path.join(outDir, "sample.xlsx"), Buffer.from(xlsx));

  const zip = new JSZip();
  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });
  zip.file("EPUB/content.opf", "<package></package>");
  const epub = await zip.generateAsync({ type: "nodebuffer" });
  if (epub.length < 50) throw new Error("EPUB looks too small");
  await writeFile(path.join(outDir, "sample.epub"), epub);

  const { default: PptxGenJS } = await import("pptxgenjs");
  const ppt = new PptxGenJS();
  const slide = ppt.addSlide();
  slide.addText("PDF page 1", { x: 0.5, y: 0.5, fontSize: 18 });
  const pptx = await ppt.write("nodebuffer");
  if (!pptx || pptx.length < 1000) throw new Error("PPTX looks too small");
  await writeFile(path.join(outDir, "sample.pptx"), pptx);

  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  );
  const signed = await PDFDocument.load(original);
  const image = await signed.embedPng(png);
  signed.getPage(0).drawImage(image, { x: 40, y: 40, width: 80, height: 24 });
  await writeFile(path.join(outDir, "signed.pdf"), await signed.save());

  const compressed = await PDFDocument.create();
  const source = await PDFDocument.load(original);
  const copiedPages = await compressed.copyPages(source, source.getPageIndices());
  copiedPages.forEach((page) => compressed.addPage(page));
  await writeFile(path.join(outDir, "compressed.pdf"), await compressed.save({ useObjectStreams: true }));

  console.log("PDF tool self-test passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
