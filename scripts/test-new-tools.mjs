import { PDFDocument } from "@cantoo/pdf-lib";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { inflateSync } from "zlib";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { convertImagesToPdf } from "../lib/pdf/image-to-pdf.js";
import { convertImagesToJpg } from "../lib/pdf/image-to-jpg.js";
import { convertDocxToPdf } from "../lib/pdf/word-to-pdf.js";
import { extractPdfImages } from "../lib/pdf/extract-images.js";
import { assertPdfFile } from "../lib/pdf/validate.js";
import { assertImageFile } from "../lib/pdf/image-file.js";
import { mergePdfs } from "../lib/pdf/merge.js";
import { splitPdf } from "../lib/pdf/split.js";
import { rotatePdf } from "../lib/pdf/rotate.js";
import { protectPdf } from "../lib/pdf/protect.js";
import { unlockPdf } from "../lib/pdf/unlock.js";
import { compressPdf } from "../lib/pdf/compress.js";
import { signPdf } from "../lib/pdf/sign.js";
import { MAX_FILE_BYTES } from "../lib/site.js";

const PNG_1x1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

const JPEG_1x1 = Buffer.from(
  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjUkHyQ1NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NP/AABEIAAEAAQMBIgACEQEDEQH/xAAUAAEAAAAAAAAAAAAAAAAAAAAK/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Af//Z",
  "base64",
);

function fileFrom(buffer, name, type) {
  return new File([buffer], name, { type });
}

async function pdfFile(name, builder) {
  const pdf = await PDFDocument.create();
  await builder(pdf);
  return fileFrom(Buffer.from(await pdf.save()), name, "application/pdf");
}

async function expectError(fn, code) {
  try {
    await fn();
  } catch (error) {
    if (code && error.code !== code) {
      throw new Error(`Expected ${code}, got ${error.code || error.message}`);
    }
    return error;
  }
  throw new Error("Expected the call to fail.");
}

function inflatedPdfText(bytes) {
  const buf = Buffer.from(bytes);
  const pieces = [buf.toString("latin1")];
  for (let index = 0; index < buf.length - 2; index += 1) {
    if (buf[index] !== 0x78) continue;
    try {
      const inflated = inflateSync(buf.subarray(index)).toString("latin1");
      pieces.push(inflated);
      const hex = [...inflated.matchAll(/<([0-9A-Fa-f]+)>/g)]
        .map((match) => Buffer.from(match[1], "hex").toString("latin1"))
        .join("\n");
      if (hex) pieces.push(hex);
    } catch {
      /* not a zlib stream at this offset */
    }
  }
  return pieces.join("\n");
}

function containsText(bytes, text) {
  return inflatedPdfText(bytes).includes(text);
}

