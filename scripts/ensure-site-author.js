const { PrismaClient } = require("@prisma/client");
const SITE_AUTHOR = require("../prisma/content/site-author.json");

const prisma = new PrismaClient();
const LEGACY_SLUGS = ["editorial"];
const LEGACY_NAMES = ["PDFFlow"];

async function main() {
  const wanted = {
    name: SITE_AUTHOR.name,
    slug: SITE_AUTHOR.slug,
    role: SITE_AUTHOR.role,
    bio: SITE_AUTHOR.bio,
    website: SITE_AUTHOR.website || "",
  };
  const existing =
    (await prisma.author.findUnique({ where: { slug: wanted.slug } })) ||
    (await prisma.author.findFirst({ where: { slug: { in: LEGACY_SLUGS } } })) ||
    (await prisma.author.findFirst({ where: { name: { in: LEGACY_NAMES } } }));
  const author = existing
    ? await prisma.author.update({ where: { id: existing.id }, data: wanted })
    : await prisma.author.create({ data: wanted });
  if (existing && existing.slug && existing.slug !== wanted.slug) {
    await prisma.redirect.upsert({
      where: { fromPath: `/authors/${existing.slug}` },
      update: { toPath: `/authors/${wanted.slug}`, statusCode: 301 },
      create: { fromPath: `/authors/${existing.slug}`, toPath: `/authors/${wanted.slug}`, statusCode: 301 },
    });
  }
  const assigned = await prisma.guide.updateMany({
    where: { authorId: null, deletedAt: null },
    data: { authorId: author.id },
  });
  console.log(`Site author is ${author.name} (${author.slug}). Assigned ${assigned.count} guides without an author.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
