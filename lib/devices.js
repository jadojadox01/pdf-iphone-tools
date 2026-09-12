import { IPHONE_TOOL_PAGES } from "@/lib/paths";

export const DEVICE_HUBS = [
  {
    slug: "iphone",
    name: "iPhone / iPad",
    status: "live",
    blurb: "Safari, Files, and iCloud Drive.",
  },
  {
    slug: "android",
    name: "Android",
    status: "soon",
    blurb: "Use the tools in Chrome.",
  },
  {
    slug: "windows",
    name: "Windows",
    status: "soon",
    blurb: "Use the tools in Edge, Chrome, or Firefox.",
  },
  {
    slug: "mac",
    name: "Mac",
    status: "soon",
    blurb: "Use the tools in Safari or Chrome.",
  },
];

export const DEVICE_CHOICES = [
  { slug: "iphone", label: "iPhone", icon: "iphone" },
  { slug: "mac", label: "Mac", icon: "mac" },
  { slug: "android", label: "Android", icon: "android" },
  { slug: "windows", label: "Windows", icon: "windows" },
];

export function deviceChoiceHref(slug, publishedSlugs = new Set()) {
  const hub = DEVICE_HUBS.find((device) => device.slug === slug);
  if (hub?.status === "live" && publishedSlugs.has(slug)) return `/${slug}`;
  return "/tools";
}

export const IPHONE_TOOL_COPY = {
  "pdf-to-word": {
    headline: "PDF to Word on iPhone",
    intro:
      "Convert a PDF into an editable Word file in Safari. Pick the file from Files or iCloud Drive. Text PDFs convert from embedded text. Photographed pages run OCR on your iPhone.",
    howTo: [
      "Open this page in Safari. In-app browsers (Mail, WhatsApp, Instagram) sometimes block downloads.",
      "Tap Choose PDF and pick the file from Files, iCloud Drive, or Downloads.",
      "Tap Convert. Keep Safari in the foreground. A scanned PDF is slower because OCR runs on the iPhone.",
      "Download the .docx and open it in Pages, Word, or Files. Check the text before you delete the original PDF.",
    ],
  },
  "pdf-to-jpg": {
    headline: "PDF to JPG on iPhone",
    intro:
      "Turn each PDF page into a JPG you can send in Messages, WhatsApp, or save to Photos. The conversion runs in Safari. Pages are rendered as images, not as editable text.",
    howTo: [
      "Open this page in Safari and choose the PDF from Files or iCloud Drive.",
      "Convert the file. Each page becomes a JPG.",
      "Download the images. On iPhone they usually land in Downloads inside the Files app.",
      "Share a page as a photo, or save it to Photos from Files if you need it in the camera roll.",
    ],
  },
  "merge-pdf": {
    headline: "Merge PDFs on iPhone",
    intro:
      "Combine several PDFs into one file in Safari. Add files in the order you want them to appear. This is useful when you scanned pages separately or downloaded a form in pieces.",
    howTo: [
      "Save every PDF to Files or iCloud Drive first so Safari can see them.",
      "Open this page and add the files in order. On iPhone, add them one at a time if the picker is easier that way.",
      "Merge in Safari. The new PDF is not uploaded to PDFFlow's servers for normal tool processing.",
      "Download the combined file and open it in Files to confirm the page order.",
    ],
  },
  "split-pdf": {
    headline: "Split a PDF on iPhone",
    intro:
      "Pull out the pages you actually need so you can mail one page, sign a single sheet, or send a smaller file. Choose a page range or split every page.",
    howTo: [
      "Open this page in Safari and pick the PDF from Files.",
      "Choose a page range, or split each page into its own file.",
      "Run the split on your iPhone.",
      "Download the result and check that you have the pages you meant to keep.",
    ],
  },
  "compress-pdf": {
    headline: "Compress a PDF on iPhone",
    intro:
      "Reduce a PDF so it will send through Mail or WhatsApp. Compression runs on your iPhone. If the file cannot get smaller, the sizes are shown.",
    howTo: [
      "Open this page in Safari and choose the PDF from Files or iCloud Drive.",
      "Compress the file on the device.",
      "Read the result. If the file did not get smaller, keep the original.",
      "Download the smaller PDF only when the size actually dropped.",
    ],
  },
};

export function getIphoneToolCopy(slug) {
  return IPHONE_TOOL_COPY[slug] || null;
}

export function isIphoneToolPage(slug) {
  return IPHONE_TOOL_PAGES.includes(slug);
}
