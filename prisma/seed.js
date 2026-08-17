const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function text(value, marks = []) {
  return { type: "text", text: value, ...(marks.length ? { marks } : {}) };
}

function p(...parts) {
  return { type: "paragraph", content: parts.flat() };
}

function h(level, value) {
  return {
    type: "heading",
    attrs: { level },
    content: [text(value)],
  };
}

function list(items, ordered = false) {
  return {
    type: ordered ? "orderedList" : "bulletList",
    content: items.map((item) => ({
      type: "listItem",
      content: [typeof item === "string" ? p(text(item)) : item],
    })),
  };
}

function link(label, href) {
  return text(label, [{ type: "link", attrs: { href } }]);
}

function bold(value) {
  return text(value, [{ type: "bold" }]);
}

function doc(content) {
  return { type: "doc", content };
}

function callout(variant, ...parts) {
  return { type: "callout", attrs: { variant }, content: [p(...parts)] };
}

function faq(question, ...parts) {
  return { type: "faqItem", attrs: { question }, content: [p(...parts)] };
}

function toolCta(toolSlug) {
  return { type: "toolCta", attrs: { toolSlug } };
}

const guides = [
  {
    title: "How to Convert PDF to Word on iPhone",
    slug: "how-to-convert-pdf-to-word-on-iphone",
    excerpt:
      "Turn a text PDF into an editable Word file in Safari, without installing another app.",
    category: "pdf-conversion",
    tags: ["iPhone", "PDF to Word", "Safari"],
    tools: ["pdf-to-word", "compress-pdf", "split-pdf"],
    featured: true,
    seoTitle: "How to Convert PDF to Word on iPhone",
    seoDescription:
      "Convert a PDF to Word on iPhone in Safari. Works with text-based PDFs. Scanned pages need OCR, which this tool does not run.",
    content: doc([
      h(2, "The problem"),
      p(text("You have a PDF on your iPhone and need a Word file you can edit. Installing another app is optional; a browser tool can do this if the PDF already contains text.")),
      h(2, "What you need"),
      list([
        "The PDF in Files, iCloud Drive, or another app that can share into Safari",
        "Safari or another mobile browser",
        "A text-based PDF. Photographed pages will not become editable text here",
      ]),
      h(2, "Step-by-step"),
      list(
        [
          p(text("Open the "), link("PDF to Word", "/pdf-to-word"), text(" tool in Safari.")),
          p(text("Tap "), bold("Choose PDF"), text(" and select the file.")),
          p(text("Tap "), bold("Convert PDF to Word"), text(" and wait until the file is ready.")),
          p(text("Tap "), bold("Download"), text(" and open the .docx file in Word or Pages.")),
        ],
        true,
      ),
      h(2, "Text PDFs vs scanned PDFs"),
      p(text("If the PDF was exported from Word, Pages, or a website, there is usually text to extract.")),
      p(text("If the PDF is a photo of a page, there is little or no text. This site does not run OCR, and it will say so instead of inventing a Word document.")),
      toolCta("pdf-to-word"),
      h(2, "If conversion fails"),
      list([
        "Confirm the file is a real PDF, not a renamed image",
        "Compress a very large file first",
        "Split a long document and convert one part at a time",
      ]),
      faq("Does this work in Safari on iPhone?", text("Yes. Choose the PDF from Files or iCloud Drive, convert it, then download the Word file.")),
      faq("Will a scanned PDF become editable?", text("No. Scanned pages need OCR, which this converter does not perform.")),
    ]),
  },
  {
    title: "How to Merge PDF Files on iPhone",
    slug: "how-to-merge-pdf-files-on-iphone",
    excerpt: "Combine several PDFs into one file from the Files app and a browser, then download the merged document.",
    category: "pdf-management",
    tags: ["iPhone", "Merge PDF"],
    tools: ["merge-pdf", "split-pdf", "compress-pdf"],
    featured: true,
    seoTitle: "How to Merge PDF Files on iPhone",
    seoDescription: "Merge PDFs on iPhone in Safari. Reorder files, remove extras, and download one combined PDF.",
    content: doc([
      h(2, "When merging helps"),
      p(text("Merging is useful when scans, forms, or downloads belong together as one file.")),
      h(2, "Step-by-step"),
      list(
        [
          p(text("Open "), link("Merge PDF", "/merge-pdf"), text(".")),
          p(text("Add two or more PDF files.")),
          p(text("Use Up and Down to set the order. Those buttons are easier than drag-and-drop on a phone.")),
          p(text("Remove any file you added by mistake, then tap Merge PDFs and download.")),
        ],
        true,
      ),
      callout("info", text("The merged file is created on your device. The originals stay in Files until you delete them.")),
      toolCta("merge-pdf"),
    ]),
  },
  {
    title: "How to Compress a PDF on iPhone",
    slug: "how-to-compress-a-pdf-on-iphone",
    excerpt: "Reduce PDF size for email or uploads, and check whether the new file is actually smaller.",
    category: "pdf-management",
    tags: ["iPhone", "Compress PDF"],
    tools: ["compress-pdf", "split-pdf", "pdf-to-jpg"],
    featured: false,
    seoTitle: "How to Compress a PDF on iPhone",
    seoDescription: "Compress a PDF on iPhone and compare the real original and new file sizes.",
    content: doc([
      h(2, "Why size matters"),
      p(text("A smaller PDF is easier to email and upload. Compression does not shrink every file, especially if it is already optimized.")),
      h(2, "Step-by-step"),
      list(
        [
          p(text("Open "), link("Compress PDF", "/compress-pdf"), text(".")),
          p(text("Choose Low, Recommended, or Strong.")),
          p(text("Compress, then read the size comparison before you keep the result.")),
        ],
        true,
      ),
      p(bold("Strong"), text(" compression rebuilds pages as images. Text may stop being selectable. Use Recommended first if you still need to copy text.")),
      toolCta("compress-pdf"),
    ]),
  },
  {
    title: "How to Sign a PDF on iPhone",
    slug: "how-to-sign-a-pdf-on-iphone",
    excerpt: "Draw, type, or upload a signature, place it on the page, and download a PDF that actually contains it.",
    category: "pdf-signing",
    tags: ["iPhone", "Sign PDF"],
    tools: ["sign-pdf", "protect-pdf"],
    featured: true,
    seoTitle: "How to Sign a PDF on iPhone",
    seoDescription: "Sign a PDF on iPhone in Safari. The signature is embedded in the downloaded file, not only shown on screen.",
    content: doc([
      h(2, "What this does"),
      p(text("You can sign a form in the browser. The downloaded PDF should contain the signature, not only an overlay on the screen.")),
      h(2, "Step-by-step"),
      list(
        [
          p(text("Open "), link("Sign PDF", "/sign-pdf"), text(" and choose the file.")),
          p(text("Draw with your finger, type a name, or upload a signature image.")),
          p(text("Pick the page, move the signature, then save and download.")),
        ],
        true,
      ),
      callout("warn", text("This is a visual signature on the page. It is not a certificate-based digital signature.")),
      toolCta("sign-pdf"),
    ]),
  },
  {
    title: "How to Convert PDF to JPG on iPhone",
    slug: "how-to-convert-pdf-to-jpg-on-iphone",
    excerpt: "Turn PDF pages into JPG images, including multi-page files packed into a ZIP.",
    category: "pdf-conversion",
    tags: ["iPhone", "PDF to JPG"],
    tools: ["pdf-to-jpg", "rotate-pdf"],
    featured: false,
    seoTitle: "How to Convert PDF to JPG on iPhone",
    seoDescription: "Convert PDF pages to JPG on iPhone. Choose all pages or a range, then download a JPG or a ZIP.",
    content: doc([
      h(2, "When images help"),
      p(text("Use this when you need a photo of a page, a slide, or a poster stored as an image.")),
      h(2, "Step-by-step"),
      list(
        [
          p(text("Open "), link("PDF to JPG", "/pdf-to-jpg"), text(".")),
          p(text("Choose all pages or enter a range such as 1-3, 5.")),
          p(text("Download the JPG, or a ZIP if more than one page was converted.")),
        ],
        true,
      ),
      p(text("If a page is sideways, "), link("rotate the PDF", "/rotate-pdf"), text(" first, then convert.")),
      toolCta("pdf-to-jpg"),
    ]),
  },
  {
    title: "How to Reduce PDF File Size on iPhone",
    slug: "how-to-reduce-pdf-file-size-on-iphone",
    excerpt: "Compress first, split if you only need some pages, and convert to images only when that is the right output.",
    category: "iphone-pdf",
    tags: ["iPhone", "Compress PDF", "Split PDF"],
    tools: ["compress-pdf", "split-pdf", "pdf-to-jpg"],
    featured: false,
    seoTitle: "How to Reduce PDF File Size on iPhone",
    seoDescription: "Practical ways to make a PDF smaller on iPhone: compress, split, or convert pages to images.",
    content: doc([
      h(2, "Start with the smallest change"),
      p(text("If a PDF is too big to email, try compression first. Split it if you only need some pages.")),
      h(2, "Compress the whole file"),
      p(text("Use "), link("Compress PDF", "/compress-pdf"), text(" and compare the sizes. If the result is not smaller, keep the original.")),
      h(2, "Split off the pages you need"),
      p(text("If you only need a few pages, "), link("Split PDF", "/split-pdf"), text(" with a range such as 1-2.")),
      h(2, "Convert a page to an image"),
      p(link("PDF to JPG", "/pdf-to-jpg"), text(" can create a smaller image for sharing a single page. That is not the same as keeping a PDF.")),
      p(text("There is no honest way to promise a specific percentage. The new size depends on the original file.")),
    ]),
  },
];

