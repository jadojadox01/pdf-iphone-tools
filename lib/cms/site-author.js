import siteAuthor from "../../prisma/content/site-author.json";

export const SITE_AUTHOR = siteAuthor;

const LEGACY_AUTHOR_SLUGS = ["editorial"];
const LEGACY_AUTHOR_NAMES = ["PDFFlow"];

export function authorBioParagraphs(bio) {
  return String(bio || "")
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

let ensured = null;

export async function ensureSiteAuthor(prisma) {
  if (!prisma) return null;
  if (ensured) return ensured;
  ensured = upsertSiteAuthor(prisma).catch((error) => {
    ensured = null;
    throw error;
  });
  return ensured;
}

async function upsertSiteAuthor(prisma) {
  const wanted = {
    name: SITE_AUTHOR.name,
    slug: SITE_AUTHOR.slug,
    role: SITE_AUTHOR.role,
    bio: SITE_AUTHOR.bio,
    website: SITE_AUTHOR.website || "",
  };

  const existing =
    (await prisma.author.findUnique({ where: { slug: wanted.slug } })) ||
    (await prisma.author.findFirst({ where: { slug: { in: LEGACY_AUTHOR_SLUGS } } })) ||
    (await prisma.author.findFirst({ where: { name: { in: LEGACY_AUTHOR_NAMES } } }));

  const unchanged =
    existing &&
    existing.name === wanted.name &&
    existing.slug === wanted.slug &&
    existing.role === wanted.role &&
    existing.bio === wanted.bio &&
    String(existing.website || "") === wanted.website;

  if (unchanged) {
    const orphans = await prisma.guide.count({ where: { authorId: null, deletedAt: null } });
    if (!orphans) return existing;
    await prisma.guide.updateMany({
      where: { authorId: null, deletedAt: null },
      data: { authorId: existing.id },
    });
    return existing;
  }

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

  await prisma.guide.updateMany({
    where: { authorId: null, deletedAt: null },
    data: { authorId: author.id },
  });

  return author;
}
