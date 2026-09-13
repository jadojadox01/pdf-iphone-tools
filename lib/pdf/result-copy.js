const HEADLINES = {
  "pdf-to-word": "Your PDF has been converted to an editable Word document",
  "pdf-to-jpg": "Your PDF pages are ready as JPG images",
  "pdf-to-png": "Your PDF pages are ready as PNG images",
  "pdf-to-excel": "Your PDF has been converted to an Excel workbook",
  "pdf-to-ppt": "Your PDF has been converted to a PowerPoint file",
  "pdf-to-ebook": "Your PDF has been converted to an EPUB eBook",
  "word-to-pdf": "Your Word file has been converted to PDF",
  "image-to-pdf": "Your images have been converted to PDF",
  "image-to-jpg": "Your images are ready as JPG files",
  "heic-to-jpg": "Your HEIC photos are ready as JPG files",
  "extract-images": "Images from your PDF are ready to download",
  "merge-pdf": "Your PDFs have been merged into one file",
  "split-pdf": "Your PDF has been split",
  "compress-pdf": "Your compressed PDF is ready",
  "rotate-pdf": "Your rotated PDF is ready",
  "sign-pdf": "Your signed PDF is ready",
  "protect-pdf": "Your password-protected PDF is ready",
  "unlock-pdf": "Your unlocked PDF is ready",
};

export function resultHeadline(tool) {
  return HEADLINES[tool?.slug] || "Your file is ready";
}

export function downloadLabel(tool, result) {
  if (result?.meta?.bundled) return "Download ZIP";
  const short = tool?.shortName || tool?.outputLabel || "file";
  return `Download ${short}`;
}