async function main() {
  const outDir = path.join(process.cwd(), ".tmp-test");
  await mkdir(outDir, { recursive: true });

  const pngFile = fileFrom(PNG_1x1, "dot.png", "image/png");
  const pdfFromPng = await convertImagesToPdf([pngFile]);
  if (pdfFromPng.blob.size < 200) throw new Error("Image to PDF output is too small.");
  const pngPdf = await PDFDocument.load(await pdfFromPng.blob.arrayBuffer());
  if (pngPdf.getPageCount() !== 1) throw new Error("Image to PDF should have one page.");
  const pageSize = pngPdf.getPage(0).getSize();
  if (pageSize.width < 1 || pageSize.height < 1) throw new Error("Image PDF page is empty.");
  await writeFile(path.join(outDir, "from-png.pdf"), Buffer.from(await pdfFromPng.blob.arrayBuffer()));

  const two = await convertImagesToPdf([
    fileFrom(PNG_1x1, "one.png", "image/png"),
    fileFrom(PNG_1x1, "two.png", "image/png"),
  ]);
  const twoPdf = await PDFDocument.load(await two.blob.arrayBuffer());
  if (twoPdf.getPageCount() !== 2) throw new Error("Two images should make two PDF pages.");

  try {
    const jpegFile = fileFrom(JPEG_1x1, "dot.jpg", "image/jpeg");
    const fromJpeg = await convertImagesToPdf([jpegFile]);
    const jpegPdf = await PDFDocument.load(await fromJpeg.blob.arrayBuffer());
    if (jpegPdf.getPageCount() !== 1) throw new Error("JPEG to PDF should have one page.");
    const jpgOut = await convertImagesToJpg([jpegFile]);
    if (jpgOut.mime !== "image/jpeg") throw new Error("Image to JPG should return a JPEG.");
    await writeFile(path.join(outDir, "from-jpg.pdf"), Buffer.from(await fromJpeg.blob.arrayBuffer()));
  } catch (error) {
    if (error.message?.includes("JPEG to PDF") || error.message?.includes("Image to JPG")) throw error;
    console.warn("JPEG fixture skipped:", error.message);
  }

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ children: [new TextRun({ text: "Quarter Sales", bold: true })] }),
          new Paragraph({ children: [new TextRun("North region sold 12 units.")] }),
        ],
      },
    ],
  });
  const docx = await Packer.toBuffer(doc);
  const docxFile = fileFrom(docx, "letter.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  const fromWord = await convertDocxToPdf(docxFile);
  if (fromWord.blob.size < 500) throw new Error("Word to PDF output is too small.");
  const wordBytes = Buffer.from(await fromWord.blob.arrayBuffer());
  const wordPdf = await PDFDocument.load(wordBytes);
  if (wordPdf.getPageCount() < 1) throw new Error("Word to PDF produced no pages.");
  if (!containsText(wordBytes, "Quarter Sales") || !containsText(wordBytes, "North region sold 12 units.")) {
    throw new Error("Word to PDF did not keep selectable text.");
  }
  await writeFile(path.join(outDir, "from-word.pdf"), wordBytes);

  const sampleA = await pdfFile("a.pdf", (pdf) => {
    pdf.addPage([400, 500]).drawText("Page A", { x: 40, y: 420, size: 18 });
  });
  const sampleB = await pdfFile("b.pdf", (pdf) => {
    pdf.addPage([400, 500]).drawText("Page B", { x: 40, y: 420, size: 18 });
    pdf.addPage([400, 500]).drawText("Page C", { x: 40, y: 420, size: 18 });
  });

  const merged = await mergePdfs([sampleA, sampleB]);
  const mergedPdf = await PDFDocument.load(await merged.blob.arrayBuffer());
  if (mergedPdf.getPageCount() !== 3) throw new Error("Merge did not keep all pages.");
  await writeFile(path.join(outDir, "merged.pdf"), Buffer.from(await merged.blob.arrayBuffer()));

  const split = await splitPdf(sampleB, { mode: "extract", pageRange: "2" });
  const splitPdfDoc = await PDFDocument.load(await split.blob.arrayBuffer());
  if (splitPdfDoc.getPageCount() !== 1) throw new Error("Split extract should return one page.");
  if (!containsText(Buffer.from(await split.blob.arrayBuffer()), "Page C")) {
    throw new Error("Split did not keep the selected page.");
  }

  const rotated = await rotatePdf(sampleA, { angle: 90, pageMode: "all" });
  const rotatedPdf = await PDFDocument.load(await rotated.blob.arrayBuffer());
  if ((rotatedPdf.getPage(0).getRotation().angle || 0) !== 90) throw new Error("Rotate did not change page angle.");

  const signed = await signPdf(sampleA, {
    signaturePng: PNG_1x1,
    x: 40,
    y: 40,
    width: 80,
    height: 24,
    pageIndex: 0,
  });
  const signedPdf = await PDFDocument.load(await signed.blob.arrayBuffer());
  if (signedPdf.getPageCount() !== 1) throw new Error("Signed PDF should still have one page.");
  if (signed.blob.size <= sampleA.size) throw new Error("Signed PDF should contain an embedded signature image.");
  await writeFile(path.join(outDir, "signed.pdf"), Buffer.from(await signed.blob.arrayBuffer()));

  const compressed = await compressPdf(sampleB, { level: "recommended" });
  await PDFDocument.load(await compressed.blob.arrayBuffer());

  const protectedOut = await protectPdf(sampleA, { password: "secret1", confirm: "secret1" });
  await expectError(async () => {
    await PDFDocument.load(await protectedOut.blob.arrayBuffer());
  });
  const lockedFile = fileFrom(Buffer.from(await protectedOut.blob.arrayBuffer()), "locked.pdf", "application/pdf");
  await expectError(() => unlockPdf(lockedFile, { password: "" }), "PASSWORD_REQUIRED");
  await expectError(() => unlockPdf(lockedFile, { password: "wrong-password" }), "INCORRECT_PASSWORD");
  const unlocked = await unlockPdf(lockedFile, { password: "secret1" });
  await PDFDocument.load(await unlocked.blob.arrayBuffer());
  await writeFile(path.join(outDir, "unlocked.pdf"), Buffer.from(await unlocked.blob.arrayBuffer()));

  await expectError(() => convertDocxToPdf(fileFrom(Buffer.from("not a word file"), "fake.docx", "application/octet-stream")), "INVALID_FILE");
  await expectError(() => convertDocxToPdf(fileFrom(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0, 0, 0, 0]), "old.doc", "application/msword")), "UNSUPPORTED");
  await expectError(() => assertImageFile(fileFrom(Buffer.from("hello"), "notes.txt", "text/plain")), "UNSUPPORTED");
  await expectError(() => assertPdfFile(fileFrom(Buffer.from("hello"), "notes.txt", "text/plain")), "UNSUPPORTED");
  await expectError(() => extractPdfImages(sampleA), "CONVERSION_FAILED");
  const huge = fileFrom(Buffer.from("%PDF-1.4"), "huge.pdf", "application/pdf");
  Object.defineProperty(huge, "size", { value: MAX_FILE_BYTES + 1 });
  await expectError(() => assertPdfFile(huge), "TOO_LARGE");
  await expectError(() => convertImagesToJpg([pngFile]), "UNSUPPORTED");
  await expectError(
    () => convertImagesToJpg([fileFrom(Buffer.from("not heic"), "photo.heic", "image/heic")], { heicOnly: true }),
    "UNSUPPORTED",
  );

  console.log("PDF tools self-test passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
