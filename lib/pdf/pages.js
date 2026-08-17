import { ToolError } from "./errors";

export function parsePageRanges(input, pageCount) {
  const text = String(input || "").trim();
  if (!text) {
    throw new ToolError(
      "INVALID_FILE",
      "Enter the pages you want to use.",
      "Example: 1-3, 5, 8-10",
    );
  }

  const pages = new Set();
  const parts = text.split(",").map((part) => part.trim()).filter(Boolean);

  if (!parts.length) {
    throw new ToolError("INVALID_FILE", "Enter a valid page list.", "Example: 1-3, 5, 8-10");
  }

  for (const part of parts) {
    if (/^\d+$/.test(part)) {
      const page = Number(part);
      assertPage(page, pageCount, part);
      pages.add(page);
      continue;
    }

    const range = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (!range) {
      throw new ToolError(
        "INVALID_FILE",
        `“${part}” is not a valid page or range.`,
        "Use numbers and hyphens, such as 1-3, 5, 8-10.",
      );
    }

    let start = Number(range[1]);
    let end = Number(range[2]);
    if (start > end) {
      const swap = start;
      start = end;
      end = swap;
    }
    assertPage(start, pageCount, part);
    assertPage(end, pageCount, part);
    for (let page = start; page <= end; page += 1) {
      pages.add(page);
    }
  }

  return [...pages].sort((a, b) => a - b);
}

function assertPage(page, pageCount, source) {
  if (!Number.isInteger(page) || page < 1 || page > pageCount) {
    throw new ToolError(
      "INVALID_FILE",
      `Page ${source} is outside this PDF (1–${pageCount}).`,
      "Check the page numbers and try again.",
    );
  }
}

export function allPageNumbers(pageCount) {
  return Array.from({ length: pageCount }, (_, index) => index + 1);
}
