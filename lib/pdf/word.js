import { Document, Packer, Paragraph, TextRun } from "docx";
import { extractPdfTextWithOcr } from "./ocr";
import { replaceExtension } from "./validate";

export async function convertPdfToWord(file, options = {}, onStatus) {
  onStatus?.("Reading PDF…");
  const extracted = await extractPdfTextWithOcr(file, options.password, onStatus);

  onStatus?.("Creating Word document…");
  const children = [];

  extracted.pages.forEach((page, pageIndex) => {
    if (pageIndex > 0) {
      children.push(
        new Paragraph({
          spacing: { before: 240, after: 240 },
          children: [
            new TextRun({
              text: `Page ${page.pageNumber}`,
              italics: true,
              color: "666666",
              size: 20,
            }),
          ],
        }),
      );
    }

    const blocks = page.text.split(/\n{2,}/);
    blocks.forEach((block) => {
      const lines = block.split("\n");
      lines.forEach((line, lineIndex) => {
        children.push(
          new Paragraph({
            spacing: { after: lineIndex === lines.length - 1 ? 200 : 40 },
            children: [
              new TextRun({
                text: line,
                size: 22,
                font: "Calibri",
              }),
            ],
          }),
        );
      });
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: children.length
          ? children
          : [new Paragraph({ children: [new TextRun("")] })],
      },
    ],
  });

  onStatus?.("Preparing download…");
  const blob = await Packer.toBlob(doc);
  return {
    blob,
    filename: replaceExtension(file.name, "docx"),
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    meta: {
      pages: extracted.pageCount,
      ocr: Boolean(extracted.ocr),
      note: extracted.ocr
        ? `OCR read ${extracted.ocrPages} scanned page${extracted.ocrPages === 1 ? "" : "s"} in your browser. Check the Word file — photos and handwriting are often imperfect.`
        : "Text was extracted from a text-based PDF. Complex layouts may not match the original page design.",
    },
  };
}
