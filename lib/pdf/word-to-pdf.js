import { PDFDocument, StandardFonts, rgb } from "@cantoo/pdf-lib";
import JSZip from "jszip";
import { ToolError } from "./errors";
import { report } from "./progress";
import { replaceExtension, sanitizeFilename } from "./validate";
import { MAX_FILE_BYTES, formatBytes } from "@/lib/site";
import { savePdf } from "./load";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 54;
const BODY_SIZE = 11;
const LINE_HEIGHT = 15;
const TITLE_SIZE = 16;

const OLE_MAGIC = [0xd0, 0xcf, 0x11, 0xe0];

export async function convertDocxToPdf(file, options = {}, onStatus) {
  await assertDocxFile(file);
  report(onStatus, 8, "Reading Word file…");
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const documentXml = await zip.file("word/document.xml")?.async("string");
  if (!documentXml) {
    throw new ToolError(
      "INVALID_FILE",
      "This is not a valid Word (.docx) file.",
      "The file may be damaged. Save a new .docx copy and try again.",
    );
  }
  const images = await loadDocxImages(zip);
  const blocks = parseDocxBlocks(documentXml, images);
  if (!blocks.length) {
    throw new ToolError(
      "CONVERSION_FAILED",
      "This Word file did not contain readable text or images.",
      "Open it in Word or Pages, save as .docx, and try again.",
    );
  }

  report(onStatus, 40, "Creating PDF…");
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;
  const maxWidth = PAGE_WIDTH - MARGIN * 2;

  function newPage() {
    page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - MARGIN;
  }

  function ensureSpace(needed) {
    if (y - needed < MARGIN) newPage();
  }

  for (const block of blocks) {
    if (block.type === "image") {
      try {
        const image = await embedImageBytes(pdf, block.bytes, block.mime);
        const maxH = 360;
        const scale = Math.min(maxWidth / image.width, maxH / image.height, 1);
        const width = image.width * scale;
        const height = image.height * scale;
        ensureSpace(height + 12);
        y -= height;
        page.drawImage(image, { x: MARGIN, y, width, height });
        y -= 12;
      } catch {
        /* skip a broken embedded image */
      }
      continue;
    }

    const font = block.heading ? bold : regular;
    const size = block.heading ? TITLE_SIZE : BODY_SIZE;
    const lines = wrapText(block.text || " ", font, size, maxWidth);
    for (const line of lines) {
      ensureSpace(LINE_HEIGHT + 2);
      y -= LINE_HEIGHT;
      const safe = winAnsi(line);
      if (!safe) continue;
      page.drawText(safe, {
        x: MARGIN + (block.list ? 14 : 0),
        y,
        size,
        font,
        color: rgb(0.12, 0.12, 0.12),
      });
    }
    y -= block.heading ? 8 : 4;
  }

  report(onStatus, 92, "Saving PDF…");
  const blob = await savePdf(pdf);
  return {
    blob,
    filename: replaceExtension(sanitizeFilename(file.name), "pdf"),
    mime: "application/pdf",
    meta: {
      pages: pdf.getPageCount(),
      note: "Text is selectable. Complex Word layouts, columns, and unusual fonts are simplified.",
    },
  };
}

async function assertDocxFile(file) {
  if (!file) {
    throw new ToolError("INVALID_FILE", "Choose a Word file first.", "Select a .docx file.");
  }
  if (file.size <= 0) {
    throw new ToolError("INVALID_FILE", "The selected file is empty.", "Choose a different document.");
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new ToolError(
      "TOO_LARGE",
      `This file is ${formatBytes(file.size)}, which is over the ${formatBytes(MAX_FILE_BYTES)} limit.`,
      "Remove large images or save a smaller copy, then try again.",
    );
  }

  const name = (file.name || "").toLowerCase();
  const header = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  if (OLE_MAGIC.every((byte, index) => header[index] === byte) || name.endsWith(".doc")) {
    throw new ToolError(
      "UNSUPPORTED",
      "Old .doc files are not supported.",
      "Open the file in Word or Pages and save it as .docx, then convert that file.",
    );
  }
  if (header[0] !== 0x50 || header[1] !== 0x4b) {
    throw new ToolError(
      "INVALID_FILE",
      "This is not a valid Word (.docx) file.",
      "Choose a .docx document.",
    );
  }

  try {
    const zip = await JSZip.loadAsync(await file.arrayBuffer());
    if (!zip.file("word/document.xml") && !zip.file("[Content_Types].xml")) {
      throw new Error("missing document");
    }
  } catch {
    throw new ToolError(
      "INVALID_FILE",
      "This is not a valid Word (.docx) file.",
      "The file may be damaged. Save a new .docx copy and try again.",
    );
  }
}