async function main() {
  await prisma.guideRelation.deleteMany();
  await prisma.guideTool.deleteMany();
  await prisma.guideTag.deleteMany();
  await prisma.guideRevision.deleteMany();
  await prisma.guide.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.author.deleteMany();

  const author = await prisma.author.create({
    data: {
      name: "PDF iPhone Tools",
      slug: "pdf-iphone-tools",
      role: "Editorial",
      bio: "Guides published by the team that builds these browser-based PDF tools. We write about how the tools on this site actually work.",
    },
  });

  const categories = await Promise.all(
    [
      ["pdf-conversion", "PDF Conversion", "Convert PDFs to Word, images, spreadsheets, and slides.", 1],
      ["pdf-management", "PDF Management", "Merge, split, compress, and rotate PDF files.", 2],
      ["pdf-signing", "PDF Signing", "Add a visual signature to a PDF in the browser.", 3],
      ["pdf-security", "PDF Security", "Password-protect a PDF, or remove a password you already know.", 4],
      ["iphone-pdf", "iPhone PDF Guides", "PDF workflows in Safari, Files, and iCloud Drive.", 5],
      ["productivity", "Productivity", "Document workflows and file management.", 6],
    ].map(([slug, name, description, sortOrder]) =>
      prisma.category.create({ data: { slug, name, description, sortOrder } }),
    ),
  );
  const categoryMap = Object.fromEntries(categories.map((item) => [item.slug, item]));

  const created = [];
  for (const item of guides) {
    const searchText = `${item.title} ${item.excerpt} ${JSON.stringify(item.content)}`.toLowerCase();
    const guide = await prisma.guide.create({
      data: {
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        contentJson: JSON.stringify(item.content),
        searchText,
        status: "published",
        featured: item.featured,
        publishedAt: new Date("2026-08-17T12:00:00.000Z"),
        readingTime: Math.max(2, Math.round(searchText.split(/\s+/).length / 220)),
        seoTitle: item.seoTitle,
        seoDescription: item.seoDescription,
        authorId: author.id,
        categoryId: categoryMap[item.category].id,
      },
    });
    created.push({ ...item, id: guide.id });
    for (const name of item.tags) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const tag = await prisma.tag.upsert({
        where: { slug },
        update: { name },
        create: { name, slug },
      });
      await prisma.guideTag.create({ data: { guideId: guide.id, tagId: tag.id } });
    }
    for (const toolSlug of item.tools) {
      await prisma.guideTool.create({ data: { guideId: guide.id, toolSlug } });
    }
  }

  const bySlug = Object.fromEntries(created.map((item) => [item.slug, item.id]));
  const relations = [
    ["how-to-convert-pdf-to-word-on-iphone", "how-to-compress-a-pdf-on-iphone"],
    ["how-to-convert-pdf-to-word-on-iphone", "how-to-merge-pdf-files-on-iphone"],
    ["how-to-merge-pdf-files-on-iphone", "how-to-compress-a-pdf-on-iphone"],
    ["how-to-compress-a-pdf-on-iphone", "how-to-reduce-pdf-file-size-on-iphone"],
    ["how-to-sign-a-pdf-on-iphone", "how-to-convert-pdf-to-word-on-iphone"],
    ["how-to-convert-pdf-to-jpg-on-iphone", "how-to-compress-a-pdf-on-iphone"],
    ["how-to-reduce-pdf-file-size-on-iphone", "how-to-compress-a-pdf-on-iphone"],
  ];
  for (const [from, to] of relations) {
    await prisma.guideRelation.create({ data: { fromId: bySlug[from], toId: bySlug[to] } });
  }

  console.log(`Seeded ${created.length} guides`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
