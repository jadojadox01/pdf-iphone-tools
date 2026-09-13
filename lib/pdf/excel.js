import ExcelJS from "exceljs";
import { ToolError } from "./errors";
import { openPdfDocument } from "./pdfjs";
import { report, span, yieldUi } from "./progress";
import { readFileBytes, replaceExtension } from "./validate";
import { extractPdfTextWithOcr, pageNeedsOcr } from "./ocr";
import { extractPdfText } from "./text";

export async function convertPdfToExcel(file, options = {}, onStatus) {
  report(onStatus, 4, "Reading PDF…");
  const bytes = await readFileBytes(file);
  const pdf = await openPdfDocument(bytes, options.password);
  let tables = [];
  let usedOcr = false;

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    report(onStatus, span(6, 38, pageNumber - 1, pdf.numPages), `Looking for tables on page ${pageNumber} of ${pdf.numPages}…`);
    await yieldUi();
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const table = itemsToTable(textContent.items);
    if (table) tables.push({ pageNumber, rows: table });
  }

  if (!hasUsableTable(tables)) {
    const extracted = await extractPdfText(file, options.password, onStatus);
    const needsOcr = extracted.pages.some(pageNeedsOcr);
    if (!needsOcr) {
      throw new ToolError(
        "NO_TABLE",
        "No extractable table was found in this PDF.",
        "This converter needs aligned rows and columns of text. If the PDF is mostly paragraphs, use PDF to Word instead.",
      );
    }
    report(onStatus, 40, "No text table found. Trying OCR on scanned pages…");
    const ocrExtracted = await extractPdfTextWithOcr(file, options.password, onStatus);
    usedOcr = Boolean(ocrExtracted.ocr);
    tables = [];
    ocrExtracted.pages.forEach((page) => {
      const fromBoxes = boxesToTable(page.boxes || []);
      if (fromBoxes) {
        tables.push({ pageNumber: page.pageNumber, rows: fromBoxes });
        return;
      }
      const fromLines = linesToSingleColumn(page.lines || String(page.text || "").split(/\n/));
      if (fromLines) tables.push({ pageNumber: page.pageNumber, rows: fromLines });
    });
  }

  if (!tables.length) {
    throw new ToolError(
      "NO_TABLE",
      "No table or readable text was found in this PDF.",
      "If the file is mostly paragraphs, use PDF to Word. If the scan is blurry, try a clearer copy.",
    );
  }

  report(onStatus, 90, "Creating Excel workbook…");
  const workbook = new ExcelJS.Workbook();
  workbook.creator = process.env.NEXT_PUBLIC_SITE_NAME || "PDFFlow";

  tables.forEach((table) => {
    const sheet = workbook.addWorksheet(
      tables.length === 1 ? "Sheet1" : `Page ${table.pageNumber}`.slice(0, 31),
    );
    table.rows.forEach((row) => {
      sheet.addRow(row);
    });
    sheet.columns.forEach((column) => {
      let width = 12;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        width = Math.min(40, Math.max(width, String(cell.value || "").length + 2));
      });
      column.width = width;
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return {
    blob: new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    filename: replaceExtension(file.name, "xlsx"),
    mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    meta: {
      sheets: tables.length,
      ocr: usedOcr,
      note: usedOcr
        ? "OCR was used because the PDF had little embedded text. Check columns and spelling before relying on the spreadsheet."
        : "Rows and columns were reconstructed from text positions. Check the spreadsheet before relying on it.",
    },
  };
}

function hasUsableTable(tables) {
  const totalCells = tables.reduce(
    (sum, table) => sum + table.rows.reduce((count, row) => count + row.length, 0),
    0,
  );
  return tables.length > 0 && totalCells >= 4;
}

function boxesToTable(boxes) {
  if (!boxes?.length) return null;
  return cellsToTable(boxes);
}

function linesToSingleColumn(lines) {
  const rows = lines.map((line) => [String(line || "").trim()]).filter((row) => row[0]);
  return rows.length ? rows : null;
}

function itemsToTable(items) {
  const usable = items
    .map((item) => ({
      text: String(item.str || "").trim(),
      x: item.transform ? item.transform[4] : 0,
      y: item.transform ? item.transform[5] : 0,
      width: item.width || 0,
    }))
    .filter((item) => item.text);
  return cellsToTable(usable);
}

function cellsToTable(usable) {
  if (usable.length < 4) return null;

  const ys = usable.map((item) => item.y);
  const range = Math.max(...ys) - Math.min(...ys);
  const pixelScale = range > 200;
  const rowTolerance = pixelScale ? 14 : 4;
  const colTolerance = pixelScale ? 36 : 18;
  const rows = [];
  const sorted = [...usable].sort((a, b) => b.y - a.y || a.x - b.x);

  sorted.forEach((item) => {
    const row = rows.find((entry) => Math.abs(entry.y - item.y) <= rowTolerance);
    if (row) {
      row.cells.push(item);
      row.y = (row.y * (row.cells.length - 1) + item.y) / row.cells.length;
    } else {
      rows.push({ y: item.y, cells: [item] });
    }
  });

  const multiColumnRows = rows.filter((row) => row.cells.length >= 2);
  if (multiColumnRows.length < 2) return null;

  const columnXs = [];
  multiColumnRows.forEach((row) => {
    row.cells.forEach((cell) => {
      const match = columnXs.find((x) => Math.abs(x - cell.x) < colTolerance);
      if (match == null) columnXs.push(cell.x);
    });
  });
  columnXs.sort((a, b) => a - b);
  if (columnXs.length < 2) return null;

  const table = rows.map((row) => {
    const next = Array(columnXs.length).fill("");
    row.cells.forEach((cell) => {
      let best = 0;
      let bestDistance = Infinity;
      columnXs.forEach((x, index) => {
        const distance = Math.abs(x - cell.x);
        if (distance < bestDistance) {
          best = index;
          bestDistance = distance;
        }
      });
      next[best] = next[best] ? `${next[best]} ${cell.text}` : cell.text;
    });
    return next;
  });

  const filled = table.filter((row) => row.some(Boolean));
  return filled.length >= 2 ? filled : null;
}
