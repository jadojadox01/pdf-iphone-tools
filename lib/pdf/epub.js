import JSZip from "jszip";
import { extractPdfTextWithOcr } from "./ocr";
import { replaceExtension, sanitizeFilename } from "./validate";

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function textToHtml(text) {
  return text
    .split(/\n{2,}/)
    .map((block) => `<p>${escapeXml(block).replace(/\n/g, "<br/>")}</p>`)
    .join("\n");
}

export async function convertPdfToEpub(file, options = {}, onStatus) {
  onStatus?.("Reading PDF…");
  const extracted = await extractPdfTextWithOcr(file, options.password, onStatus);

  const title = sanitizeFilename(file.name).replace(/\.[^.]+$/, "") || "PDF eBook";
  onStatus?.("Building EPUB…");

  const zip = new JSZip();
  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });
  zip.folder("META-INF").file(
    "container.xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="EPUB/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`,
  );

  const chapterFiles = extracted.pages.map((page) => {
    const html = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
  <head>
    <title>${escapeXml(title)} — page ${page.pageNumber}</title>
    <meta charset="utf-8"/>
  </head>
  <body>
    <h1>Page ${page.pageNumber}</h1>
    ${textToHtml(page.text || " ")}
  </body>
</html>`;
    return { name: `page-${page.pageNumber}.xhtml`, html };
  });

  const manifest = chapterFiles
    .map(
      (chapter, index) =>
        `    <item id="page${index + 1}" href="${chapter.name}" media-type="application/xhtml+xml"/>`,
    )
    .join("\n");
  const spine = chapterFiles
    .map((_, index) => `    <itemref idref="page${index + 1}"/>`)
    .join("\n");

  zip.folder("EPUB").file(
    "content.opf",
    `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">pdfflow-${Date.now()}</dc:identifier>
    <dc:title>${escapeXml(title)}</dc:title>
    <dc:language>en</dc:language>
    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d+Z$/, "Z")}</meta>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
${manifest}
  </manifest>
  <spine>
${spine}
  </spine>
</package>`,
  );

  zip.folder("EPUB").file(
    "nav.xhtml",
    `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
  <head><title>Contents</title></head>
  <body>
    <nav epub:type="toc">
      <ol>
        ${chapterFiles
          .map(
            (chapter, index) =>
              `<li><a href="${chapter.name}">Page ${extracted.pages[index].pageNumber}</a></li>`,
          )
          .join("")}
      </ol>
    </nav>
  </body>
</html>`,
  );

  chapterFiles.forEach((chapter) => {
    zip.folder("EPUB").file(chapter.name, chapter.html);
  });

  const bytes = await zip.generateAsync({ type: "uint8array", mimeType: "application/epub+zip" });
  return {
    blob: new Blob([bytes], { type: "application/epub+zip" }),
    filename: replaceExtension(file.name, "epub"),
    mime: "application/epub+zip",
    meta: {
      pages: extracted.pageCount,
      ocr: Boolean(extracted.ocr),
      note: extracted.ocr
        ? `This EPUB includes OCR text from ${extracted.ocrPages} scanned page${extracted.ocrPages === 1 ? "" : "s"}. Check the result before relying on it.`
        : "This EPUB contains extracted text in reading order. It is not a pixel-perfect copy of the PDF layout.",
    },
  };
}
