import ExcelJS from "exceljs";
import { ToolError } from "./errors";
import { openPdfDocument } from "./pdfjs";
import { readFileBytes, replaceExtension } from "./validate";
import { assertExtractableText } from "./text";

export async function convertPdfToExcel(file, options = {}, onStatus) {
  onStatus?.("Reading PDF…");
  const bytes = await readFileBytes(file);
  const pdf = await openPdfDocument(bytes, options.password);
  const tables = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    onStatus?.(`Looking for tables on page ${pageNumber} of ${pdf.numPages}…`);
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const table = itemsToTable(textContent.items);
    if (table) tables.push({ pageNumber, rows: table });
  }

  const totalCells = tables.reduce(
    (sum, table) => sum + table.rows.reduce((count, row) => count + row.length, 0),
    0,
  );

  if (!tables.length || totalCells < 4) {
    const extractedChars = tables.length;
    if (!extractedChars) {
      const { extractPdfText } = await import("./text");
      const extracted = await extractPdfText(file, options.password);
      assertExtractableText(extracted, "extract a spreadsheet");
    }
    throw new ToolError(
      "NO_TABLE",
      "No extractable table was found in this PDF.",
      "This converter needs aligned rows and columns of text. If the table is a photo, OCR would be required. If the PDF is mostly paragraphs, use PDF to Word instead.",
    );
  }

  onStatus?.("Creating Excel workbook…");
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "PDF iPhone Tools";

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
      note: "Rows and columns were reconstructed from text positions. Check the spreadsheet before relying on it.",
    },
  };
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

  if (usable.length < 4) return null;

  const rowTolerance = 4;
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
      const match = columnXs.find((x) => Math.abs(x - cell.x) < 18);
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
