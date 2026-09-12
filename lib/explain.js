import { MAX_FILE_BYTES, MAX_MERGE_FILES, MAX_OCR_PAGES, MAX_PAGES, formatBytes } from "@/config/brand";
import { getIphoneToolCopy } from "@/lib/devices";
import { getTool } from "@/lib/tools";

const fileLimit = formatBytes(MAX_FILE_BYTES);

const PRIVACY = [
  "Your file is processed locally in your browser and is not uploaded to PDFFlow's servers for normal tool processing.",
  "If analytics is on, it records that a page was opened, not what is inside the file. Close the tab when you are done if you are on a shared device.",
];

function happens(extra, choose = "You choose a PDF. The page reads it in memory on this device.") {
  return [
    choose,
    extra,
    "When it finishes, you download from this tab. If you close the tab first, the result is gone.",
  ].filter(Boolean);
}

export const TOOL_EXPLAIN = {
  "pdf-to-word": {
    does: [
      "This tool turns a PDF into a Word (.docx) file you can open in Microsoft Word, Pages, or Google Docs.",
      "If the PDF already contains text, that text is copied into the Word file. If a page is only a photo of a page, OCR tries to read the picture in your browser.",
    ],
    why: [
      "A PDF is handy for sending. It is a poor file to edit. Convert to Word when you need to change wording, fix a date, or reuse the text in another document.",
    ],
    usefulFor: [
      "A form or letter you need to rewrite",
      "A CV or school paper that arrived as a PDF",
      "Notes you want in a document you can type in",
    ],
    files: `Input: PDF, up to ${fileLimit} and ${MAX_PAGES} pages. Output: .docx. OCR can read up to ${MAX_OCR_PAGES} scanned pages in one go.`,
    happens: happens(
      "Text pages are extracted. Scanned pages run OCR in the browser. Then a .docx file is built for download.",
    ),
    example: {
      title: "Example",
      steps: [
        "You have a two-page PDF form and need to change a name and a date.",
        "Choose the PDF, convert it, and open the .docx in Word or Pages.",
        "Edit those two fields, then send the Word file or export a new PDF.",
      ],
    },
    tip: "Keep the original PDF until you have checked names, numbers, and tables in the Word file.",
    important:
      "Word is a text document. Columns, letterhead, and fillable form fields often do not match the original page. Use the Word file to edit text. If the page must look the same, keep the PDF or make a JPG.",
    limits: [
      `Up to ${MAX_PAGES} pages and ${fileLimit} per file.`,
      `OCR reads up to ${MAX_OCR_PAGES} scanned pages and works best on clear English print.`,
      "Handwriting, stamps, and blurry photos often fail.",
      "Complex layouts will not come out as a perfect copy of the PDF.",
    ],
    options: [],
    problems: [
      {
        problem: "The Word file is empty or almost empty",
        cause: "The PDF is a photograph, a screenshot, or a very faint scan.",
        solution: "Try a clearer scan, or convert the page to JPG if you only need a picture of it.",
      },
      {
        problem: "The layout looks nothing like the PDF",
        cause: "The converter is building a Word document, not a screenshot.",
        solution: "Edit the text in Word. Keep the original PDF when the design matters.",
      },
      {
        problem: "It feels stuck on a scan",
        cause: "OCR reads each page on your device and is slower, especially on a phone.",
        solution: "Keep this tab open. Split off the pages you need if the file is long.",
      },
    ],
    relatedGuideSlugs: ["convert-pdf-to-word-on-iphone"],
  },
  "pdf-to-jpg": {
    does: [
      "This tool draws each PDF page as a JPG image. You get pictures of the pages, not a file you can edit as text.",
    ],
    why: [
      "Use it when you need to send a page in Messages or WhatsApp, drop a page into a slide, or save a page as a photo. JPG is a picture. Word is the tool if you need to change the words.",
    ],
    usefulFor: [
      "Sharing one page without sending the whole PDF",
      "Putting a page into an email or a chat that prefers images",
    ],
    files: `Input: PDF, up to ${fileLimit} and ${MAX_PAGES} pages. Output: one JPG, or a ZIP of JPGs if you convert more than one page.`,
    options: [
      {
        name: "Pages",
        meaning: "All pages, or a list such as 1-3, 5, 8-10.",
        when: "Use selected pages when you only need a few sheets from a long file.",
      },
      {
        name: "Image quality",
        meaning: "High keeps more detail and makes larger files. Recommended is the default. Smaller file compresses more and can look softer.",
        when: "Use high for print or zoom. Use smaller file for chat and email.",
      },
    ],
    happens: happens("Each chosen page is rendered to a JPG. One page downloads as a JPG. Several pages download as a ZIP."),
    example: {
      title: "Example",
      steps: [
        "You need page 2 of a PDF to send in a chat.",
        "Choose the PDF, pick selected pages, enter 2, then convert.",
        "Download the JPG and share it.",
      ],
    },
    tip: "If you also need to edit the text, convert a copy to Word. The JPG will not give you editable paragraphs.",
    limits: [
      `Up to ${MAX_PAGES} pages and ${fileLimit} per file.`,
      "Very large pages can take longer or hit memory limits on a phone.",
    ],
    problems: [
      {
        problem: "I got a ZIP instead of a JPG",
        cause: "More than one page was converted.",
        solution: "Unzip the file, or convert one page at a time.",
      },
      {
        problem: "The image looks soft",
        cause: "Smaller file quality was selected, or the PDF page was already low quality.",
        solution: "Try High quality, or start from a clearer PDF.",
      },
    ],
  },
  "pdf-to-excel": {
    does: [
      "This tool looks for rows and columns in a PDF and builds an Excel (.xlsx) workbook.",
      "If it cannot find a table, it says so. It does not fill a blank spreadsheet to look successful.",
    ],
    why: [
      "Useful when an invoice, list, or timetable is trapped in a PDF and you need the numbers in Excel, Numbers, or Google Sheets.",
    ],
    usefulFor: ["Invoices and statements", "Simple lists and timetables"],
    files: `Input: PDF, up to ${fileLimit} and ${MAX_PAGES} pages. Output: .xlsx. Scanned tables can use OCR (up to ${MAX_OCR_PAGES} pages).`,
    happens: happens(
      "The tool checks text positions for a table. If the page is a scan, OCR runs first. You get a workbook, or a message if nothing tabular is found.",
    ),
    example: {
      title: "Example",
      steps: [
        "You have a PDF invoice with a line-item table.",
        "Convert it and open the .xlsx in Excel.",
        "Check that amounts and dates landed in the right cells before you rely on the sheet.",
      ],
    },
    tip: "Tables with clear grid lines convert more cleanly than text dumped in a paragraph.",
    important: "Merged cells, nested headers, and scanned photos of tables often come out messy. Always check the spreadsheet.",
    limits: [
      "If there is no table, you get an error instead of an empty workbook.",
      "OCR on a photo of a table is often imperfect.",
    ],
    problems: [
      {
        problem: "No table found",
        cause: "The PDF is running text, a scan OCR could not grid, or the table is drawn as an image with no readable structure.",
        solution: "Try a text-based PDF, or copy the values by hand for a short table.",
      },
    ],
  },
  "pdf-to-ppt": {
    does: [
      "Each PDF page becomes a slide. The page is placed as an image, so the layout stays intact and the text is not separately editable in PowerPoint.",
    ],
    why: [
      "Use this when you need to present or share the pages as a .pptx deck, not when you need to rewrite the words on the slide.",
    ],
    files: `Input: PDF, up to ${fileLimit} and ${MAX_PAGES} pages. Output: .pptx.`,
    happens: happens("Each page is rendered and placed on a slide. You download a .pptx file."),
    example: {
      title: "Example",
      steps: [
        "You have a PDF handout and need it in PowerPoint for a meeting.",
        "Convert the file and open the .pptx in PowerPoint, Keynote, or Google Slides.",
      ],
    },
    tip: "If you need to change the wording, convert to Word as well, or edit in the original file.",
    important: "Slide text will not behave like normal PowerPoint text boxes.",
    limits: [`Up to ${MAX_PAGES} pages and ${fileLimit} per file.`],
    problems: [
      {
        problem: "I cannot edit the words on the slide",
        cause: "Each page is an image.",
        solution: "That is expected. Use Word if you need editable text.",
      },
    ],
  },
  "pdf-to-ebook": {
    does: [
      "Text is taken from the PDF and packed as an EPUB file you can open in Apple Books or another EPUB reader.",
      "EPUB reflows. You get reading text, not a pixel copy of each PDF page.",
    ],
    why: [
      "Useful when you want to read a text PDF on a phone or e-reader and have the words wrap to the screen.",
    ],
    files: `Input: PDF, up to ${fileLimit} and ${MAX_PAGES} pages. Output: .epub. Scanned pages can use OCR (up to ${MAX_OCR_PAGES} pages).`,
    happens: happens("Text is extracted in reading order and written into an EPUB 3 file. Scanned pages run OCR first."),
    example: {
      title: "Example",
      steps: [
        "You have a text PDF chapter you want in Books on iPhone.",
        "Convert it, download the .epub, and open it in Apple Books.",
      ],
    },
    tip: "Image-heavy magazines make poor EPUBs. This works best on documents that are mostly paragraphs.",
    limits: [
      "Layout, columns, and exact page numbers are not kept.",
      `OCR is limited to ${MAX_OCR_PAGES} scanned pages.`,
    ],
    problems: [
      {
        problem: "The book has jumbled order",
        cause: "The PDF reading order is unclear (columns, sidebars, captions).",
        solution: "Check the EPUB. For a layout-heavy file, read the PDF or convert pages to JPG instead.",
      },
    ],
  },
  "merge-pdf": {
    does: [
      "This tool combines two or more PDFs into one file, in the order you add them.",
    ],
    why: [
      "Use it when scans, forms, or downloads arrived as separate PDFs and you need one attachment.",
    ],
    usefulFor: ["Combining signed pages with a cover sheet", "Joining several scans into one document"],
    files: `Input: PDF files, up to ${MAX_MERGE_FILES} files, ${fileLimit} each. Output: one PDF.`,
    options: [
      {
        name: "Order",
        meaning: "Files are merged top to bottom in the list. Move a file up or down before you merge.",
        when: "Set the order before you run the merge. There is no automatic sort by name.",
      },
    ],
    happens: happens("Pages from each file are copied into a new PDF in list order."),
    example: {
      title: "Example",
      steps: [
        "You scanned a cover and a form as two PDFs.",
        "Add the cover first, then the form, then merge.",
        "Download the combined PDF and check the page order in Files or a reader.",
      ],
    },
    tip: "On a phone, save every file to Files or iCloud Drive first so the picker can see them.",
    limits: [
      `Up to ${MAX_MERGE_FILES} files and ${fileLimit} per file.`,
      "Very large merges can hit memory limits on a phone.",
      "Bookmarks and forms from the original files may not carry over. Check the result.",
    ],
    problems: [
      {
        problem: "A file is missing from the result",
        cause: "It was not added to the list, or it was removed before merge.",
        solution: "Add the files again in order and merge once more.",
      },
    ],
  },
  "split-pdf": {
    does: [
      "This tool pulls pages out of a PDF. You can save a range as one file, split listed ranges into separate files, or save every page on its own.",
    ],
    why: [
      "Useful when you only need a few pages to email, sign, or send — not the whole document.",
    ],
    files: `Input: PDF, up to ${fileLimit} and ${MAX_PAGES} pages. Output: one PDF, or a ZIP of PDFs if the split creates more than one file.`,
    options: [
      {
        name: "Extract selected pages into one PDF",
        meaning: "Those pages become a single new PDF, in that order.",
        when: "You need pages 12–18 as one file.",
      },
      {
        name: "Split by page ranges",
        meaning: "Each range you type becomes its own PDF.",
        when: "You want 1-3 and 8-10 as two files.",
      },
      {
        name: "Split every page",
        meaning: "Each page is a separate PDF.",
        when: "You need one file per sheet.",
      },
      {
        name: "Pages",
        meaning: "Use commas and hyphens, for example 1-3, 5, 8-10.",
        when: "Required unless you split every page.",
      },
    ],
    happens: happens("New PDFs are built from the pages you chose. One file downloads as a PDF. Several files download as a ZIP."),
    example: {
      title: "Example",
      steps: [
        "You have a 50-page PDF and only need pages 12–18.",
        "Choose extract selected pages, enter 12-18, then split.",
        "Download the smaller PDF.",
      ],
    },
    tip: "Page numbers are the numbers in the file, starting at 1, not printed folio numbers if those differ.",
    limits: [`Up to ${MAX_PAGES} pages and ${fileLimit} per file.`, "Pages outside the document are rejected."],
    problems: [
      {
        problem: "I got a ZIP",
        cause: "The split created more than one PDF.",
        solution: "Unzip it, or extract a single range into one PDF instead.",
      },
    ],
  },
  "compress-pdf": {
    does: [
      "This tool tries to make a PDF smaller so it is easier to email or upload.",
      "You see the original size and the new size. If the file does not get smaller, that is shown. There is no promised percentage.",
    ],
    why: [
      "Use it when Mail, WhatsApp, or an upload form rejects the file for size. Compression can make images look softer. Strong compression rebuilds pages as pictures, so text may stop being selectable.",
    ],
    files: `Input: PDF, up to ${fileLimit} and ${MAX_PAGES} pages. Output: PDF.`,
    options: [
      {
        name: "Low compression / high quality",
        meaning: "Light touch. The file may barely change.",
        when: "You want to keep the look and only need a little less size.",
      },
      {
        name: "Recommended",
        meaning: "The default. Tries to shrink the file without rebuilding every page as an image.",
        when: "Start here.",
      },
      {
        name: "Strong compression / smaller file",
        meaning: "Pages are rebuilt as images so the file can get smaller. Text may no longer be selectable.",
        when: "Use only when a smaller file matters more than sharp text you can copy.",
      },
    ],
    happens: happens("A new PDF is built at the level you chose. Sizes are compared before you download."),
    example: {
      title: "Example",
      steps: [
        "A scan is too large for email.",
        "Choose recommended compression and run it.",
        "Read the new size. Download only if it is small enough. If it grew, keep the original.",
      ],
    },
    tip: "If compression does not help, split out the pages you actually need, then compress that smaller file.",
    important: "Some PDFs are already small. Making another copy can even increase the size. Check the numbers on screen.",
    limits: [
      `Up to ${MAX_PAGES} pages and ${fileLimit} per file.`,
      "There is no guaranteed reduction.",
      "Strong compression can remove selectable text.",
    ],
    problems: [
      {
        problem: "The file got larger",
        cause: "The PDF was already compact, or this method does not suit it.",
        solution: "Keep the original. Try splitting pages, or strong compression only if you accept image pages.",
      },
    ],
  },
  "rotate-pdf": {
    does: ["This tool rotates pages 90°, 180°, or 270° and writes that into a new PDF."],
    why: ["Use it when a scan was saved sideways or upside down."],
    files: `Input: PDF, up to ${fileLimit} and ${MAX_PAGES} pages. Output: PDF.`,
    options: [
      {
        name: "Rotation",
        meaning: "90° clockwise, 180°, or 270°.",
        when: "Try 90° first for a sideways scan.",
      },
      {
        name: "Pages",
        meaning: "All pages, or a list such as 1, 3-4.",
        when: "Use selected pages when only some sheets are wrong.",
      },
    ],
    happens: happens("The chosen rotation is written into a new PDF for download."),
    example: {
      title: "Example",
      steps: ["Page 1 is sideways.", "Choose 90°, selected pages, enter 1, then download and check."],
    },
    tip: "Rotate before you convert to Word or JPG so the text and images are the right way up.",
    limits: [`Up to ${MAX_PAGES} pages and ${fileLimit} per file.`],
    problems: [
      {
        problem: "The wrong pages turned",
        cause: "All pages was selected, or the page list was off by one.",
        solution: "Run it again on a copy, with selected pages.",
      },
    ],
  },
  "sign-pdf": {
    does: [
      "You draw, type, or upload a signature, place it on a page, and download a PDF with that image on the page.",
      "This is a visual signature, not a certificate-based digital signature.",
    ],
    why: ["Useful for a form that needs a name on the line, when you do not have a signing app installed."],
    files: `Input: PDF, up to ${fileLimit} and ${MAX_PAGES} pages. Output: PDF with the signature image embedded.`,
    options: [
      {
        name: "Draw, type, or upload",
        meaning: "Draw with a finger or mouse, type a name, or use a PNG/JPG of a signature.",
        when: "Draw on a phone. Upload if you already have a signature image.",
      },
    ],
    happens: happens("You place the signature on a page preview. The downloaded PDF includes that image on the page."),
    example: {
      title: "Example",
      steps: [
        "Open the form PDF, draw a signature, drag it onto the line, then download.",
        "Open the downloaded file and confirm the signature is on the page.",
      ],
    },
    tip: "This is not a legally certified digital signature. If a process requires a certificate, use the tool they specify.",
    limits: [
      `Up to ${MAX_PAGES} pages and ${fileLimit} per file.`,
      "The signature is an image on the page, not a cryptographic signature.",
    ],
    problems: [
      {
        problem: "The signature is missing after I close the tab",
        cause: "The signed file only exists once you download it.",
        solution: "Download before you leave. Processing stays in this tab.",
      },
    ],
  },
  "protect-pdf": {
    does: [
      "This tool encrypts a PDF with a password you choose. Most readers will ask for that password before opening the file.",
    ],
    why: ["Use it before you send a file that should not open if the attachment is forwarded."],
    files: `Input: PDF, up to ${fileLimit} and ${MAX_PAGES} pages. Output: password-protected PDF.`,
    options: [
      {
        name: "Password and confirm",
        meaning: "The two fields must match. The password is used on this device only.",
        when: "Pick a password you can store somewhere safe. This site cannot recover it later.",
      },
    ],
    happens: happens("The PDF is encrypted in this tab. The password is not uploaded to PDFFlow's servers."),
    example: {
      title: "Example",
      steps: ["Choose the PDF, enter a password twice, protect it, then send the new file and the password by a separate channel."],
    },
    tip: "If you forget the password, this site cannot unlock the file. Keep an unprotected copy if you still need one.",
    limits: [
      `Up to ${MAX_PAGES} pages and ${fileLimit} per file.`,
      "Encryption uses AES. We cannot reset your password.",
    ],
    problems: [
      {
        problem: "The passwords do not match",
        cause: "Confirm does not equal password.",
        solution: "Type both again.",
      },
    ],
  },
  "unlock-pdf": {
    does: [
      "This tool removes a password you already know and gives you an unlocked copy.",
      "It will not guess, crack, or bypass encryption.",
    ],
    why: ["Useful when you own the file and want a copy that opens without typing the password every time."],
    files: `Input: password-protected PDF, up to ${fileLimit} and ${MAX_PAGES} pages. Output: PDF without that password.`,
    options: [
      {
        name: "Current password",
        meaning: "The password that already opens the file.",
        when: "Required. A wrong password fails.",
      },
    ],
    happens: happens("If the password is correct, a copy without that password is created in this tab."),
    example: {
      title: "Example",
      steps: ["You know the password, but a printer app will not accept locked PDFs. Unlock a copy, then print."],
    },
    tip: "If you forgot the password, stop here. Use a backup or the original unlocked file if you still have it.",
    important: "Only unlock files you have the right to unlock.",
    limits: [
      `Up to ${MAX_PAGES} pages and ${fileLimit} per file.`,
      "This is not a password recovery service.",
    ],
    problems: [
      {
        problem: "Incorrect password",
        cause: "The password does not match.",
        solution: "Try again. Caps lock and extra spaces count.",
      },
    ],
  },
  "word-to-pdf": {
    does: [
      "This tool turns a Word (.docx) file into a PDF you can open, send, or print.",
      "Paragraphs, headings, lists, and embedded photos are included. Columns and unusual fonts are simplified.",
    ],
    why: ["Use it when someone asked for a PDF and you only have a Word file."],
    files: `Input: .docx, up to ${fileLimit}. Output: PDF. Old .doc files are not supported.`,
    happens: happens(
      "The Word file is read in this tab. A PDF is built from the text and images.",
      "You choose a .docx file. The page reads it in memory on this device.",
    ),
    example: {
      title: "Example",
      steps: ["You wrote a letter in Word. Convert it to PDF before you email it."],
    },
    important: "Check the PDF. Layout will not always match Microsoft Word.",
    limits: [`Up to ${fileLimit}.`, "Save .doc files as .docx first.", "Best with ordinary English text."],
    problems: [
      {
        problem: "The tool rejects the file",
        cause: "It is a .doc file, or not a real .docx.",
        solution: "Open it in Word or Pages, Save As .docx, then convert that file.",
      },
    ],
  },
  "image-to-pdf": {
    does: ["This tool places photos into a PDF, one image per page, in the order you add them."],
    why: ["Useful for sending several pictures as one file, or for a form that only accepts PDF."],
    files: `Input: JPG, PNG, WEBP, GIF, or HEIC, up to ${MAX_MERGE_FILES} files and ${fileLimit} each. Output: PDF.`,
    happens: happens(
      "Each image is placed on a page without cropping.",
      "You choose photos. The page reads them in memory on this device.",
    ),
    example: {
      title: "Example",
      steps: ["You have three iPhone photos of a receipt. Add them in order and download one PDF."],
    },
    tip: "Use Up and Down to change page order before you create the PDF.",
    limits: [`Up to ${MAX_MERGE_FILES} images.`, "HEIC works best in Safari on iPhone."],
    problems: [
      {
        problem: "A HEIC photo will not convert",
        cause: "The browser cannot decode that file.",
        solution: "Open this page in Safari, or export the photo as JPG from Photos first.",
      },
    ],
  },
  "image-to-jpg": {
    does: ["This tool converts PNG, WEBP, GIF, or HEIC images to JPG."],
    why: ["Use it when an app will not accept HEIC or PNG."],
    files: `Input: common image files, up to ${MAX_MERGE_FILES} and ${fileLimit} each. Output: JPG or a ZIP of JPGs.`,
    happens: happens(
      "Each image is redrawn as a JPG in this tab.",
      "You choose images. The page reads them in memory on this device.",
    ),
    limits: [`Up to ${MAX_MERGE_FILES} images.`, "Animated GIFs become a still frame."],
  },
  "heic-to-jpg": {
    does: ["This tool converts iPhone HEIC photos to JPG."],
    why: ["Windows apps and many websites cannot open HEIC."],
    files: `Input: HEIC or HEIF, up to ${fileLimit}. Output: JPG.`,
    happens: happens(
      "The photo is decoded in this browser and saved as JPG.",
      "You choose a HEIC photo. The page reads it in memory on this device.",
    ),
    important: "Safari on iPhone is the most reliable place to convert HEIC.",
    limits: ["Some HEIC files from other cameras may fail."],
  },
  "pdf-to-png": {
    does: ["This tool draws each PDF page as a PNG image."],
    why: ["Use PNG when you want a still picture of a page without JPG compression."],
    files: `Input: PDF, up to ${fileLimit} and ${MAX_PAGES} pages. Output: PNG or a ZIP of PNGs.`,
    happens: happens("Each chosen page is rendered to a PNG in this tab."),
  },
  "extract-images": {
    does: ["This tool saves photos that are stored inside a PDF."],
    why: ["Useful when a PDF contains photos you want as separate files."],
    files: `Input: PDF, up to ${fileLimit}. Output: PNG or a ZIP.`,
    happens: happens(
      "The PDF is scanned for embedded image objects. Page screenshots are not created.",
      "You choose a PDF. The page reads it in memory on this device.",
    ),
    important: "Scanned PDFs usually have no separate photos. Use PDF to JPG for those.",
    limits: ["Tiny icons are skipped.", "If nothing is stored as an image object, extraction fails on purpose."],
    problems: [
      {
        problem: "No images found",
        cause: "The pages are scans, or images are drawn in a way this tool cannot pull out.",
        solution: "Use PDF to JPG or PDF to PNG to export the pages.",
      },
    ],
  },
};

