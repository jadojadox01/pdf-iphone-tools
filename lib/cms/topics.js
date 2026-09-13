/**
 * Pages we might actually create. One strong tool guide, not one URL per keyword.
 * Keyword variants live in lib/cms/keyword-research.js and fold into these ids.
 */
import { TOOL_GUIDE_SECTIONS } from "@/lib/cms/content-strategy";
import { getKeywordResearch, getKeywordsFoldedInto, KEYWORD_RESEARCH } from "@/lib/cms/keyword-research";

function topic(row) {
  return {
    suggestedOutline: TOOL_GUIDE_SECTIONS,
    createPage: true,
    ...row,
  };
}

export const TOPIC_ROADMAP = [
  topic({
    id: "images-to-pdf",
    title: "How to Convert Images to PDF with PDFFlow",
    suggestedSlug: "how-to-convert-images-to-pdf-with-pdfflow",
    primaryKeyword: "convert images to PDF",
    supportingKeywords: [
      "JPG to PDF",
      "PNG to PDF",
      "photo to PDF",
      "picture to PDF",
      "image to PDF",
      "multiple images to PDF",
    ],
    searchIntent: "how-to",
    deviceIntent: "any",
    toolDependency: "image-to-pdf",
    priority: "P1",
    relatedSearches: [
      "images to PDF on Android",
      "images to PDF without an app",
      "photos to one PDF",
    ],
    relatedTools: ["image-to-pdf", "heic-to-jpg", "merge-pdf"],
    coverSections: [
      "JPG, PNG, and photos in one PDF",
      "On a phone or computer",
      "Without installing an app",
    ],
  }),
  topic({
    id: "pdf-to-word",
    title: "How to Convert PDF to Word with PDFFlow",
    suggestedSlug: "how-to-convert-pdf-to-word-with-pdfflow",
    primaryKeyword: "convert PDF to Word",
    supportingKeywords: ["PDF to Word", "PDF to DOCX", "PDF to Word free"],
    searchIntent: "how-to",
    deviceIntent: "any",
    toolDependency: "pdf-to-word",
    priority: "P1",
    relatedSearches: [
      "PDF to Word on Android",
      "PDF to Word without installing software",
      "scanned PDF to Word",
    ],
    relatedTools: ["pdf-to-word", "word-to-pdf", "unlock-pdf"],
    coverSections: [
      "On Android and Windows",
      "Without installing software",
      "When the Word file looks empty",
    ],
  }),
  topic({
    id: "word-to-pdf",
    title: "How to Convert Word to PDF with PDFFlow",
    suggestedSlug: "how-to-convert-word-to-pdf-with-pdfflow",
    primaryKeyword: "convert Word to PDF",
    supportingKeywords: ["DOCX to PDF", "Word document to PDF", "DOC to PDF"],
    searchIntent: "how-to",
    deviceIntent: "any",
    toolDependency: "word-to-pdf",
    priority: "P1",
    relatedSearches: ["Word to PDF on Android", "Word to PDF without an app"],
    relatedTools: ["word-to-pdf", "pdf-to-word", "compress-pdf"],
    coverSections: ["DOCX vs older .doc files", "On a phone or computer"],
  }),
  topic({
    id: "pdf-to-jpg",
    title: "How to Convert PDF to JPG with PDFFlow",
    suggestedSlug: "how-to-convert-pdf-to-jpg-with-pdfflow",
    primaryKeyword: "convert PDF to JPG",
    supportingKeywords: ["PDF to image", "PDF page to JPG", "PDF to JPEG"],
    searchIntent: "how-to",
    deviceIntent: "any",
    toolDependency: "pdf-to-jpg",
    priority: "P1",
    relatedSearches: ["PDF to JPG on Android", "multi-page PDF to JPG ZIP"],
    relatedTools: ["pdf-to-jpg", "pdf-to-png", "image-to-pdf"],
    coverSections: ["One page vs every page", "JPG vs PNG", "When the download is a ZIP"],
  }),
  topic({
    id: "heic-to-jpg",
    title: "How to Convert HEIC to JPG with PDFFlow",
    suggestedSlug: "how-to-convert-heic-to-jpg-with-pdfflow",
    primaryKeyword: "convert HEIC to JPG",
    supportingKeywords: ["HEIC to JPEG", "HEIC photos to JPG", "HEIC will not open"],
    searchIntent: "how-to",
    deviceIntent: "any",
    toolDependency: "heic-to-jpg",
    priority: "P1",
    relatedSearches: ["HEIC to JPG on Windows", "HEIC to JPG without an app"],
    relatedTools: ["heic-to-jpg", "image-to-jpg", "image-to-pdf"],
    coverSections: ["What HEIC is", "Open iPhone photos on Windows", "Without installing an app"],
  }),
  topic({
    id: "merge-pdf",
    title: "How to Merge PDF Files with PDFFlow",
    suggestedSlug: "how-to-merge-pdf-files-with-pdfflow",
    primaryKeyword: "merge PDF files",
    supportingKeywords: ["combine PDFs", "join PDF files", "put PDFs together"],
    searchIntent: "how-to",
    deviceIntent: "any",
    toolDependency: "merge-pdf",
    priority: "P1",
    relatedSearches: ["merge PDF on Android", "control PDF merge order"],
    relatedTools: ["merge-pdf", "split-pdf", "compress-pdf"],
    coverSections: ["Keep pages in the right order", "On a phone or computer"],
  }),
  topic({
    id: "split-pdf",
    title: "How to Split a PDF with PDFFlow",
    suggestedSlug: "how-to-split-a-pdf-with-pdfflow",
    primaryKeyword: "split a PDF",
    supportingKeywords: ["extract PDF pages", "separate PDF pages", "save one page from PDF"],
    searchIntent: "how-to",
    deviceIntent: "any",
    toolDependency: "split-pdf",
    priority: "P1",
    relatedSearches: ["split PDF on Android", "split PDF on Windows"],
    relatedTools: ["split-pdf", "merge-pdf", "compress-pdf"],
    coverSections: ["Save one page", "Split a large file for email"],
  }),
  topic({
    id: "compress-pdf",
    title: "How to Compress a PDF with PDFFlow",
    suggestedSlug: "how-to-compress-a-pdf-with-pdfflow",
    primaryKeyword: "compress a PDF",
    supportingKeywords: ["reduce PDF size", "make PDF smaller", "PDF too large for email"],
    searchIntent: "how-to",
    deviceIntent: "any",
    toolDependency: "compress-pdf",
    priority: "P1",
    relatedSearches: ["compress PDF on Android", "compress PDF without uploading"],
    relatedTools: ["compress-pdf", "split-pdf", "pdf-to-jpg"],
    coverSections: ["When the file does not get smaller", "Email attachment limits"],
  }),
  topic({
    id: "pdf-to-png",
    title: "How to Convert PDF to PNG with PDFFlow",
    suggestedSlug: "how-to-convert-pdf-to-png-with-pdfflow",
    primaryKeyword: "convert PDF to PNG",
    supportingKeywords: ["PDF to PNG image", "lossless PDF image"],
    searchIntent: "how-to",
    deviceIntent: "any",
    toolDependency: "pdf-to-png",
    priority: "P2",
    relatedSearches: ["PDF to PNG vs JPG"],
    relatedTools: ["pdf-to-png", "pdf-to-jpg"],
    coverSections: [],
  }),
  topic({
    id: "extract-images",
    title: "How to Extract Images from a PDF with PDFFlow",
    suggestedSlug: "how-to-extract-images-from-a-pdf-with-pdfflow",
    primaryKeyword: "extract images from PDF",
    supportingKeywords: ["pull photos out of PDF"],
    searchIntent: "how-to",
    deviceIntent: "any",
    toolDependency: "extract-images",
    priority: "P2",
    relatedSearches: [],
    relatedTools: ["extract-images", "pdf-to-jpg"],
    coverSections: [],
  }),
  topic({
    id: "pdf-to-excel",
    title: "How to Convert PDF to Excel with PDFFlow",
    suggestedSlug: "how-to-convert-pdf-to-excel-with-pdfflow",
    primaryKeyword: "convert PDF to Excel",
    supportingKeywords: ["PDF table to spreadsheet"],
    searchIntent: "how-to",
    deviceIntent: "any",
    toolDependency: "pdf-to-excel",
    priority: "P2",
    relatedSearches: ["PDF to Excel no table found"],
    relatedTools: ["pdf-to-excel"],
    coverSections: ["When the PDF has no real table"],
  }),
  topic({
    id: "pdf-to-ppt",
    title: "How to Convert PDF to PowerPoint with PDFFlow",
    suggestedSlug: "how-to-convert-pdf-to-powerpoint-with-pdfflow",
    primaryKeyword: "convert PDF to PowerPoint",
    supportingKeywords: ["PDF to PPT"],
    searchIntent: "how-to",
    deviceIntent: "any",
    toolDependency: "pdf-to-ppt",
    priority: "P2",
    relatedSearches: [],
    relatedTools: ["pdf-to-ppt"],
    coverSections: [],
  }),
  topic({
    id: "pdf-to-ebook",
    title: "How to Convert PDF to EPUB with PDFFlow",
    suggestedSlug: "how-to-convert-pdf-to-epub-with-pdfflow",
    primaryKeyword: "convert PDF to EPUB",
    supportingKeywords: ["PDF to ebook"],
    searchIntent: "how-to",
    deviceIntent: "any",
    toolDependency: "pdf-to-ebook",
    priority: "P3",
    relatedSearches: ["PDF to EPUB limitations"],
    relatedTools: ["pdf-to-ebook"],
    coverSections: [],
  }),
  topic({
    id: "rotate-pdf",
    title: "How to Rotate a PDF with PDFFlow",
    suggestedSlug: "how-to-rotate-a-pdf-with-pdfflow",
    primaryKeyword: "rotate a PDF",
    supportingKeywords: ["fix sideways PDF"],
    searchIntent: "how-to",
    deviceIntent: "any",
    toolDependency: "rotate-pdf",
    priority: "P2",
    relatedSearches: ["rotate scanned PDF"],
    relatedTools: ["rotate-pdf", "pdf-to-word"],
    coverSections: [],
  }),
  topic({
    id: "sign-pdf",
    title: "How to Sign a PDF with PDFFlow",
    suggestedSlug: "how-to-sign-a-pdf-with-pdfflow",
    primaryKeyword: "sign a PDF",
    supportingKeywords: ["add signature to PDF"],
    searchIntent: "how-to",
    deviceIntent: "any",
    toolDependency: "sign-pdf",
    priority: "P2",
    relatedSearches: [],
    relatedTools: ["sign-pdf"],
    coverSections: [],
  }),
  topic({
    id: "protect-pdf",
    title: "How to Password-Protect a PDF with PDFFlow",
    suggestedSlug: "how-to-password-protect-a-pdf-with-pdfflow",
    primaryKeyword: "password protect a PDF",
    supportingKeywords: ["lock a PDF"],
    searchIntent: "how-to",
    deviceIntent: "any",
    toolDependency: "protect-pdf",
    priority: "P2",
    relatedSearches: [],
    relatedTools: ["protect-pdf", "unlock-pdf"],
    coverSections: [],
  }),
  topic({
    id: "unlock-pdf",
    title: "How to Unlock a PDF with PDFFlow",
    suggestedSlug: "how-to-unlock-a-pdf-with-pdfflow",
    primaryKeyword: "unlock a PDF",
    supportingKeywords: ["remove PDF password"],
    searchIntent: "how-to",
    deviceIntent: "any",
    toolDependency: "unlock-pdf",
    priority: "P2",
    relatedSearches: ["convert a password-protected PDF"],
    relatedTools: ["unlock-pdf", "protect-pdf"],
    coverSections: ["Only with a password you already know"],
  }),
  topic({
    id: "image-to-jpg",
    title: "How to Convert an Image to JPG with PDFFlow",
    suggestedSlug: "how-to-convert-an-image-to-jpg-with-pdfflow",
    primaryKeyword: "convert image to JPG",
    supportingKeywords: ["PNG to JPG"],
    searchIntent: "how-to",
    deviceIntent: "any",
    toolDependency: "image-to-jpg",
    priority: "P2",
    relatedSearches: [],
    relatedTools: ["image-to-jpg", "heic-to-jpg"],
    coverSections: [],
  }),
];

