const { PrismaClient } = require("@prisma/client");
const { howToBlocks, IPHONE_TOOL_INTROS, RELATED_TOOL_SLUGS } = require("./content/iphone-pdf-to-word-guide");

const prisma = new PrismaClient();

async function main() {
  await prisma.guideRelation.deleteMany();
  await prisma.guideTool.deleteMany();
  await prisma.guideTag.deleteMany();
  await prisma.guideRevision.deleteMany();
  await prisma.toolDevice.deleteMany();
  await prisma.guide.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tool.deleteMany();
  await prisma.device.deleteMany();
  await prisma.author.deleteMany();
  await prisma.user.deleteMany();
  await prisma.redirect.deleteMany();

  await prisma.user.create({
    data: { email: "admin@local", name: "Admin", role: "ADMIN" },
  });

  const author = await prisma.author.create({
    data: require("./content/site-author.json"),
  });

  const iphone = await prisma.device.create({
    data: {
      name: "iPhone / iPad",
      slug: "iphone",
      description: "Convert and manage PDFs in Safari. No App Store install.",
      intro:
        "These tools run in Safari on iPhone and iPad. Choose a PDF from Files or iCloud Drive, process it on the device, and download the result.",
      icon: "iphone",
      status: "published",
      sortOrder: 1,
      seoTitle: "PDF tools for iPhone and iPad",
      seoDescription: "Convert PDF to Word and manage PDFs in Safari on iPhone and iPad. Files stay on your device.",
    },
  });

  await prisma.device.createMany({
    data: [
      {
        name: "Android",
        slug: "android",
        description: "Browser PDF tools for Android.",
        intro: "The same converters run in Chrome on Android.",
        status: "draft",
        sortOrder: 2,
        seoTitle: "PDF tools for Android",
        seoDescription: "Browser PDF tools for Android.",
      },
      {
        name: "Windows",
        slug: "windows",
        description: "Browser PDF tools for Windows.",
        intro: "Use these tools in Chrome, Edge, or Firefox on a Windows PC.",
        status: "draft",
        sortOrder: 3,
        seoTitle: "PDF tools for Windows",
        seoDescription: "Browser PDF tools for Windows.",
      },
      {
        name: "Mac",
        slug: "mac",
        description: "Browser PDF tools for Mac.",
        intro: "Use these tools in Safari or Chrome on a Mac.",
        status: "draft",
        sortOrder: 4,
        seoTitle: "PDF tools for Mac",
        seoDescription: "Browser PDF tools for Mac.",
      },
    ],
  });

  const catalog = [
    { slug: "pdf-to-word", name: "PDF to Word", category: "convert", outputExt: "docx", cta: "Convert PDF to Word", title: "PDF to Word", description: "Convert a PDF into a Word file in your browser.", intro: "Upload a PDF and download a Word (.docx) file. Text PDFs use the text in the file. Scanned pages use OCR in your browser." },
    { slug: "pdf-to-jpg", name: "PDF to JPG", category: "convert", outputExt: "jpg", cta: "Convert PDF to JPG", title: "PDF to JPG", description: "Turn PDF pages into JPG images.", intro: "Each PDF page is turned into a JPG." },
    { slug: "pdf-to-png", name: "PDF to PNG", category: "convert", outputExt: "png", cta: "Convert PDF to PNG", title: "PDF to PNG", description: "Turn PDF pages into PNG images.", intro: "Each PDF page is drawn as a PNG." },
    { slug: "word-to-pdf", name: "Word to PDF", category: "convert", outputExt: "pdf", cta: "Convert Word to PDF", title: "Word to PDF", description: "Convert a Word file into a PDF.", intro: "Choose a .docx file and download a PDF." },
    { slug: "image-to-pdf", name: "Image to PDF", category: "convert", outputExt: "pdf", cta: "Create PDF", title: "Image to PDF", description: "Turn photos into a PDF.", intro: "Add photos and download one PDF." },
    { slug: "image-to-jpg", name: "Image to JPG", category: "convert", outputExt: "jpg", cta: "Convert to JPG", title: "Image to JPG", description: "Convert images to JPG.", intro: "Convert PNG, WEBP, GIF, or HEIC to JPG." },
    { slug: "heic-to-jpg", name: "HEIC to JPG", category: "convert", outputExt: "jpg", cta: "Convert HEIC to JPG", title: "HEIC to JPG", description: "Convert iPhone HEIC photos to JPG.", intro: "Choose a HEIC photo and download a JPG." },
    { slug: "extract-images", name: "Extract images from PDF", category: "convert", outputExt: "png", cta: "Extract images", title: "Extract images from PDF", description: "Pull photos stored inside a PDF.", intro: "This finds embedded images." },
    { slug: "pdf-to-excel", name: "PDF to Excel", category: "convert", outputExt: "xlsx", cta: "Convert PDF to Excel", title: "PDF to Excel Converter", description: "Extract tables from a PDF into an Excel file.", intro: "Tables are detected when the PDF contains them. If none are found, the tool says so." },
    { slug: "pdf-to-ppt", name: "PDF to PowerPoint", category: "convert", outputExt: "pptx", cta: "Convert PDF to PowerPoint", title: "PDF to PowerPoint Converter", description: "Turn PDF pages into a PowerPoint file.", intro: "Each page becomes a slide image." },
    { slug: "pdf-to-ebook", name: "PDF to EPUB", category: "convert", outputExt: "epub", cta: "Convert PDF to EPUB", title: "PDF to EPUB Converter", description: "Turn a PDF into an EPUB file.", intro: "Text is packed into a simple EPUB." },
    { slug: "merge-pdf", name: "Merge PDF", category: "organize", outputExt: "pdf", cta: "Merge PDFs", title: "Merge PDF", description: "Combine PDF files into one.", intro: "Files are merged in the order you add them." },
    { slug: "split-pdf", name: "Split PDF", category: "organize", outputExt: "pdf", cta: "Split PDF", title: "Split PDF", description: "Extract pages from a PDF.", intro: "Choose a page range or split each page." },
    { slug: "compress-pdf", name: "Compress PDF", category: "organize", outputExt: "pdf", cta: "Compress PDF", title: "Compress PDF", description: "Reduce PDF file size when the file can actually get smaller.", intro: "If the result is larger, the tool says so." },
    { slug: "rotate-pdf", name: "Rotate PDF", category: "organize", outputExt: "pdf", cta: "Rotate PDF", title: "Rotate PDF", description: "Rotate PDF pages.", intro: "Choose an angle and download the rotated file." },
    { slug: "sign-pdf", name: "Sign PDF", category: "edit", outputExt: "pdf", cta: "Sign PDF", title: "Sign PDF", description: "Add a signature that is embedded in the PDF.", intro: "Draw, type, or upload a signature image." },
    { slug: "protect-pdf", name: "Protect PDF", category: "security", outputExt: "pdf", cta: "Protect PDF", title: "Protect PDF", description: "Password-protect a PDF.", intro: "Set a password you will remember." },
    { slug: "unlock-pdf", name: "Unlock PDF", category: "security", outputExt: "pdf", cta: "Unlock PDF", title: "Unlock PDF", description: "Remove a password you already know.", intro: "This does not bypass encryption." },
  ];
  const createdTools = [];
  for (const [index, item] of catalog.entries()) {
    const tool = await prisma.tool.create({
      data: {
        name: item.name,
        slug: item.slug,
        processorKey: item.slug,
        description: item.description,
        intro: item.intro,
        category: item.category,
        outputFormat: item.outputExt || "",
        status: "live",
        cta: item.cta,
        seoTitle: item.title,
        seoDescription: item.description,
        sortOrder: index + 1,
      },
    });
    createdTools.push(tool);
    const deviceCopy = IPHONE_TOOL_INTROS[item.slug];
    await prisma.toolDevice.create({
      data: {
        toolId: tool.id,
        deviceId: iphone.id,
        featured: Boolean(deviceCopy?.featured),
        headline: deviceCopy?.headline || item.name,
        intro: deviceCopy?.intro || item.intro,
        sortOrder: deviceCopy?.sortOrder || index + 1,
      },
    });
  }

  const howTo = await prisma.category.create({
    data: {
      name: "How-to",
      slug: "how-to",
      description: "Step-by-step instructions for PDF tasks.",
      sortOrder: 1,
    },
  });
  await prisma.category.createMany({
    data: [
      { name: "Troubleshooting", slug: "troubleshooting", description: "Fix common PDF problems.", sortOrder: 2 },
      { name: "Explainers", slug: "explainers", description: "How PDF conversion and related tasks work.", sortOrder: 3 },
      { name: "Comparisons", slug: "comparisons", description: "Side-by-side notes when two options differ.", sortOrder: 4 },
      { name: "Privacy & security", slug: "privacy-security", description: "How files are handled in the browser.", sortOrder: 5 },
    ],
  });

  const searchText = `how to convert pdf to word on iphone ${JSON.stringify(howToBlocks)}`.toLowerCase();

  const guide = await prisma.guide.create({
    data: {
      title: "How to Convert PDF to Word on iPhone",
      slug: "convert-pdf-to-word-on-iphone",
        excerpt:
          "Convert a PDF to Word on iPhone in Safari. Save the file to Files first if it is in Mail or WhatsApp.",
      template: "HOW_TO",
      blocksJson: JSON.stringify(howToBlocks),
      searchText,
      status: "published",
      featured: true,
      publishedAt: new Date("2026-08-17T12:00:00.000Z"),
      readingTime: 4,
      seoTitle: "How to Convert PDF to Word on iPhone",
      seoDescription:
        "Convert a PDF to Word on iPhone in Safari. Text PDFs convert from embedded text. Scanned pages run OCR in your browser.",
      authorId: author.id,
      categoryId: howTo.id,
      deviceId: iphone.id,
    },
  });

  for (const slug of RELATED_TOOL_SLUGS) {
    const tool = createdTools.find((item) => item.slug === slug);
    if (tool) await prisma.guideTool.create({ data: { guideId: guide.id, toolId: tool.id } });
  }

  await prisma.redirect.createMany({
    data: [
      { fromPath: "/blog/how-to-convert-pdf-to-word-on-iphone", toPath: "/guides/how-to/convert-pdf-to-word-on-iphone" },
      { fromPath: "/free-pdf-to-word-iphone-ios", toPath: "/iphone/pdf-to-word" },
      { fromPath: "/pdf-to-word", toPath: "/iphone/pdf-to-word" },
    ],
  });

  console.log("Seeded devices, tools, and the iPhone PDF to Word guide");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
