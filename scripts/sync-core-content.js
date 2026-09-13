const { PrismaClient } = require("@prisma/client");
const { howToBlocks, IPHONE_TOOL_INTROS, RELATED_TOOL_SLUGS } = require("../prisma/content/iphone-pdf-to-word-guide");
const SITE_AUTHOR = require("../prisma/content/site-author.json");

const prisma = new PrismaClient();

async function ensureSiteAuthor() {
  const existing =
    (await prisma.author.findUnique({ where: { slug: SITE_AUTHOR.slug } })) ||
    (await prisma.author.findUnique({ where: { slug: "editorial" } })) ||
    (await prisma.author.findFirst({ where: { name: "PDFFlow" } }));
  const author = existing
    ? await prisma.author.update({ where: { id: existing.id }, data: SITE_AUTHOR })
    : await prisma.author.create({ data: SITE_AUTHOR });
  if (existing && existing.slug && existing.slug !== SITE_AUTHOR.slug) {
    await prisma.redirect.upsert({
      where: { fromPath: `/authors/${existing.slug}` },
      update: { toPath: `/authors/${SITE_AUTHOR.slug}`, statusCode: 301 },
      create: { fromPath: `/authors/${existing.slug}`, toPath: `/authors/${SITE_AUTHOR.slug}`, statusCode: 301 },
    });
  }
  await prisma.guide.updateMany({ where: { authorId: null, deletedAt: null }, data: { authorId: author.id } });
  return author;
}

async function main() {
  const iphone = await prisma.device.findUnique({ where: { slug: "iphone" } });
  if (!iphone) {
    throw new Error("No iPhone device in the CMS. Run npm run db:seed first.");
  }

  await ensureSiteAuthor();

  await prisma.category.updateMany({
    where: { slug: "how-to" },
    data: { description: "Step-by-step instructions for PDF tasks." },
  });

  await prisma.device.update({
    where: { slug: "iphone" },
    data: {
      description: "Convert and manage PDFs in Safari. No App Store install.",
      intro:
        "These tools run in Safari on iPhone and iPad. Choose a PDF from Files or iCloud Drive, process it on the device, and download the result.",
      seoTitle: "PDF tools for iPhone and iPad",
      seoDescription: "Convert PDF to Word and manage PDFs in Safari on iPhone and iPad. Files stay on your device.",
    },
  });

  await prisma.category.upsert({
    where: { slug: "explainers" },
    update: { name: "Explainers", description: "How PDF conversion and related tasks work." },
    create: {
      name: "Explainers",
      slug: "explainers",
      description: "How PDF conversion and related tasks work.",
      sortOrder: 3,
    },
  });
  await prisma.category.upsert({
    where: { slug: "comparisons" },
    update: { name: "Comparisons", description: "Side-by-side notes when two options differ." },
    create: {
      name: "Comparisons",
      slug: "comparisons",
      description: "Side-by-side notes when two options differ.",
      sortOrder: 4,
    },
  });

  for (const [slug, copy] of Object.entries(IPHONE_TOOL_INTROS)) {
    const tool = await prisma.tool.findUnique({ where: { slug } });
    if (!tool) continue;
    await prisma.toolDevice.upsert({
      where: { toolId_deviceId: { toolId: tool.id, deviceId: iphone.id } },
      update: {
        featured: Boolean(copy.featured),
        headline: copy.headline,
        intro: copy.intro,
        sortOrder: copy.sortOrder,
      },
      create: {
        toolId: tool.id,
        deviceId: iphone.id,
        featured: Boolean(copy.featured),
        headline: copy.headline,
        intro: copy.intro,
        sortOrder: copy.sortOrder,
      },
    });
  }

  const howTo = await prisma.category.findUnique({ where: { slug: "how-to" } });
  const guide = await prisma.guide.findUnique({ where: { slug: "convert-pdf-to-word-on-iphone" } });
  if (guide) {
    const searchText = `how to convert pdf to word on iphone ${JSON.stringify(howToBlocks)}`.toLowerCase();
    await prisma.guide.update({
      where: { id: guide.id },
      data: {
        title: "How to Convert PDF to Word on iPhone",
        excerpt:
          "Convert a PDF to Word on iPhone in Safari. Save the file to Files first if it is in Mail or WhatsApp.",
        blocksJson: JSON.stringify(howToBlocks),
        searchText,
        featured: true,
        status: "published",
        seoTitle: "How to Convert PDF to Word on iPhone",
        seoDescription:
          "Convert a PDF to Word on iPhone in Safari. Text PDFs convert from embedded text. Scanned pages run OCR in your browser.",
        categoryId: howTo?.id || guide.categoryId,
        deviceId: iphone.id,
      },
    });
    await prisma.guideTool.deleteMany({ where: { guideId: guide.id } });
    for (const slug of RELATED_TOOL_SLUGS) {
      const tool = await prisma.tool.findUnique({ where: { slug } });
      if (tool) await prisma.guideTool.create({ data: { guideId: guide.id, toolId: tool.id } });
    }
  }

  console.log("Updated the iPhone PDF to Word cluster without resetting the database.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
