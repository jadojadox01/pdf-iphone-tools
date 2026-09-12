export const TOOL_CATEGORIES = [
  {
    id: "convert",
    title: "Convert PDF",
    description: "Turn PDFs into Word, images, or spreadsheets, or turn photos and Word files into PDFs.",
  },
  {
    id: "organize",
    title: "Organize PDF",
    description: "Merge, split, compress, and rotate PDF files.",
  },
  {
    id: "edit",
    title: "Edit & Sign",
    description: "Add a signature to a PDF and download the file.",
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
    title: "PDF to Word",
    description:
      "Convert a PDF into a Word (.docx) file in your browser. Works on iPhone, iPad, Android, and desktop.",
    intro:
      "Upload a PDF and download a Word (.docx) file. Text PDFs use the text in the file. Scanned pages use OCR in your browser.",
    audience: "Anyone who needs an editable Word file from a PDF, including iPhone users in Safari.",
    afterUpload: "The PDF is read in your browser. If a page has little text, OCR reads the page image. Then a .docx file is created for download.",
    cta: "Convert PDF to Word",
    icon: "word",
    outputExt: "docx",
    outputLabel: "Word document",
    accept: "application/pdf,.pdf",
    multiple: false,
    related: ["word-to-pdf", "pdf-to-jpg", "pdf-to-excel", "compress-pdf"],
    howToTitle: "How to use this tool",
    howTo: [
      "Choose a PDF.",
      "Convert the file.",
      "Download the .docx file.",
      "Open it in Word or Pages and check the text.",
    ],
    faqs: [
      {
        q: "Does this work on iPhone?",
        a: "Yes. You can convert a PDF to Word in Safari without installing an app. It also works on iPad, Android, Windows, macOS, and Linux.",
      },
      {
        q: "Will scanned PDFs convert?",
        a: "Yes, when they are photos of printed text. Those pages run OCR in your browser, which is slower — especially on iPhone — and English works best. Handwriting and blurry photos often fail. Check the Word file before you rely on it.",
      },
      {
        q: "Are my files uploaded?",
        a: "No. Your file is processed locally in your browser and is not uploaded to PDFFlow's servers for normal tool processing.",
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
    title: "PDF to JPG",
    description:
      "Turn PDF pages into JPG images. Choose all pages or selected pages, then download images or a ZIP.",
    intro: "Each PDF page is turned into a JPG. Multi-page files download as a ZIP.",
    audience: "People who need photos or image copies of PDF pages, including iPhone users who want to save pages to Photos.",
    afterUpload: "Pages are rendered to JPG in your browser. One page downloads as a JPG. Multiple pages download as a ZIP.",
    cta: "Convert PDF to JPG",
    icon: "image",
    outputExt: "jpg",
    outputLabel: "JPG image",
    accept: "application/pdf,.pdf",
    multiple: false,
    related: ["pdf-to-png", "extract-images", "image-to-pdf", "pdf-to-word"],
    howToTitle: "How to use this tool",
    howTo: [
      "Choose your PDF.",
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
    slug: "pdf-to-png",
    category: "convert",
    name: "PDF to PNG",
    shortName: "PNG",
    h1: "PDF to PNG",
    title: "PDF to PNG",
    description: "Turn PDF pages into PNG images in your browser. One page downloads as a PNG. Several pages download as a ZIP.",
    intro: "Each PDF page is drawn as a PNG. Use this when you need a sharper still image than JPG.",
    afterUpload: "Pages are rendered in this browser tab. They are not uploaded to PDFFlow's servers for normal tool processing.",
    cta: "Convert PDF to PNG",
    icon: "image",
    outputExt: "png",
    outputLabel: "PNG image",
    accept: "application/pdf,.pdf",
    multiple: false,
    chooseLabel: "Choose PDF",
    related: ["pdf-to-jpg", "extract-images", "image-to-pdf", "compress-pdf"],
    howTo: ["Choose a PDF.", "Pick all pages or a page range.", "Convert, then download the PNG or ZIP."],
    faqs: [
      {
        q: "How is this different from PDF to JPG?",
        a: "PNG is lossless and often larger. JPG is smaller and is usually enough for photos of pages.",
      },
      {
        q: "Are files uploaded?",
        a: "No. Your file is processed locally in your browser and is not uploaded to PDFFlow's servers for normal tool processing.",
      },
    ],
  },
  {
    slug: "word-to-pdf",
    category: "convert",
    name: "Word to PDF",
    shortName: "Word → PDF",
    h1: "Word to PDF",
    title: "Word to PDF",
    description: "Convert a Word (.docx) file into a PDF in your browser.",
    intro: "Choose a .docx file and download a PDF. Text stays selectable. Complex layouts are simplified.",
    afterUpload: "The Word file is read in this tab and turned into a PDF. It is not uploaded to PDFFlow's servers for normal tool processing.",
    cta: "Convert Word to PDF",
    icon: "word",
    outputExt: "pdf",
    outputLabel: "PDF",
    accept: ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    multiple: false,
    minFiles: 1,
    chooseLabel: "Choose Word file",
    pickerHint: "DOCX files up to 25 MB. Processed locally in your browser — not uploaded to PDFFlow's servers for normal tool processing.",
    dropTitle: "Drop a Word file here or tap to choose",
    related: ["pdf-to-word", "image-to-pdf", "merge-pdf", "protect-pdf"],
    howTo: ["Choose a .docx file.", "Convert it.", "Download the PDF and open it to check the pages."],
    faqs: [
      {
        q: "Does this work with old .doc files?",
        a: "No. Save the document as .docx in Word or Pages first.",
      },
      {
        q: "Will the PDF look exactly like Word?",
        a: "No. Headings, paragraphs, lists, and embedded photos are kept. Columns, text boxes, and unusual fonts are simplified.",
      },
      {
        q: "Are files uploaded?",
        a: "No. Your file is processed locally in your browser and is not uploaded to PDFFlow's servers for normal tool processing.",
      },
    ],
  },
  {
    slug: "image-to-pdf",
    category: "convert",
    name: "Image to PDF",
    shortName: "Image → PDF",
    h1: "Image to PDF",
    title: "Image to PDF",
    description: "Turn JPG, PNG, WEBP, GIF, or HEIC photos into a PDF. One image or several, in the order you add them.",
    intro: "Add photos, arrange the order, and download one PDF. Images are not cropped.",
    afterUpload: "Images are placed on PDF pages in this browser. They are not uploaded to PDFFlow's servers for normal tool processing.",
    cta: "Create PDF",
    icon: "image",
    outputExt: "pdf",
    outputLabel: "PDF",
    accept: "image/jpeg,.jpg,.jpeg,image/png,.png,image/webp,.webp,image/gif,.gif,image/heic,image/heif,.heic,.heif",
    multiple: true,
    minFiles: 1,
    chooseLabel: "Add images",
    pickerHint: "JPG, PNG, WEBP, GIF, or HEIC. Up to 20 files. Processed in your browser.",
    dropTitle: "Drop photos here or tap to add",
    related: ["heic-to-jpg", "image-to-jpg", "pdf-to-jpg", "merge-pdf"],
    howTo: [
      "Add one or more photos.",
      "Use Up and Down to set the page order.",
      "Create the PDF.",
      "Download and check the pages.",
    ],
    faqs: [
      {
        q: "Can I make a PDF from iPhone photos?",
        a: "Yes. Add HEIC or JPG files from Photos or Files. On iPhone, use Safari.",
      },
      {
        q: "Will pictures be cropped?",
        a: "No. Each photo becomes a page, scaled to fit, without cropping.",
      },
      {
        q: "Are files uploaded?",
        a: "No. Your file is processed locally in your browser and is not uploaded to PDFFlow's servers for normal tool processing.",
      },
    ],
  },
  {
    slug: "image-to-jpg",
    category: "convert",
    name: "Image to JPG",
    shortName: "JPG",
    h1: "Image to JPG",
    title: "Image to JPG",
    description: "Convert PNG, WEBP, GIF, or HEIC images to JPG in your browser.",
    intro: "Use this when you need a JPG for email, WhatsApp, or a website that will not take HEIC or PNG.",
    afterUpload: "Images are converted in this tab. They are not uploaded to PDFFlow's servers for normal tool processing.",
    cta: "Convert to JPG",
    icon: "image",
    outputExt: "jpg",
    outputLabel: "JPG image",
    accept: "image/jpeg,.jpg,.jpeg,image/png,.png,image/webp,.webp,image/gif,.gif,image/heic,image/heif,.heic,.heif",
    multiple: true,
    minFiles: 1,
    chooseLabel: "Add images",
    pickerHint: "PNG, WEBP, GIF, HEIC, or JPG. Up to 20 files. Processed in your browser.",
    dropTitle: "Drop images here or tap to add",
    related: ["heic-to-jpg", "image-to-pdf", "pdf-to-jpg"],
    howTo: ["Add images.", "Convert them.", "Download a JPG, or a ZIP if you added more than one."],
    faqs: [
      {
        q: "Does this include HEIC?",
        a: "Yes. Camera photos from iPhone are often HEIC. There is also a dedicated HEIC to JPG tool.",
      },
      {
        q: "Are files uploaded?",
        a: "No. Your file is processed locally in your browser and is not uploaded to PDFFlow's servers for normal tool processing.",
      },
    ],
  },
  {
    slug: "heic-to-jpg",
    category: "convert",
    name: "HEIC to JPG",
    shortName: "HEIC",
    h1: "HEIC to JPG",
    title: "HEIC to JPG",
    description: "Convert iPhone HEIC photos to JPG in your browser so other apps can open them.",
    intro: "Choose a HEIC photo from Files or Photos and download a JPG.",
    afterUpload: "The photo is converted in this browser. It is not uploaded to PDFFlow's servers for normal tool processing.",
    cta: "Convert HEIC to JPG",
    icon: "image",
    outputExt: "jpg",
    outputLabel: "JPG image",
    accept: "image/heic,image/heif,.heic,.heif,image/jpeg,.jpg,.jpeg",
    multiple: true,
    minFiles: 1,
    chooseLabel: "Add HEIC photos",
    pickerHint: "HEIC or HEIF camera photos. Processed in your browser.",
    dropTitle: "Drop a HEIC photo here or tap to add",
    related: ["image-to-jpg", "image-to-pdf", "pdf-to-jpg"],
    howTo: ["Add a HEIC photo.", "Convert it.", "Download the JPG."],
    faqs: [
      {
        q: "Why do I need this?",
        a: "Many websites and Windows apps cannot open HEIC. JPG opens almost everywhere.",
      },
      {
        q: "Are files uploaded?",
        a: "No. Your file is processed locally in your browser and is not uploaded to PDFFlow's servers for normal tool processing. Safari on iPhone can often read HEIC directly.",
      },
    ],
  },
  {
    slug: "extract-images",
    category: "convert",
    name: "Extract images from PDF",
    shortName: "Extract",
    h1: "Extract images from PDF",
    title: "Extract images from PDF",
    description: "Pull photos stored inside a PDF and download them as PNG files.",
    intro: "This finds embedded images. If the PDF is a scan of whole pages, use PDF to JPG instead.",
    afterUpload: "The PDF is read in this tab. Embedded images are exported. The file is not uploaded to PDFFlow's servers for normal tool processing.",
    cta: "Extract images",
    icon: "image",
    outputExt: "png",
    outputLabel: "PNG images",
    accept: "application/pdf,.pdf",
    multiple: false,
    chooseLabel: "Choose PDF",
    related: ["pdf-to-jpg", "pdf-to-png", "image-to-pdf", "split-pdf"],
    howTo: ["Choose a PDF.", "Extract images.", "Download a PNG or a ZIP."],
    faqs: [
      {
        q: "Why did it say no images were found?",
        a: "Scanned pages are usually one picture of the whole sheet, stored as page content rather than separate photos. Use PDF to JPG for those.",
      },
      {
        q: "Are files uploaded?",
        a: "No. Your file is processed locally in your browser and is not uploaded to PDFFlow's servers for normal tool processing.",
      },
    ],
  },
  {
    slug: "pdf-to-excel",
    category: "convert",
    name: "PDF to Excel",
    shortName: "Excel",
    h1: "PDF to Excel",
    title: "PDF to Excel",
    description:
      "Extract tables from a PDF into an Excel (.xlsx) file. If the PDF has no table, you will see a message instead of an empty spreadsheet.",
    intro:
      "Looks for rows and columns in the PDF and builds an Excel workbook. If no table is found, the tool says so.",
    audience: "Anyone extracting invoices, lists, or tables from a PDF, including on iPhone.",
    afterUpload: "Text positions are analyzed. If no table is found, OCR runs on scanned pages.",
    cta: "Convert PDF to Excel",
    icon: "excel",
    outputExt: "xlsx",
    outputLabel: "Excel workbook",
    accept: "application/pdf,.pdf",
    multiple: false,
    related: ["pdf-to-word", "pdf-to-jpg", "split-pdf", "compress-pdf"],
    howToTitle: "How to use this tool",
    howTo: [
      "Upload a PDF that contains a table or aligned columns.",
      "Tap Convert to Excel.",
      "If a table is detected, download the .xlsx file.",
      "Open it in Excel, Numbers, or Google Sheets.",
    ],
    faqs: [
      {
        q: "What if there is no table?",
        a: "You will get a message that no table was found.",
      },
      {
        q: "Do scanned tables work?",
        a: "OCR runs when the PDF has little embedded text. Columns from a photo are often imperfect. Check the spreadsheet before you rely on it.",
      },
    ],
  },
  {
    slug: "pdf-to-ppt",
    category: "convert",
    name: "PDF to PowerPoint",
    shortName: "PowerPoint",
    h1: "PDF to PowerPoint",
    title: "PDF to PowerPoint",
    description:
      "Convert PDF pages into a PowerPoint file. Each page becomes a slide image, so you get a .pptx with the original page layout.",
    intro:
      "Each PDF page is placed on a PowerPoint slide as an image. The slide text is not separately editable.",
    audience: "People who need a PowerPoint version of a PDF for presenting or sharing, including from an iPhone.",
    afterUpload: "Pages are rendered and placed onto slides. You download a .pptx file.",
    cta: "Convert PDF to PowerPoint",
    icon: "ppt",
    outputExt: "pptx",
    outputLabel: "PowerPoint file",
    accept: "application/pdf,.pdf",
    multiple: false,
    related: ["pdf-to-jpg", "pdf-to-word", "rotate-pdf", "compress-pdf"],
    howToTitle: "How to use this tool",
    howTo: [
      "Choose your PDF.",
      "Tap Convert to PowerPoint.",
      "Wait while each page is placed on a slide.",
      "Download the .pptx file.",
    ],
    faqs: [
      {
        q: "Can I edit the text in PowerPoint?",
        a: "Not as separate text boxes. Each page is an image on a slide, so the layout stays the same.",
      },
      {
        q: "Can I open the file in PowerPoint?",
        a: "Yes. The download is a .pptx file. You can open it in PowerPoint, Keynote, or Google Slides.",
      },
    ],
  },
  {
    slug: "pdf-to-ebook",
    category: "convert",
    name: "PDF to eBook",
    shortName: "eBook",
    h1: "PDF to eBook",
    title: "PDF to eBook",
    description: "Convert a PDF into an EPUB file in your browser. Scanned pages use OCR.",
    intro:
      "Text is taken from the PDF and packed as an EPUB you can open in Books or another reader. Scanned pages use OCR in your browser.",
    audience: "Readers who want a reflowable eBook from a text PDF.",
    afterUpload: "Text is extracted by page and written into an EPUB 3 file.",
    cta: "Convert PDF to eBook",
    icon: "ebook",
    outputExt: "epub",
    outputLabel: "EPUB eBook",
    accept: "application/pdf,.pdf",
    multiple: false,
    related: ["pdf-to-word", "pdf-to-jpg", "compress-pdf", "split-pdf"],
    howToTitle: "How to use this tool",
    howTo: [
      "Upload a PDF.",
      "Tap Convert to eBook.",
      "Download the .epub file.",
      "Open it in Apple Books or another EPUB reader.",
    ],
    faqs: [
      {
        q: "Will a scanned PDF become an eBook?",
        a: "Yes if OCR can read the page images. That is slower, and the EPUB will be the recognized text, not a picture of each page.",
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
    title: "Merge PDF",
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
    howToTitle: "How to use this tool",
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
    title: "Split PDF",
    description:
      "Split a PDF by extracting pages, saving every page separately, or using ranges like 1-3, 5, 8-10. Multiple outputs download as a ZIP.",
    intro: "Extract selected pages, split every page, or split by ranges.",
    audience: "People who need part of a PDF, or one file per page.",
    afterUpload: "New PDFs are created from the pages you choose. One file downloads as a PDF. Several files download as a ZIP.",
    cta: "Split PDF",
    icon: "split",
    outputExt: "pdf",
    outputLabel: "Split PDF",
    accept: "application/pdf,.pdf",
    multiple: false,
    related: ["merge-pdf", "rotate-pdf", "compress-pdf", "pdf-to-jpg"],
    howToTitle: "How to use this tool",
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
    title: "Compress PDF",
    description:
      "Reduce PDF size with low, recommended, or strong compression. See original size, new size, and the percentage change.",
    intro:
      "Choose a compression level and get a new PDF. If the file does not get smaller, the sizes are shown anyway.",
    audience: "Anyone who needs a smaller PDF for email, uploads, or iPhone storage.",
    afterUpload: "A compressed PDF is created on your device. File sizes are compared before you download.",
    cta: "Compress PDF",
    icon: "compress",
    outputExt: "pdf",
    outputLabel: "Compressed PDF",
    accept: "application/pdf,.pdf",
    multiple: false,
    related: ["pdf-to-jpg", "merge-pdf", "split-pdf", "rotate-pdf"],
    howToTitle: "How to use this tool",
    howTo: [
      "Choose your PDF.",
      "Choose low, recommended, or strong compression.",
      "Tap Compress PDF.",
      "Check the new size, then download if you want the result.",
    ],
    faqs: [
      {
        q: "Will the file always get smaller?",
        a: "No. Some PDFs are already small. If compression makes the file larger, you will see the new size.",
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
    title: "Rotate PDF",
    description: "Rotate all pages or selected pages in a PDF, then download the rotated file.",
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
    howToTitle: "How to use this tool",
    howTo: [
      "Choose your PDF.",
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
    title: "Sign PDF",
    description:
      "Sign a PDF in your browser. Draw, type, or upload a signature, place it on a page, then download the file.",
    intro: "Create a signature, move it onto the page, and download a PDF with that image on the page.",
    audience: "Anyone who needs to sign a form from an iPhone or desktop without installing an app.",
    afterUpload: "You place the signature on a page preview. The downloaded PDF includes the signature image on that page.",
    cta: "Sign PDF",
    icon: "sign",
    outputExt: "pdf",
    outputLabel: "Signed PDF",
    accept: "application/pdf,.pdf",
    multiple: false,
    related: ["protect-pdf", "pdf-to-word", "rotate-pdf", "merge-pdf"],
    howToTitle: "How to use this tool",
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
    title: "Protect PDF",
    description:
      "Encrypt a PDF with a password in your browser. Enter and confirm the password, then download a protected PDF.",
    intro:
      "Set a password to encrypt the PDF. You will need that password to open the file later.",
    audience: "Anyone sending a sensitive PDF from iPhone or desktop.",
    afterUpload: "The PDF is encrypted in this browser. The password is not uploaded to PDFFlow's servers or written to logs.",
    cta: "Protect PDF",
    icon: "protect",
    outputExt: "pdf",
    outputLabel: "Protected PDF",
    accept: "application/pdf,.pdf",
    multiple: false,
    related: ["unlock-pdf", "sign-pdf", "compress-pdf", "merge-pdf"],
    howToTitle: "How to use this tool",
    howTo: [
      "Choose your PDF.",
      "Enter a password and confirm it.",
      "Tap Protect PDF.",
      "Download the encrypted file and store the password somewhere safe.",
    ],
    faqs: [
      {
        q: "Can you recover my password later?",
        a: "No. The password is not uploaded to PDFFlow's servers, and we cannot reset it.",
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
    title: "Unlock PDF",
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
    howToTitle: "How to use this tool",
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

const DEFINITIONS = {
  "pdf-to-word":
    "PDF to Word is a converter that turns a PDF into a Word (.docx) file you can edit.",
  "pdf-to-png": "PDF to PNG is a converter that turns each PDF page into a PNG image.",
  "word-to-pdf": "Word to PDF is a converter that turns a Word (.docx) file into a PDF.",
  "image-to-pdf": "Image to PDF is a converter that places photos into a PDF, in the order you add them.",
  "image-to-jpg": "Image to JPG is a converter that turns PNG, WEBP, GIF, or HEIC files into JPG images.",
  "heic-to-jpg": "HEIC to JPG is a converter that turns iPhone HEIC photos into JPG files.",
  "extract-images": "Extract images from PDF is a tool that saves photos stored inside a PDF.",
  "pdf-to-excel":
    "PDF to Excel is a converter that extracts tables from a PDF into an Excel (.xlsx) file.",
  "pdf-to-ppt":
    "PDF to PowerPoint is a converter that places each PDF page onto a PowerPoint slide as an image.",
  "pdf-to-ebook": "PDF to eBook is a converter that packs text from a PDF into an EPUB file.",
  "merge-pdf": "Merge PDF is a tool that combines two or more PDF files into one PDF.",
  "split-pdf": "Split PDF is a tool that extracts pages from a PDF or saves them as smaller PDF files.",
  "compress-pdf": "Compress PDF is a tool that tries to reduce a PDF’s file size.",
  "rotate-pdf": "Rotate PDF is a tool that turns PDF pages 90°, 180°, or 270°.",
  "sign-pdf": "Sign PDF is a tool that places a drawn, typed, or uploaded signature on a PDF page.",
  "protect-pdf": "Protect PDF is a tool that encrypts a PDF with a password you choose.",
  "unlock-pdf": "Unlock PDF is a tool that removes a PDF password you already know.",
};

function withDefinition(tool) {
  if (!tool) return null;
  return { ...tool, definition: DEFINITIONS[tool.slug] || tool.description };
}

export function getTools() {
  return tools.map(withDefinition);
}

export function getTool(slug) {
  return withDefinition(tools.find((tool) => tool.slug === slug) || null);
}

export function getToolsByCategory(categoryId) {
  return getTools().filter((tool) => tool.category === categoryId);
}

export function getRelatedTools(slug) {
  const tool = getTool(slug);
  if (!tool) return [];
  return tool.related.map(getTool).filter(Boolean);
}

export default tools;