async function loadDocxImages(zip) {
  const rels = await zip.file("word/_rels/document.xml.rels")?.async("string");
  if (!rels) return {};
  const images = {};
  const tags = rels.match(/<Relationship\b[^>]*\/?>/g) || [];
  for (const tag of tags) {
    const id = /\bId="([^"]+)"/.exec(tag)?.[1];
    const target = /\bTarget="([^"]+)"/.exec(tag)?.[1];
    if (!id || !target) continue;
    const lower = target.toLowerCase();
    if (!/\.(png|jpe?g|gif)$/.test(lower) && !/image/i.test(tag)) continue;
    const path = resolveDocxPath(target);
    const entry = zip.file(path);
    if (!entry) continue;
    const bytes = new Uint8Array(await entry.async("uint8array"));
    images[id] = {
      bytes,
      mime: lower.endsWith(".png") ? "image/png" : "image/jpeg",
    };
  }
  return images;
}

function resolveDocxPath(target) {
  const cleaned = String(target || "").replace(/\\/g, "/").replace(/^\//, "");
  if (cleaned.startsWith("word/")) return cleaned;
  if (cleaned.startsWith("../")) return cleaned.replace(/^\.\.\//, "");
  return `word/${cleaned}`;
}

function parseDocxBlocks(xml, images) {
  const blocks = [];
  const parts = String(xml || "").match(/<w:p[\s>][\s\S]*?<\/w:p>|<w:tbl[\s>][\s\S]*?<\/w:tbl>/g) || [];
  for (const part of parts) {
    pushImages(part, images, blocks);
    if (part.startsWith("<w:tbl")) {
      const rows = part.match(/<w:tr[\s>][\s\S]*?<\/w:tr>/g) || [];
      for (const row of rows) {
        const cells = row.match(/<w:tc[\s>][\s\S]*?<\/w:tc>/g) || [];
        const text = cells.map((cell) => extractDocxText(cell)).filter(Boolean).join(" | ");
        if (text) blocks.push({ type: "text", text, heading: false, list: false });
      }
      continue;
    }
    const text = extractDocxText(part);
    if (!text) continue;
    blocks.push({
      type: "text",
      text,
      heading: /w:val="Heading[1-3]"/i.test(part),
      list: /<w:numPr[\s>]/.test(part),
    });
  }
  if (!blocks.length) {
    const fallback = extractDocxText(xml);
    if (fallback) blocks.push({ type: "text", text: fallback, heading: false, list: false });
  }
  return blocks;
}

function pushImages(part, images, blocks) {
  const embeds = part.matchAll(/\br:embed="([^"]+)"/g);
  for (const match of embeds) {
    const image = images[match[1]];
    if (image?.bytes?.length) blocks.push({ type: "image", bytes: image.bytes, mime: image.mime });
  }
}

function extractDocxText(xml) {
  const source = String(xml || "")
    .replace(/<w:tab\b[^>]*\/>/g, " ")
    .replace(/<w:br\b[^>]*\/>/g, "\n");
  const texts = [];
  const matches = source.matchAll(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g);
  for (const match of matches) texts.push(decodeXml(match[1]));
  return texts.join("").replace(/\s+/g, " ").trim();
}

function decodeXml(value) {
  return String(value || "")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(Number(num)));
}

function wrapText(text, font, size, maxWidth) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  if (!words.length) return [" "];
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(winAnsi(next) || " ", size) <= maxWidth) {
      line = next;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function winAnsi(text) {
  return String(text || "")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u2013|\u2014/g, "-")
    .replace(/\u00a0/g, " ")
    .replace(/[^\x09\x0a\x0d\x20-\x7e\x80-\xff]/g, "?");
}

async function embedImageBytes(pdf, bytes, mime = "") {
  if (String(mime).includes("png") || (bytes[0] === 0x89 && bytes[1] === 0x50)) {
    return pdf.embedPng(bytes);
  }
  return pdf.embedJpg(bytes);
}