function parseOverlay(raw) {
  if (!raw) return null;
  if (typeof raw === "object") return raw;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function overlayExplain(base, overlay) {
  if (!overlay) return base;
  const next = { ...base };
  for (const key of ["does", "why", "usefulFor", "happens", "limits", "files", "tip", "important"]) {
    if (overlay[key] != null && overlay[key] !== "") next[key] = overlay[key];
  }
  if (Array.isArray(overlay.how) && overlay.how.length) next.how = overlay.how;
  if (overlay.example && (overlay.example.title || overlay.example.steps)) next.example = { ...base.example, ...overlay.example };
  if (Array.isArray(overlay.problems) && overlay.problems.length) next.problems = overlay.problems;
  if (typeof overlay.howTitle === "string" && overlay.howTitle) next.howTitle = overlay.howTitle;
  return next;
}

export function getToolExplain(tool, { device, cmsExplain } = {}) {
  const catalog = getTool(tool?.slug) || tool;
  const base = TOOL_EXPLAIN[catalog.slug] || {};
  const merged = overlayExplain(
    {
      name: catalog.name,
      slug: catalog.slug,
      howTitle: catalog.howToTitle || "How to use this tool",
      how: catalog.howTo || [],
      faqs: catalog.faqs || [],
      privacy: PRIVACY,
      ...base,
    },
    parseOverlay(cmsExplain),
  );

  if (device === "iphone") {
    const copy = getIphoneToolCopy(catalog.slug);
    if (copy?.howTo?.length) {
      merged.howTitle = "How to use this on iPhone";
      merged.how = copy.howTo;
    }
    merged.deviceNote =
      "Open this page in Safari. In-app browsers in Mail, WhatsApp, or Instagram often block downloads. Choose the PDF from Files, iCloud Drive, or Downloads. Processing stays on the iPhone.";
    merged.problems = [
      ...(merged.problems || []),
      {
        problem: "Nothing downloads",
        cause: "The page was opened inside another app, or the download prompt was dismissed.",
        solution: "Paste the link into Safari, convert again, allow the download, then look in Files → Downloads.",
      },
      {
        problem: "Safari cannot see the PDF",
        cause: "The file is still sitting in Mail or another app.",
        solution: "Share → Save to Files, then return here.",
      },
    ].filter((item, index, list) => list.findIndex((row) => row.problem === item.problem) === index);
  }

  return merged;
}

export function explainToOverlay(explain) {
  if (!explain) return {};
  return {
    does: explain.does || [],
    why: explain.why || [],
    usefulFor: explain.usefulFor || [],
    files: explain.files || "",
    happens: explain.happens || [],
    example: explain.example || null,
    tip: explain.tip || "",
    important: explain.important || "",
    limits: explain.limits || [],
    howTitle: explain.howTitle || "",
    how: explain.how || [],
  };
}
