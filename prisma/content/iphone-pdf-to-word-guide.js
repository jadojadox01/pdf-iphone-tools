function id() {
  return `b_${Math.random().toString(36).slice(2, 10)}`;
}

function block(type, data) {
  return { id: id(), type, data };
}

const howToBlocks = [
  block("hero", {
    title: "How to Convert PDF to Word on iPhone",
    summary: "",
  }),
  block("paragraph", {
    text: "On iPhone you can open a PDF, but you cannot edit it like a Word document. To get a .docx file, save the PDF to Files, open this converter in Safari, and download the Word file.\n\nText PDFs convert from the text already in the file. Photos of printed pages use OCR in the browser. OCR is slower, works best with clear English print, and you should check names and numbers in the result.",
  }),
  block("toolCta", {
    toolSlug: "pdf-to-word",
    title: "PDF to Word",
    text: "Runs in Safari. The file is not uploaded.",
  }),
  block("toc", { title: "On this page" }),
  block("heading", { level: 2, text: "What you need" }),
  block("list", {
    items: [
      "An iPhone or iPad",
      "Safari (avoid the in-app browser inside Mail or WhatsApp)",
      "The PDF in Files, iCloud Drive, or Downloads",
      "A readable file: typed text, or a clear photo of printed text. Handwriting is a poor fit",
    ],
  }),
  block("heading", { level: 2, text: "1. Get the PDF into Files" }),
  block("paragraph", {
    text: "Safari can only pick a file it can see. If the PDF is sitting in Mail, WhatsApp, or another app, open it there, tap Share, then Save to Files. Put it in iCloud Drive or On My iPhone. If Files does not list it, it was never saved there — that is the usual reason the picker looks empty.",
  }),
  block("image", {
    url: "/guides/illustrations/save-to-files.svg",
    alt: "Illustration: move a PDF from Mail or WhatsApp into the Files app so Safari can open it",
    caption: "Share → Save to Files, then come back to the converter.",
  }),
  block("heading", { level: 2, text: "2. Open the converter in Safari" }),
  block("paragraph", {
    text: "Use the PDF to Word tool on this site. If you opened the link inside Mail or another app, copy it into Safari. Those in-app browsers often block downloads. Keep Safari in the foreground while it works. Switching apps can reload the tab and stop the conversion.",
  }),
  block("heading", { level: 2, text: "3. Choose the file and convert" }),
  block("paragraph", {
    text: "Tap Choose PDF, pick the file, then convert. A text PDF is usually quick. A scanned PDF is read page by page on the iPhone, so a long scan takes longer and may hit memory limits. OCR is for photos of printed text. It is not a handwriting reader. Check names, numbers, and tables in the Word file.",
  }),
  block("heading", { level: 2, text: "4. Download the Word file and check it" }),
  block("paragraph", {
    text: "When it finishes, download the .docx. On iPhone it usually appears in Files → Downloads, or in the share sheet. Open it in Pages, Microsoft Word, or Files. Confirm that the text you care about is actually there before you delete the original PDF. If the document is blank, the PDF was probably an image-only scan that OCR could not read.",
  }),
  block("example", {
    title: "Example",
    situation: "You received a two-page school form as a PDF and need to change a date and a name.",
    result: "Save the PDF to Files, convert it in Safari, open the Word file in Pages, edit the two fields, and send it back.",
  }),
  block("heading", { level: 2, text: "If it does not work" }),
  block("troubleshooting", {
    items: [
      {
        problem: "The Word file is empty",
        cause: "The PDF is a photograph, a screenshot, handwriting, or a very soft scan.",
        solution: "OCR cannot read a blurry photo well. Try a clearer scan, rotate sideways pages first, or use PDF to JPG if you only need a picture.",
      },
      {
        problem: "Safari reloads or feels stuck",
        cause: "The file is large, has many scanned pages, or the iPhone ran out of memory.",
        solution: "Keep Safari open. Use Split PDF to take the pages you need, then convert a smaller file.",
      },
      {
        problem: "Nothing downloads",
        cause: "The tool was opened inside another app’s browser, or a download prompt was dismissed.",
        solution: "Paste the link into Safari, convert again, allow the download, then look in Files → Downloads.",
      },
      {
        problem: "The PDF asks for a password",
        cause: "The file is encrypted.",
        solution: "Use Unlock PDF first with the password you already know, then convert. This site will not guess or bypass passwords.",
      },
      {
        problem: "The layout looks nothing like the PDF",
        cause: "Word is a text document. Columns, letterhead, and form fields often do not survive.",
        solution: "Use the Word file to edit text. If the page must look the same, send the original PDF or a JPG instead.",
      },
    ],
  }),
  block("heading", { level: 2, text: "Privacy" }),
  block("paragraph", {
    text: "Conversion runs in Safari on your iPhone. The PDF is not sent to our servers, so we cannot read it or store it. The file is still on your phone, and Safari may keep it in memory while the tab is open. Close the tab when you are done if you are using a shared phone.",
  }),
  block("heading", { level: 2, text: "FAQ" }),
  block("faq", {
    items: [
      {
        q: "Can I convert PDF to Word on iPhone without installing an app?",
        a: "Yes. Open this site in Safari and use PDF to Word. If the PDF is still sitting in Mail or WhatsApp, save it to Files first, then choose it in the converter. You do not need the App Store for this job.",
      },
      {
        q: "Does this work on iPad?",
        a: "Yes. The same Safari flow works on iPad. Save the PDF to Files, convert it, then open the Word file in Pages or Microsoft Word. The larger screen makes it easier to check names, dates, and tables.",
      },
      {
        q: "Will a scanned PDF become editable text?",
        a: "Often, when the scan is a clear photo of printed English text. PDF to Word runs OCR in Safari for pages that have little embedded text. It will not reliably read handwriting, stamps, or tiny photos. Check the Word file before you delete the PDF.",
      },
      {
        q: "Is the file uploaded?",
        a: "No. Conversion runs in your browser on the iPhone. The PDF is not sent to our servers, so we cannot read it or store it. Close the tab when you are done if you are using a shared phone.",
      },
    ],
  }),
  block("heading", { level: 2, text: "What to do next" }),
  block("relatedTools", {}),
  block("cta", {
    label: "Open PDF to Word on iPhone",
    href: "/iphone/pdf-to-word",
    text: "If this is the job you need, convert the file next.",
  }),
];