export const FIRST_EIGHT_TOPIC_IDS = [
  "images-to-pdf",
  "pdf-to-word",
  "word-to-pdf",
  "pdf-to-jpg",
  "heic-to-jpg",
  "merge-pdf",
  "split-pdf",
  "compress-pdf",
];

export function getTopic(id) {
  return TOPIC_ROADMAP.find((item) => item.id === id) || getKeywordResearch(id);
}

export function getCanonicalTopic(id) {
  return TOPIC_ROADMAP.find((item) => item.id === id) || null;
}

export function collectCoveredKeywords(canonicalId) {
  const topicRow = getCanonicalTopic(canonicalId);
  const phrases = [];
  const seen = new Set();
  function add(value) {
    const phrase = String(value || "").trim();
    if (!phrase) return;
    const key = phrase.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    phrases.push(phrase);
  }
  if (topicRow) {
    add(topicRow.primaryKeyword);
    (topicRow.supportingKeywords || []).forEach(add);
    (topicRow.relatedSearches || []).forEach(add);
  }
  getKeywordsFoldedInto(canonicalId).forEach((row) => {
    add(row.primaryKeyword);
    (row.supportingKeywords || []).forEach(add);
    (row.relatedSearches || []).forEach(add);
  });
  KEYWORD_RESEARCH.filter((row) => row.coverInEveryToolGuide).forEach((row) => {
    add(row.primaryKeyword);
  });
  return phrases;
}

export function getFoldedResearch(canonicalId) {
  return getKeywordsFoldedInto(canonicalId);
}

export { KEYWORD_RESEARCH } from "@/lib/cms/keyword-research";
