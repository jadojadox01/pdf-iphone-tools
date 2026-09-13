import { ToolError } from "./errors";
import { openPdfDocument } from "./pdfjs";
import { report, span, yieldUi } from "./progress";
import { readFileBytes } from "./validate";

export async function extractPdfText(file, password = "", onStatus) {
  const bytes = await readFileBytes(file);
  const pdf = await openPdfDocument(bytes, password);
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    report(onStatus, span(8, 40, pageNumber - 1, pdf.numPages), `Reading page ${pageNumber} of ${pdf.numPages}…`);
    await yieldUi();
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const layout = itemsToLayout(textContent.items);
    pages.push({
      pageNumber,
      layout,
      lines: layout.map((line) => line.text),
      text: layout.map((line) => line.text).join("\n").trim(),
    });
  }

  const fullText = pages.map((page) => page.text).filter(Boolean).join("\n\n");
  const chars = fullText.replace(/\s+/g, "").length;
  const scanned = pdf.numPages > 0 && chars / pdf.numPages < 25;

  return {
    pageCount: pdf.numPages,
    pages,
    fullText,
    chars,
    scanned,
  };
}

export function assertExtractableText(extracted, action = "convert this PDF") {
  if (extracted.scanned || extracted.chars < 20) {
    throw new ToolError(
      "OCR_REQUIRED",
      "This looks like a scanned or image-only PDF.",
      `There is not enough extractable text to ${action}. OCR will run automatically in PDF to Word, Excel, and eBook when the file has little or no embedded text.`,
    );
  }
}

function itemsToLayout(items) {
  const usable = [];
  for (const item of items || []) {
    const text = String(item.str || "");
    if (!text && !item.hasEOL) continue;
    const transform = item.transform || [1, 0, 0, 1, 0, 0];
    const height = Math.abs(transform[3]) || item.height || 12;
    usable.push({
      text,
      x: transform[4] || 0,
      y: transform[5] || 0,
      width: item.width || 0,
      height,
      fontName: String(item.fontName || ""),
      hasEOL: Boolean(item.hasEOL),
    });
  }

  const lines = [];
  const sorted = [...usable].sort((a, b) => b.y - a.y || a.x - b.x);
  sorted.forEach((item) => {
    const tolerance = Math.max(2.8, item.height * 0.38);
    let line = lines.find((entry) => Math.abs(entry.y - item.y) <= tolerance);
    if (!line) {
      line = { y: item.y, height: item.height, items: [] };
      lines.push(line);
    }
    line.items.push(item);
    line.y = (line.y * (line.items.length - 1) + item.y) / line.items.length;
    line.height = Math.max(line.height, item.height);
    if (item.hasEOL) line.forcedBreak = true;
  });

  return lines
    .map((line) => {
      const items = [...line.items].sort((a, b) => a.x - b.x);
      return {
        text: joinLine(items),
        x: items[0]?.x || 0,
        y: line.y,
        height: line.height,
        bold: items.some((item) => /bold|black|heavy|semibold/i.test(item.fontName)),
        italic: items.some((item) => /italic|oblique/i.test(item.fontName)),
      };
    })
    .filter((line) => line.text);
}

function joinLine(items) {
  let output = "";
  items.forEach((item, index) => {
    if (index > 0) {
      const previous = items[index - 1];
      const gap = item.x - (previous.x + previous.width);
      const spaceSize = Math.max(previous.height, item.height) * 0.25;
      if (gap > spaceSize && !output.endsWith(" ") && !item.text.startsWith(" ")) output += " ";
    }
    output += item.text;
  });
  return output.replace(/[ \t]+\n/g, "\n").replace(/\s+/g, " ").trim();
}