const IPHONE_TOOL_INTROS = {
  "pdf-to-word": {
    featured: true,
    headline: "PDF to Word on iPhone",
    intro:
      "Convert a PDF into an editable Word file in Safari. Choose a file from Files or iCloud Drive. Text PDFs convert from embedded text. Photographed pages run OCR on your iPhone.",
    sortOrder: 1,
  },
  "pdf-to-jpg": {
    featured: false,
    headline: "PDF to JPG on iPhone",
    intro:
      "Turn each PDF page into a JPG you can send in Messages or save from Files. Conversion runs in Safari. Pages become images, not editable Word text.",
    sortOrder: 2,
  },
  "merge-pdf": {
    featured: false,
    headline: "Merge PDFs on iPhone",
    intro:
      "Combine PDFs in Safari in the order you add them. Save each file to Files or iCloud Drive first so the picker can see them.",
    sortOrder: 3,
  },
  "split-pdf": {
    featured: false,
    headline: "Split a PDF on iPhone",
    intro:
      "Extract the pages you need so you can mail one sheet or send a smaller file. Choose a range or split every page.",
    sortOrder: 4,
  },
  "compress-pdf": {
    featured: false,
    headline: "Compress a PDF on iPhone",
    intro:
      "Shrink a PDF for Mail or WhatsApp. Compression runs on your iPhone. If the file cannot get smaller, the sizes are shown.",
    sortOrder: 5,
  },
};

module.exports = {
  howToBlocks,
  IPHONE_TOOL_INTROS,
  IPHONE_CLUSTER: ["pdf-to-word", "pdf-to-jpg", "merge-pdf", "split-pdf", "compress-pdf"],
  RELATED_TOOL_SLUGS: ["pdf-to-word", "pdf-to-jpg", "merge-pdf", "split-pdf", "compress-pdf"],
};
