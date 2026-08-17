export const TOOL_CATEGORIES = [
  {
    id: "convert",
    title: "Convert PDF",
    description: "Turn PDFs into Word, images, spreadsheets, slides, or an eBook.",
  },
  {
    id: "organize",
    title: "Organize PDF",
    description: "Merge, split, compress, and rotate PDF files.",
  },
  {
    id: "edit",
    title: "Edit & Sign",
    description: "Add a signature that is actually embedded in the downloaded PDF.",
  },
  {
    id: "security",
    title: "Security",
    description: "Password-protect a PDF, or remove a password you already know.",
  },
];

const tools = [
  {
    slug: "pdf-to-word",
    category: "convert",
    name: "PDF to Word",
    shortName: "Word",
    h1: "PDF to Word",
    title: "PDF to Word Converter — Free Online for iPhone",
    description:
      "Convert a PDF into an editable Word (.docx) file in your browser. Works on iPhone, iPad, Android, and desktop. No app required.",
    intro:
      "Upload a PDF and download a real Word document. Text-based PDFs convert best. Scanned image PDFs need OCR, which this tool does not perform.",
    audience: "Anyone who needs an editable Word file from a PDF, including iPhone users in Safari.",
    afterUpload: "The PDF is read in your browser, text is extracted, and a .docx file is created for download.",
    cta: "Convert PDF to Word",
    icon: "word",
    outputExt: "docx",
    outputLabel: "Word document",
    accept: "application/pdf,.pdf",
    multiple: false,
    related: ["pdf-to-jpg", "pdf-to-excel", "compress-pdf", "merge-pdf"],
    howToTitle: "How to convert PDF to Word on iPhone",
    howTo: [
      "Open this page in Safari and tap Choose PDF.",
      "Select a PDF from Files, iCloud Drive, or another app.",
      "Tap Convert to Word and wait while the file is processed on your device.",
      "Tap Download to save the .docx file.",
    ],
    faqs: [
      {
        q: "Does this work on iPhone?",
        a: "Yes. You can convert a PDF to Word in Safari without installing an app. It also works on iPad, Android, Windows, macOS, and Linux.",
      },
      {
        q: "Will scanned PDFs convert?",
        a: "Not into editable text. If the PDF is mostly images, you will see a clear message that OCR is required. This tool does not run OCR.",
      },
      {
        q: "Are my files uploaded?",
        a: "No. Conversion runs in your browser. The PDF is not sent to our servers.",
      },
      {
        q: "What formatting is kept?",
        a: "Text and basic paragraph structure are preserved as accurately as the PDF allows. Complex layouts, columns, and graphics may not match the original page design.",
      },
    ],
  },
  {
    slug: "pdf-to-jpg",
    category: "convert",
    name: "PDF to JPG",
    shortName: "JPG",
    h1: "PDF to JPG",
    title: "PDF to JPG Converter — Convert PDF Pages to Images",
    description:
      "Turn PDF pages into JPG images on iPhone or any browser. Choose all pages or selected pages, then download images or a ZIP.",
    intro:
      "Each PDF page is rendered into a real JPG image. Multi-page files can be downloaded as a ZIP.",
    audience: "People who need photos or image copies of PDF pages, including iPhone users who want to save pages to Photos.",
    afterUpload: "Pages are rendered to JPG in your browser. One page downloads as a JPG. Multiple pages download as a ZIP.",
    cta: "Convert PDF to JPG",
    icon: "image",
    outputExt: "jpg",
    outputLabel: "JPG image",
    accept: "application/pdf,.pdf",
    multiple: false,
    related: ["pdf-to-word", "pdf-to-ppt", "rotate-pdf", "compress-pdf"],
    howToTitle: "How to convert PDF to JPG on iPhone",
    howTo: [
      "Upload your PDF.",
      "Choose all pages or enter specific pages.",
      "Pick an image quality option if you want.",
      "Convert, then download the JPG or ZIP.",
    ],
    faqs: [
      {
        q: "Can I convert only some pages?",
        a: "Yes. Enter pages such as 1-3, 5, 8-10. Invalid ranges are rejected before conversion starts.",
      },
      {
        q: "Why do I get a ZIP?",
        a: "When more than one page is converted, the JPGs are packed into a ZIP so you can download them in one tap.",
      },
      {
        q: "Does this work in iPhone Safari?",
        a: "Yes. Rendering happens on your device. Very large PDFs may take longer or hit memory limits.",
      },
    ],
  },
  {
    slug: "pdf-to-excel",
    category: "convert",
    name: "PDF to Excel",
    shortName: "Excel",
    h1: "PDF to Excel",
    title: "PDF to Excel Converter — Extract Tables to XLSX",
    description:
      "Extract tables from a PDF into a real Excel (.xlsx) file. If the PDF has no tabular data, you will see a clear error instead of an empty spreadsheet.",
    intro:
      "This tool looks for row-and-column text in your PDF and builds a genuine .xlsx workbook. It does not invent tables.",
    audience: "Anyone extracting invoices, lists, or tables from a PDF, including on iPhone.",
    afterUpload: "Text positions are analyzed. If a table is found, an Excel file is created. If not, conversion stops with an explanation.",
    cta: "Convert PDF to Excel",
    icon: "excel",
    outputExt: "xlsx",
    outputLabel: "Excel workbook",
    accept: "application/pdf,.pdf",
    multiple: false,
    related: ["pdf-to-word", "pdf-to-jpg", "split-pdf", "compress-pdf"],
    howToTitle: "How to convert PDF to Excel on iPhone",
    howTo: [
      "Upload a PDF that contains a table or aligned columns.",
      "Tap Convert to Excel.",
      "If a table is detected, download the .xlsx file.",
      "Open it in Excel, Numbers, or Google Sheets.",
    ],
    faqs: [
      {
        q: "What if there is no table?",
        a: "You will get an error explaining that no extractable tabular data was found. The tool will not generate a fake empty spreadsheet.",
      },
      {
        q: "Do scanned tables work?",
        a: "No. Scanned or image-only PDFs need OCR first. This converter only reads existing text.",
      },
    ],
  },
  {
    slug: "pdf-to-ppt",
    category: "convert",
    name: "PDF to PowerPoint",
    shortName: "PowerPoint",
    h1: "PDF to PowerPoint",
    title: "PDF to PowerPoint Converter — PDF Pages to PPTX Slides",
    description:
      "Convert PDF pages into a PowerPoint file. Each page becomes a slide image so you get a valid .pptx with the original page layout.",
    intro:
      "Each PDF page is placed on a PowerPoint slide as a high-quality image. Slide content is not independently editable text.",
    audience: "People who need a PowerPoint version of a PDF for presenting or sharing, including from an iPhone.",
    afterUpload: "Pages are rendered and placed onto slides with matching dimensions. You download a real .pptx file.",
    cta: "Convert PDF to PowerPoint",
    icon: "ppt",
    outputExt: "pptx",
    outputLabel: "PowerPoint file",
    accept: "application/pdf,.pdf",
    multiple: false,
    related: ["pdf-to-jpg", "pdf-to-word", "rotate-pdf", "compress-pdf"],
    howToTitle: "How to convert PDF to PowerPoint on iPhone",
    howTo: [
      "Upload your PDF.",
      "Tap Convert to PowerPoint.",
      "Wait while each page is placed on a slide.",
      "Download the .pptx file.",
    ],
    faqs: [
      {
        q: "Can I edit the text in PowerPoint?",
        a: "Not as separate text boxes. Each page is an image on a slide so the layout stays intact. This is stated before you convert.",
      },
      {
        q: "Is the file a real PowerPoint document?",
        a: "Yes. The download is a valid .pptx you can open in PowerPoint, Keynote, or Google Slides.",
      },
    ],
  },
  {
    slug: "pdf-to-ebook",
    category: "convert",
    name: "PDF to eBook",
    shortName: "eBook",
    h1: "PDF to eBook",
    title: "PDF to eBook Converter — Create an EPUB from a PDF",
    description:
      "Convert a text-based PDF into an EPUB eBook in your browser. Works on iPhone and other devices. Scanned PDFs are not converted.",
    intro:
      "Text is extracted from the PDF and packaged as a real EPUB file you can open in Books or other readers.",
    audience: "Readers who want a reflowable eBook from a text PDF.",
    afterUpload: "Text is extracted by page and written into a valid EPUB 3 file.",
    cta: "Convert PDF to eBook",
    icon: "ebook",
    outputExt: "epub",
    outputLabel: "EPUB eBook",
    accept: "application/pdf,.pdf",
    multiple: false,
    related: ["pdf-to-word", "pdf-to-jpg", "compress-pdf", "split-pdf"],
    howToTitle: "How to convert PDF to eBook on iPhone",
    howTo: [
      "Upload a text-based PDF.",
      "Tap Convert to eBook.",
      "Download the .epub file.",
      "Open it in Apple Books or another EPUB reader.",
    ],
    faqs: [
      {
        q: "Will a scanned PDF become an eBook?",
        a: "No. If there is not enough extractable text, conversion stops and explains that OCR would be required.",
      },
      {
        q: "Is the layout identical to the PDF?",
        a: "No. EPUB is reflowable. You get the text in reading order, not a pixel-perfect page copy.",
      },
    ],
  },
  {
    slug: "merge-pdf",
    category: "organize",
    name: "Merge PDF",
    shortName: "Merge",
    h1: "Merge PDF",
    title: "Merge PDF Files — Combine PDFs Online on iPhone",
    description:
      "Combine multiple PDFs into one file. Reorder files, remove any you do not want, then download a merged PDF.",
    intro:
      "Select two or more PDFs, put them in the order you want, and merge them into a single PDF.",
    audience: "Anyone combining documents, forms, or scans, especially from an iPhone Files app.",
    afterUpload: "Files are merged in your chosen order into one downloadable PDF.",
    cta: "Merge PDFs",
    icon: "merge",
    outputExt: "pdf",
    outputLabel: "Merged PDF",
    accept: "application/pdf,.pdf",
    multiple: true,
    related: ["split-pdf", "compress-pdf", "rotate-pdf", "pdf-to-word"],
    howToTitle: "How to merge PDF files on iPhone",
    howTo: [
      "Tap to add two or more PDF files.",
      "Use the up and down buttons to set the order.",
      "Remove any file you do not want included.",
      "Tap Merge PDFs and download the combined file.",
    ],
    faqs: [
      {
        q: "How many files can I merge?",
        a: "Up to 20 PDFs, with a 25 MB limit per file. Very large merges may be limited by your device memory.",
      },
      {
        q: "Can I reorder files on iPhone?",
        a: "Yes. Each file has move-up and move-down controls sized for touch.",
      },
    ],
  },
  {
    slug: "split-pdf",
    category: "organize",
    name: "Split PDF",
    shortName: "Split",
    h1: "Split PDF",
    title: "Split PDF — Extract Pages or Split by Range",
    description:
      "Split a PDF by extracting pages, saving every page separately, or using ranges like 1-3, 5, 8-10. Multiple outputs download as a ZIP.",
    intro:
      "Choose extract selected pages, split every page, or split by ranges. You always get real PDF files.",
    audience: "People who need part of a PDF, or one file per page.",
    afterUpload: "New PDFs are created from the pages you choose. One file downloads as a PDF. Several files download as a ZIP.",
    cta: "Split PDF",
    icon: "split",
    outputExt: "pdf",
    outputLabel: "Split PDF",
    accept: "application/pdf,.pdf",
    multiple: false,
    related: ["merge-pdf", "rotate-pdf", "compress-pdf", "pdf-to-jpg"],
    howToTitle: "How to split a PDF on iPhone",
    howTo: [
      "Upload a PDF.",
      "Choose a split mode.",
      "If needed, enter pages such as 1-3, 5, 8-10.",
      "Split, then download the PDF or ZIP.",
    ],
    faqs: [
      {
        q: "What range format is supported?",
        a: "Use commas and hyphens, for example 1-3, 5, 8-10. Pages outside the document are rejected.",
      },
      {
        q: "When do I get a ZIP?",
        a: "When the split creates more than one PDF, the files are packed into a ZIP.",
      },
    ],
  },
  {
    slug: "compress-pdf",
    category: "organize",
    name: "Compress PDF",
    shortName: "Compress",
    h1: "Compress PDF",
    title: "Compress PDF — Reduce PDF File Size on iPhone",
    description:
      "Reduce PDF size with low, recommended, or strong compression. See original size, new size, and the actual percentage change.",
    intro:
      "Choose a compression level and get a new PDF. If the file does not get smaller, that result is shown honestly.",
    audience: "Anyone who needs a smaller PDF for email, uploads, or iPhone storage.",
    afterUpload: "A compressed PDF is created on your device. File sizes are compared before you download.",
    cta: "Compress PDF",
    icon: "compress",
    outputExt: "pdf",
    outputLabel: "Compressed PDF",
    accept: "application/pdf,.pdf",
    multiple: false,
    related: ["pdf-to-jpg", "merge-pdf", "split-pdf", "rotate-pdf"],
    howToTitle: "How to compress a PDF on iPhone",
    howTo: [
      "Upload your PDF.",
      "Choose low, recommended, or strong compression.",
      "Tap Compress PDF.",
      "Check the new size, then download if you want the result.",
    ],
    faqs: [
      {
        q: "Will the file always get smaller?",
        a: "No. Some PDFs are already optimized. If compression increases the size, you will see that instead of a fake reduction.",
      },
      {
        q: "Does strong compression keep selectable text?",
        a: "Strong compression rebuilds pages as images so the file can get smaller. Text may no longer be selectable. Recommended tries to keep the original page objects.",
      },
    ],
  },
  {
    slug: "rotate-pdf",
    category: "organize",
    name: "Rotate PDF",
    shortName: "Rotate",
    h1: "Rotate PDF",
    title: "Rotate PDF Pages — 90°, 180°, or 270°",
    description:
      "Rotate all pages or selected pages in a PDF. Download a real rotated PDF from iPhone or any other device.",
    intro:
      "Choose 90°, 180°, or 270° and apply it to every page or only the pages you specify.",
    audience: "People with sideways scans or mixed-orientation pages.",
    afterUpload: "Page rotation is written into a new PDF for download.",
    cta: "Rotate PDF",
    icon: "rotate",
    outputExt: "pdf",
    outputLabel: "Rotated PDF",
    accept: "application/pdf,.pdf",
    multiple: false,
    related: ["merge-pdf", "split-pdf", "compress-pdf", "pdf-to-jpg"],
    howToTitle: "How to rotate a PDF on iPhone",
    howTo: [
      "Upload your PDF.",
      "Choose 90°, 180°, or 270°.",
      "Apply to all pages or enter selected pages.",
      "Download the rotated PDF.",
    ],
    faqs: [
      {
        q: "Can I rotate only some pages?",
        a: "Yes. Enter a page list such as 1, 3-4. Other pages stay as they are.",
      },
    ],
  },
  {
    slug: "sign-pdf",
    category: "edit",
    name: "Sign PDF",
    shortName: "Sign",
    h1: "Sign PDF",
    title: "Sign PDF Online — Draw, Type, or Upload a Signature",
    description:
      "Sign a PDF in your browser. Draw, type, or upload a signature, place it on a page, then download a PDF with the signature embedded.",
    intro:
      "Create a signature, move it onto the page, and export a PDF that actually contains the signature — not just an on-screen overlay.",
    audience: "Anyone who needs to sign a form from an iPhone or desktop without installing an app.",
    afterUpload: "You place the signature on a page preview. The downloaded PDF includes the signature image on that page.",
    cta: "Sign PDF",
    icon: "sign",
    outputExt: "pdf",
    outputLabel: "Signed PDF",
    accept: "application/pdf,.pdf",
    multiple: false,
    related: ["protect-pdf", "pdf-to-word", "rotate-pdf", "merge-pdf"],
    howToTitle: "How to sign a PDF on iPhone",
    howTo: [
      "Upload the PDF you need to sign.",
      "Draw, type, or upload a signature.",
      "Choose the page, then drag and resize the signature.",
      "Tap Save signed PDF and download the file.",
    ],
    faqs: [
      {
        q: "Is the signature in the downloaded file?",
        a: "Yes. It is embedded as an image in the PDF. Closing the page without downloading does not keep a signed copy on our servers, because processing stays on your device.",
      },
      {
        q: "Is this a legally certified digital signature?",
        a: "No. This places a visual signature on the page. It is not a certificate-based digital signature.",
      },
    ],
  },
  {
    slug: "protect-pdf",
    category: "security",
    name: "Protect PDF",
    shortName: "Protect",
    h1: "Protect PDF",
    title: "Protect PDF — Add a Password to a PDF",
    description:
      "Encrypt a PDF with a password in your browser. Enter and confirm the password, then download a protected PDF.",
    intro:
      "Set a password to encrypt the PDF. You will need that password to open the file later.",
    audience: "Anyone sending a sensitive PDF from iPhone or desktop.",
    afterUpload: "The PDF is encrypted on your device. The password is not sent to our servers or written to logs.",
    cta: "Protect PDF",
    icon: "protect",
    outputExt: "pdf",
    outputLabel: "Protected PDF",
    accept: "application/pdf,.pdf",
    multiple: false,
    related: ["unlock-pdf", "sign-pdf", "compress-pdf", "merge-pdf"],
    howToTitle: "How to password-protect a PDF on iPhone",
    howTo: [
      "Upload your PDF.",
      "Enter a password and confirm it.",
      "Tap Protect PDF.",
      "Download the encrypted file and store the password somewhere safe.",
    ],
    faqs: [
      {
        q: "Can you recover my password later?",
        a: "No. The password never leaves your device, and we cannot reset it.",
      },
      {
        q: "What encryption is used?",
        a: "The file is encrypted with AES so most PDF readers will ask for the password before opening it.",
      },
    ],
  },
  {
    slug: "unlock-pdf",
    category: "security",
    name: "Unlock PDF",
    shortName: "Unlock",
    h1: "Unlock PDF",
    title: "Unlock PDF — Remove a PDF Password You Know",
    description:
      "Remove a PDF password when you already know it. Incorrect passwords are rejected. This tool does not bypass encryption.",
    intro:
      "Enter the current password to create an unlocked copy. If the password is wrong, unlocking fails.",
    audience: "People who own a password-protected PDF and want an unlocked copy for easier use.",
    afterUpload: "If the password is correct, a PDF without that password is created. If not, you see an error.",
    cta: "Unlock PDF",
    icon: "unlock",
    outputExt: "pdf",
    outputLabel: "Unlocked PDF",
    accept: "application/pdf,.pdf",
    multiple: false,
    related: ["protect-pdf", "pdf-to-word", "merge-pdf", "compress-pdf"],
    howToTitle: "How to unlock a PDF on iPhone",
    howTo: [
      "Upload the locked PDF.",
      "Enter the password you already know.",
      "Tap Unlock PDF.",
      "Download the unlocked file if the password is correct.",
    ],
    faqs: [
      {
        q: "Can this crack a PDF I cannot open?",
        a: "No. You must supply the correct password. The tool will not try to bypass encryption.",
      },
      {
        q: "What if I forgot the password?",
        a: "This site cannot recover it. Use a backup copy or the original unencrypted file if you still have it.",
      },
    ],
  },
];

export function getTools() {
  return tools;
}

export function getTool(slug) {
  return tools.find((tool) => tool.slug === slug) || null;
}

export function getToolsByCategory(categoryId) {
  return tools.filter((tool) => tool.category === categoryId);
}

export function getRelatedTools(slug) {
  const tool = getTool(slug);
  if (!tool) return [];
  return tool.related.map(getTool).filter(Boolean);
}

export default tools;
