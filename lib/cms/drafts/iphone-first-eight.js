function id() {
  return `b_${Math.random().toString(36).slice(2, 10)}`;
}

function b(type, data) {
  return { id: id(), type, data };
}

function toolCard(slug, title, text) {
  return b("toolCta", { toolSlug: slug, title, text });
}

export const IPHONE_FIRST_EIGHT = [
  {
    slug: "convert-picture-to-pdf-on-iphone",
    title: "How to Convert a Picture to PDF on iPhone",
    seoTitle: "Convert a Picture to PDF on iPhone (Photos, Files, Safari)",
    seoDescription:
      "Turn iPhone photos into a PDF in Safari, or use Print from Photos for a single picture. Covers HEIC, Files, and what the Image to PDF tool actually does.",
    excerpt:
      "If a form will only take a PDF and you have photos in the Camera Roll, you need a file, not another screenshot. On iPhone you can print one picture to PDF, or put several photos into one PDF in Safari.",
    template: "HOW_TO",
    tool: "image-to-pdf",
    planning: {
      primaryKeyword: "convert picture to PDF on iPhone",
      supportingKeywords: ["photo to PDF iPhone", "image to PDF iPhone", "pic to PDF iPhone"],
      searchIntent: "how-to",
      deviceIntent: "iphone",
      toolDependency: "image-to-pdf",
      priority: "P1",
      relatedSearches: ["save photo as PDF iPhone", "multiple photos one PDF"],
      internalLinkNotes: "Main CTA: Image to PDF. Related: HEIC to JPG if Windows cannot open the original photo; merge if the PDFs already exist.",
      sources: [
        {
          title: "Apple Support: Files on iPhone",
          url: "https://support.apple.com/guide/iphone/use-the-files-app-iphabd0c0d05/ios",
          note: "Used for where Safari can pick a photo that was saved to Files.",
        },
      ],
    },
    relatedTools: ["image-to-pdf", "heic-to-jpg", "merge-pdf"],
    relatedSlugs: ["how-to-convert-heic-to-jpg-on-iphone", "merge-pdf-files-on-iphone"],
    blocks: [
      b("paragraph", {
        text: "Photos on iPhone are usually HEIC or JPG sitting in the Photos app. A website or HR portal that asks for a PDF will reject those. The job is to wrap the picture in a PDF page without leaving the phone, and without sending the photo to a random upload site if you can avoid it.",
      }),
      b("diagram", {
        title: "Short path",
        steps: ["Choose photos", "Create PDF in Safari", "Download and check Files"],
      }),
      toolCard("image-to-pdf", "Convert your picture to PDF", "Open Image to PDF. It runs in this browser tab and places each photo on its own page."),
      b("heading", { level: 2, text: "One photo: Print from Photos" }),
      b("steps", {
        items: [
          {
            title: "Open the picture in Photos",
            text: "Use Share. If Print is missing, scroll the share sheet to the end and add it under Edit Actions.",
          },
          {
            title: "Tap Print, then pinch the thumbnail",
            text: "The print preview looks like a page. Pinch it open — that is a PDF view, not a zoom of the photo.",
          },
          {
            title: "Share again and Save to Files",
            text: "This stays on the iPhone. It is one picture at a time. A stack of receipts needs the converter below.",
          },
        ],
      }),
      b("ribbon", {
        variant: "tip",
        title: "Tip",
        text: "If Print is missing in Share, scroll the share sheet to the end and add it under Edit Actions. You are still on the iPhone — nothing is uploaded.",
      }),
      b("heading", { level: 2, text: "Several photos: Image to PDF in Safari" }),
      b("paragraph", {
        text: "Print-to-PDF will not batch a stack of receipts. Open the Image to PDF tool in Safari — not inside Mail, WhatsApp, or Instagram’s in-app browser, which often block downloads. Add the photos in the order they should appear. Each image becomes one page. Nothing is cropped. HEIC from the Camera Roll usually works in Safari; if a photo fails, export it as JPG from Photos first or use HEIC to JPG.",
      }),
      b("heading", { level: 3, text: "Get the photos where Safari can see them" }),
      b("paragraph", {
        text: "The file picker talks to Files, Recents, and Browse, not to every album view inside Photos. If a photo will not appear, open it in Photos, tap Share, Save to Files, then pick it from there. iCloud photos that have not finished downloading will also look missing.",
      }),
      b("example", {
        title: "Example",
        situation: "You have three photos of a paper receipt and a landlord portal that only accepts PDF.",
        result: "Save the three shots to Files if the picker is empty, add them in order in Image to PDF, download one PDF, and open it in Files to confirm all three pages are there before you upload it.",
      }),
      b("heading", { level: 2, text: "What this tool will not do" }),
      b("list", {
        items: [
          "It does not OCR the photo into selectable text. A picture of a page stays a picture on a PDF page.",
          "It does not crop or straighten. Do that in Photos first if the shot is crooked.",
          "It is limited in how many images you can add in one go. Split the job if you hit the cap.",
        ],
      }),
      b("faq", {
        items: [
          {
            q: "Is this the same as screenshotting a photo?",
            a: "No. A screenshot of Photos is another image, usually worse. A PDF page holds the photo at the resolution the converter can read from the file you picked.",
          },
          {
            q: "Can I combine photos that are already PDFs?",
            a: "Use Merge PDF for existing PDFs. Image to PDF is for pictures that are still images.",
          },
        ],
      }),
    ],
  },
  {
    slug: "how-to-convert-pdf-to-word-on-iphone",
    title: "How to Convert PDF to Word on iPhone",
    seoTitle: "Convert PDF to Word on iPhone in Safari",
    seoDescription:
      "Get a .docx from a PDF on iPhone. Save the file to Files first, convert in Safari, and check scanned pages. Pages is not a Word export.",
    excerpt:
      "iPhone will show a PDF. It will not hand you a Word file you can rewrite. If the PDF is still in Mail or WhatsApp, Safari cannot pick it until you save it to Files.",
    template: "HOW_TO",
    tool: "pdf-to-word",
    planning: {
      primaryKeyword: "convert PDF to Word on iPhone",
      supportingKeywords: ["PDF to Word iPhone", "PDF to docx Safari"],
      searchIntent: "how-to",
      deviceIntent: "iphone",
      toolDependency: "pdf-to-word",
      priority: "P1",
      relatedSearches: ["edit PDF as Word on iPhone", "PDF to Pages iPhone"],
      internalLinkNotes: "A published guide already exists at convert-pdf-to-word-on-iphone. This draft is for review before replacing it. CTA: /iphone/pdf-to-word.",
      sources: [
        {
          title: "Apple Support: Files on iPhone",
          url: "https://support.apple.com/guide/iphone/use-the-files-app-iphabd0c0d05/ios",
          note: "Used for Save to Files from other apps so Safari can open the PDF.",
        },
      ],
    },
    relatedTools: ["pdf-to-word", "word-to-pdf", "unlock-pdf", "split-pdf"],
    relatedSlugs: ["convert-word-to-pdf-on-iphone", "split-a-pdf-on-iphone"],
    blocks: [
      b("paragraph", {
        text: "Opening a PDF in Files or Mail is reading. Converting to Word is for when you need to change a date, a name, or a paragraph and send a .docx back. Pages can open many PDFs; it does not give you a Microsoft Word file. Markup does not either.",
      }),
      toolCard("pdf-to-word", "Convert PDF to Word", "Runs in Safari. Text PDFs use the text already in the file. Photographed pages run OCR on the iPhone."),
      b("heading", { level: 2, text: "Save the PDF to Files first" }),
      b("paragraph", {
        text: "Safari’s picker sees Files, iCloud Drive, and Downloads. It does not see an attachment that is still sitting inside Mail or WhatsApp. Open the PDF there, tap Share, Save to Files, and put it On My iPhone or iCloud Drive. If the picker looks empty, the file was never saved — that is the usual miss, not a broken converter.",
      }),
      b("heading", { level: 2, text: "Convert in Safari, not an in-app browser" }),
      b("paragraph", {
        text: "Open the PDF to Word tool in Safari. If you tapped a link inside Mail, copy it into Safari. In-app browsers often swallow the download. Keep Safari in the foreground. Switching apps can reload the tab and stop OCR on a long scan.",
      }),
      b("ribbon", {
        variant: "warning",
        title: "Warning",
        text: "A password-protected PDF will not convert until you unlock it with the password you already know. This site will not guess or bypass encryption.",
      }),
      b("heading", { level: 2, text: "Text PDF versus a photo of a page" }),
      b("paragraph", {
        text: "If you can select text in Files, conversion is using that text. If the page is a photograph, OCR runs in the browser. That path is slower, works best with clear English print, and is a poor fit for handwriting or a blurry phone snap. Check names and numbers in the Word file before you delete the PDF.",
      }),
      b("troubleshooting", {
        items: [
          {
            problem: "The Word file is blank",
            cause: "The PDF is image-only and OCR could not read it, or the page is sideways.",
            solution: "Rotate sideways pages first, try a clearer scan, or use PDF to JPG if you only need a picture of the page.",
          },
          {
            problem: "Nothing appears in Downloads",
            cause: "The page was opened inside another app, or the download prompt was dismissed.",
            solution: "Paste the link into Safari, convert again, allow the download, then look in Files → Downloads.",
          },
        ],
      }),
    ],
  },
  {
    slug: "convert-word-to-pdf-on-iphone",
    title: "How to Convert Word to PDF on iPhone",
    seoTitle: "Convert Word to PDF on iPhone (.docx in Safari)",
    seoDescription:
      "Turn a .docx into a PDF on iPhone. Pages can export. The Word to PDF tool in Safari is for a file already in Files. Old .doc files need a resave.",
    excerpt:
      "A .docx on iPhone is not a PDF until you export it. Pages can do that for a document it can open. If you already have the Word file in Files, Safari can convert it on the device.",
    template: "HOW_TO",
    tool: "word-to-pdf",
    planning: {
      primaryKeyword: "convert Word to PDF on iPhone",
      supportingKeywords: ["docx to PDF iPhone", "Word document to PDF Safari"],
      searchIntent: "how-to",
      deviceIntent: "iphone",
      toolDependency: "word-to-pdf",
      priority: "P1",
      relatedSearches: ["Pages export PDF iPhone", "save Word as PDF iPhone"],
      internalLinkNotes: "CTA: /tools/word-to-pdf. Related: PDF to Word if they need the other direction.",
      sources: [
        {
          title: "Apple Support: Files on iPhone",
          url: "https://support.apple.com/guide/iphone/use-the-files-app-iphabd0c0d05/ios",
          note: "Used for picking a .docx that was saved out of Mail or another app.",
        },
      ],
    },
    relatedTools: ["word-to-pdf", "pdf-to-word", "compress-pdf"],
    relatedSlugs: ["how-to-convert-pdf-to-word-on-iphone", "compress-a-pdf-on-iphone"],
    blocks: [
      b("heading", { level: 2, text: "If the document is already in Pages" }),
      b("paragraph", {
        text: "Open it in Pages, tap the three dots, tap Export, then PDF. That is the native path. Use it when you wrote the file on the iPhone and Pages can open it cleanly.",
      }),
      b("heading", { level: 2, text: "If you only have a .docx in Files" }),
      b("paragraph", {
        text: "Open Word to PDF in Safari. Choose the .docx. The tool reads the file in the browser and writes a PDF with selectable text for ordinary English documents. Complex columns, text boxes, and some graphics will not match Microsoft Word on a desktop. Check the PDF before you send it.",
      }),
      toolCard("word-to-pdf", "Convert Word to PDF", "Accepts .docx only. Processing stays in this tab."),
      b("ribbon", {
        variant: "important",
        title: "Important",
        text: "Old .doc files (the pre-2007 format) are rejected on purpose. Open the file in Pages or Word and Save As or Export to .docx, then convert that file.",
      }),
      b("comparison", {
        headers: ["Method", "Best when", "Watch out"],
        rows: [
          ["Pages Export", "You can open the document in Pages", "Formatting still needs a visual check"],
          ["Word to PDF in Safari", "The .docx is already in Files and you want it done in the browser", "Layout is simplified; .doc is not accepted"],
        ],
      }),
      b("heading", { level: 2, text: "After it downloads" }),
      b("paragraph", {
        text: "Look in Files → Downloads. Open the PDF once. If the portal you are sending it to has a size cap, compress it next. If you need to go back to Word later, keep the .docx.",
      }),
    ],
  },
  {
    slug: "convert-pdf-to-jpg-on-iphone",
    title: "How to Convert PDF to JPG on iPhone",
    seoTitle: "Convert PDF to JPG on iPhone and save the pages",
    seoDescription:
      "Turn PDF pages into JPG images in Safari on iPhone. One page downloads as a JPG. Several pages download as a ZIP. Save to Files or Photos from there.",
    excerpt:
      "You need a picture of a PDF page — for Photos, a chat, or a form that will not take a PDF. Safari can render the page to JPG on the iPhone. A screenshot of Files is usually worse.",
    template: "HOW_TO",
    tool: "pdf-to-jpg",
    planning: {
      primaryKeyword: "convert PDF to JPG on iPhone",
      supportingKeywords: ["PDF to image iPhone", "PDF page to photo iPhone"],
      searchIntent: "how-to",
      deviceIntent: "iphone",
      toolDependency: "pdf-to-jpg",
      priority: "P1",
      relatedSearches: ["save PDF page to Photos", "PDF screenshot iPhone"],
      internalLinkNotes: "CTA: /iphone/pdf-to-jpg. Related: Image to PDF if they need the reverse; PNG if they want lossless.",
      sources: [],
    },
    relatedTools: ["pdf-to-jpg", "pdf-to-png", "image-to-pdf"],
    relatedSlugs: ["convert-picture-to-pdf-on-iphone", "split-a-pdf-on-iphone"],
    blocks: [
      b("paragraph", {
        text: "A screenshot of a PDF in Files captures the chrome, the crop, and whatever brightness the screen was at. Converting the page draws that page to a JPG at a chosen quality. Use it when you want the page itself, not a photo of your screen.",
      }),
      toolCard("pdf-to-jpg", "Convert PDF to JPG", "Each chosen page becomes a JPG. More than one page downloads as a ZIP."),
      b("heading", { level: 2, text: "On iPhone" }),
      b("paragraph", {
        text: "Open the tool in Safari. Pick the PDF from Files. Choose all pages or a range such as 1-3, 5. Convert. One page is a JPG you can share into Photos. Several pages arrive as a ZIP — open that ZIP in Files, then save the JPGs you want. Very large PDFs can hitch or run out of memory on older iPhones; split the file first if it stalls.",
      }),
      b("ribbon", {
        variant: "note",
        title: "Note",
        text: "Need a sharper still image and can live with a bigger file? PDF to PNG is the lossless sibling. JPG is usually enough for a photo of a page.",
      }),
      b("heading", { level: 2, text: "When a screenshot is still fine" }),
      b("paragraph", {
        text: "If you only need to show someone a stamp or a signature on screen, a screenshot is faster. If you need a clean page to attach or print, convert the page.",
      }),
      b("prosCons", {
        pros: ["Page image without Files chrome", "You can take only some pages", "Stays in the browser tab"],
        cons: ["A ZIP is extra work on iPhone if you converted many pages", "This is a picture of the page, not an editable Word file"],
      }),
    ],
  },
  {
    slug: "how-to-convert-heic-to-jpg-on-iphone",
    title: "How to Convert HEIC to JPG on iPhone",
    seoTitle: "Convert HEIC to JPG on iPhone (or change the camera format)",
    seoDescription:
      "iPhone photos are often HEIC. Convert one to JPG in Safari, or switch the camera to Most Compatible. Windows apps frequently cannot open HEIC.",
    excerpt:
      "The photo looks fine on your iPhone and will not open on a Windows PC. That is usually HEIC, not a corrupt file. You can convert the photo, or stop shooting HEIC for photos you know you will send.",
    template: "HOW_TO",
    tool: "heic-to-jpg",
    planning: {
      primaryKeyword: "convert HEIC to JPG on iPhone",
      supportingKeywords: ["HEIC to JPEG iPhone", "iPhone photo to JPG"],
      searchIntent: "how-to",
      deviceIntent: "iphone",
      toolDependency: "heic-to-jpg",
      priority: "P1",
      relatedSearches: ["Windows cannot open HEIC", "Most Compatible iPhone camera"],
      internalLinkNotes: "CTA: /tools/heic-to-jpg. Real HEIC decode is most reliable in Safari. Do not claim every camera HEIC was lab-tested.",
      sources: [
        {
          title: "Apple Support: How to use HEIF or HEVC on iPhone",
          url: "https://support.apple.com/en-us/106587",
          note: "Used for the camera setting that records JPEG instead of HEIC. Not copied.",
        },
      ],
    },
    relatedTools: ["heic-to-jpg", "image-to-jpg", "image-to-pdf"],
    relatedSlugs: ["convert-picture-to-pdf-on-iphone", "convert-pdf-to-jpg-on-iphone"],
    blocks: [
      b("paragraph", {
        text: "iPhone can store photos as HEIC to save space. Preview on the phone always works. A lot of Windows software, older email systems, and some upload forms do not. The person on the other end is not failing to “open a JPG” — they never received one.",
      }),
      b("heading", { level: 2, text: "Stop new photos being HEIC" }),
      b("paragraph", {
        text: "Settings → Camera → Formats. Most Compatible records JPEG. High Efficiency records HEIC. Change this if you constantly send photos to PCs. It does not convert the pictures you already took.",
      }),
      b("heading", { level: 2, text: "Convert a photo you already have" }),
      b("paragraph", {
        text: "Share from Photos sometimes offers JPG when you send to certain apps, but it is inconsistent. For a file you can attach anywhere, open HEIC to JPG in Safari, choose the photo, and download a JPG. Safari on iPhone is the reliable place to decode HEIC. Another browser, or a HEIC from a camera that is not an iPhone, may fail — if it does, export JPG from Photos on a Mac, or ask the sender for a different format.",
      }),
      toolCard("heic-to-jpg", "Convert HEIC to JPG", "Runs in this browser tab. Safari on iPhone is the path we expect to work."),
      b("ribbon", {
        variant: "warning",
        title: "Warning",
        text: "This is not a promise that every .heic file from every device will decode. If the tool rejects the file, it is telling you the browser could not read it.",
      }),
      b("heading", { level: 2, text: "Need a PDF instead?" }),
      b("paragraph", {
        text: "Image to PDF can take a HEIC in Safari and put it on a PDF page. Convert to JPG first if the person needs a photo they can drop into Word or an email without a PDF.",
      }),
    ],
  },
  {
    slug: "merge-pdf-files-on-iphone",
    title: "How to Merge PDF Files on iPhone",
    seoTitle: "Merge PDF Files on iPhone in Safari",
    seoDescription:
      "Combine PDFs on iPhone in the order you add them. Save each file to Files first. Safari must stay open. There is no Files app “join PDFs” button.",
    excerpt:
      "iPhone will not glue two PDFs together in Files. If you have a signed front page and a separate form, save both to Files, then merge them in Safari in the order they should read.",
    template: "HOW_TO",
    tool: "merge-pdf",
    planning: {
      primaryKeyword: "merge PDF on iPhone",
      supportingKeywords: ["combine PDFs iPhone", "join PDF files Safari"],
      searchIntent: "how-to",
      deviceIntent: "iphone",
      toolDependency: "merge-pdf",
      priority: "P1",
      relatedSearches: ["put two PDFs together iPhone"],
      internalLinkNotes: "CTA: /iphone/merge-pdf. Related: split if they merged too much; compress if email rejects the result.",
      sources: [],
    },
    relatedTools: ["merge-pdf", "split-pdf", "compress-pdf"],
    relatedSlugs: ["split-a-pdf-on-iphone", "compress-a-pdf-on-iphone"],
    blocks: [
      b("paragraph", {
        text: "Files can move and rename PDFs. It cannot concatenate them. Shortcuts exist for this if you already built one; most people have not. The merge tool on this site takes the files you add and writes one PDF, in that order, in the browser.",
      }),
      toolCard("merge-pdf", "Merge PDF files", "Add the PDFs in order. The download is one file. Nothing is uploaded for merging."),
      b("heading", { level: 2, text: "Order is the whole job" }),
      b("paragraph", {
        text: "Add the cover first, then the rest. Use the up and down controls before you merge if you tapped them in the wrong sequence. There is no later “sort by name” step. Passwords: unlock a locked file first with the password you know, then merge.",
      }),
      b("heading", { level: 2, text: "iPhone picker quirks" }),
      b("paragraph", {
        text: "Save attachments from Mail or chat into Files before you start. Merge needs more than one file, so pick them one after another. Keep Safari open until the download appears. A large merge can take a moment on a phone; that is the device working, not a spinner you should background.",
      }),
      b("example", {
        title: "Example",
        situation: "A two-page application and a one-page ID scan, both PDFs.",
        result: "Save both to Files, add the application first, add the ID, merge, open the result and confirm the ID is last before you upload.",
      }),
    ],
  },
  {
    slug: "split-a-pdf-on-iphone",
    title: "How to Split a PDF on iPhone",
    seoTitle: "Split a PDF on iPhone — extract pages in Safari",
    seoDescription:
      "Pull pages out of a PDF on iPhone. Extract a range or save each page. Files cannot do this. Split in Safari, then share only what you meant to send.",
    excerpt:
      "You do not want to email a 40-page packet when the office asked for page 3. On iPhone, split the PDF in Safari and keep the original until you have checked the extract.",
    template: "HOW_TO",
    tool: "split-pdf",
    planning: {
      primaryKeyword: "split PDF on iPhone",
      supportingKeywords: ["extract PDF pages iPhone", "separate PDF pages Safari"],
      searchIntent: "how-to",
      deviceIntent: "iphone",
      toolDependency: "split-pdf",
      priority: "P1",
      relatedSearches: ["save one page from PDF iPhone"],
      internalLinkNotes: "CTA: /iphone/split-pdf. Related: merge to put pieces back; compress if still large.",
      sources: [],
    },
    relatedTools: ["split-pdf", "merge-pdf", "compress-pdf"],
    relatedSlugs: ["merge-pdf-files-on-iphone", "compress-a-pdf-on-iphone"],
    blocks: [
      b("paragraph", {
        text: "Markup lets you scribble on a PDF. It does not export “just page 2”. Split PDF reads the file on the iPhone and writes a new PDF with the pages you asked for, or one file per page.",
      }),
      toolCard("split-pdf", "Split a PDF", "Extract a page range, or split every page. The original file is not deleted."),
      b("heading", { level: 2, text: "Extract versus explode" }),
      b("paragraph", {
        text: "Extract is “give me pages 2–4 as one PDF.” Split each page is “give me page files.” Use extract when someone asked for a section. Use one-file-per-page when you need to drop a single sheet into Photos via PDF to JPG next, or send page 1 only.",
      }),
      b("heading", { level: 2, text: "On the iPhone" }),
      b("paragraph", {
        text: "Save the packet to Files, open Split PDF in Safari, type a range the same way you would on paper: 1-3, 8. Invalid ranges are rejected before it starts. Download, then open the new file and count the pages. If Safari was inside WhatsApp, copy the tool link into real Safari or the download will vanish.",
      }),
      b("ribbon", {
        variant: "tip",
        title: "Tip",
        text: "If the file is huge because of scanned photos, split out the pages you need first, then compress that smaller PDF. Compressing the whole packet is slower on a phone.",
      }),
    ],
  },
  {
    slug: "compress-a-pdf-on-iphone",
    title: "How to Compress a PDF on iPhone",
    seoTitle: "Compress a PDF on iPhone when Mail says it is too large",
    seoDescription:
      "Reduce a PDF on iPhone in Safari. If the file cannot get smaller, the tool says so. Split scanned packets first. This is not a magic 90% shrink.",
    excerpt:
      "Mail and many portals cap attachments. Compressing a PDF on iPhone rewrites the file in Safari. If the PDF is already lean, the result can stay the same size or grow — the tool tells you instead of pretending.",
    template: "HOW_TO",
    tool: "compress-pdf",
    planning: {
      primaryKeyword: "compress PDF on iPhone",
      supportingKeywords: ["reduce PDF size iPhone", "make PDF smaller Safari"],
      searchIntent: "how-to",
      deviceIntent: "iphone",
      toolDependency: "compress-pdf",
      priority: "P1",
      relatedSearches: ["PDF too large for email iPhone"],
      internalLinkNotes: "CTA: /iphone/compress-pdf. Related: split scanned pages; JPG if they only need pictures of pages.",
      sources: [],
    },
    relatedTools: ["compress-pdf", "split-pdf", "pdf-to-jpg"],
    relatedSlugs: ["split-a-pdf-on-iphone", "convert-pdf-to-jpg-on-iphone"],
    blocks: [
      b("paragraph", {
        text: "A 20 MB scan of a ten-page lease will bounce off Mail. Photos inside the PDF are usually the weight. Compression tries to shrink those. A text-only PDF that is already 200 KB will not magically become 20 KB, and it should not — there is nothing left to throw away.",
      }),
      toolCard("compress-pdf", "Compress PDF", "Runs on the iPhone. If the output is not smaller, you will see that instead of a fake success."),
      b("heading", { level: 2, text: "Try this order" }),
      b("list", {
        items: [
          "If you only need some pages, split first. A smaller document compresses faster on a phone.",
          "Then compress. Keep Safari open.",
          "If it is still too big, convert the leftover pages to JPG and send images — only if the recipient does not need a PDF.",
        ],
      }),
      b("heading", { level: 2, text: "What “it did not shrink” means" }),
      b("paragraph", {
        text: "The file was already compressed, or it is almost all text. Sending it again through the same tool will not help. Do not keep re-compressing hoping for a different number.",
      }),
      b("ribbon", {
        variant: "note",
        title: "Privacy",
        text: "Compression happens in the browser tab. The PDF is not sent to our servers to be squeezed.",
      }),
      b("troubleshooting", {
        items: [
          {
            problem: "Still too large for Mail",
            cause: "Scanned full-color pages, or too many pages.",
            solution: "Split to the pages that matter, compress that file, or ask for a portal upload instead of email.",
          },
          {
            problem: "The PDF looks muddy",
            cause: "Photo-heavy pages were reduced.",
            solution: "Use a lighter setting if the tool offers one, or split and keep the original for printing.",
          },
        ],
      }),
    ],
  },
];
