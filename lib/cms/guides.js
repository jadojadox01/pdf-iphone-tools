import { prisma } from "@/lib/db";
import { extractText, parseDoc, withHeadingIds } from "./tiptap";
import { estimateReadTime, slugify } from "@/lib/slug";

export function isPublicStatus(guide, now = new Date()) {
  if (!guide || guide.deletedAt) return false;
  if (guide.status === "published") {
    return !guide.publishedAt || new Date(guide.publishedAt) <= now;
  }
  if (guide.status === "scheduled") {
    const when = guide.scheduledAt || guide.publishedAt;
    return Boolean(when && new Date(when) <= now);
  }
  return false;
}

export function publicWhere(now = new Date()) {
  return {
    deletedAt: null,
    OR: [
      { status: "published", publishedAt: { lte: now } },
      { status: "published", publishedAt: null },
      { status: "scheduled", scheduledAt: { lte: now } },
    ],
  };
}

const publicInclude = {
  author: true,
  category: true,
  featuredImage: { select: { id: true, alt: true, caption: true, mimeType: true } },
  tags: { include: { tag: true } },
  relatedTools: true,
  relatedFrom: {
    include: {
      to: {
        include: {
          category: true,
          author: true,
        },
      },
    },
  },
};

export async function getPublicGuides({ take = 12, skip = 0, categorySlug, featured } = {}) {
  const now = new Date();
  const where = {
    ...publicWhere(now),
    ...(featured ? { featured: true } : {}),
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
  };
  const [guides, total] = await Promise.all([
    prisma.guide.findMany({
      where,
      include: publicInclude,
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
      take,
      skip,
    }),
    prisma.guide.count({ where }),
  ]);
  return { guides: guides.filter((guide) => isPublicStatus(guide, now)), total };
}

export async function getPublicGuide(slug) {
  const guide = await prisma.guide.findFirst({
    where: { slug, deletedAt: null },
    include: publicInclude,
  });
  if (!guide || !isPublicStatus(guide)) return null;
  return guide;
}

export async function searchGuides(query, { take = 12, skip = 0 } = {}) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return { guides: [], total: 0 };
  const now = new Date();
  const where = {
    AND: [
      publicWhere(now),
      {
        OR: [
          { title: { contains: q } },
          { excerpt: { contains: q } },
          { searchText: { contains: q } },
          { focusTopic: { contains: q } },
          { category: { name: { contains: q } } },
          { tags: { some: { tag: { name: { contains: q } } } } },
        ],
      },
    ],
  };
  const [guides, total] = await Promise.all([
    prisma.guide.findMany({
      where,
      include: publicInclude,
      orderBy: { publishedAt: "desc" },
      take,
      skip,
    }),
    prisma.guide.count({ where }),
  ]);
  return { guides, total };
}

export async function getCategoriesWithCounts() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { guides: true } } },
  });
  const now = new Date();
  const counts = await Promise.all(
    categories.map(async (category) => ({
      ...category,
      publicCount: await prisma.guide.count({
        where: { ...publicWhere(now), categoryId: category.id },
      }),
    })),
  );
  return counts.filter((category) => category.publicCount > 0);
}

export async function getAllCategories() {
  return prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getAllAuthors() {
  return prisma.author.findMany({ orderBy: { name: "asc" } });
}

export async function getPublicAuthor(slug) {
  const author = await prisma.author.findUnique({
    where: { slug },
    include: {
      avatar: { select: { id: true, alt: true } },
    },
  });
  if (!author) return null;
  const now = new Date();
  const guides = await prisma.guide.findMany({
    where: { ...publicWhere(now), authorId: author.id },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    take: 50,
    select: { id: true, title: true, slug: true, excerpt: true },
  });
  return { ...author, guides };
}

export async function getGuidesForTool(toolSlug, take = 6) {
  if (!toolSlug) return [];
  const now = new Date();
  return prisma.guide.findMany({
    where: {
      ...publicWhere(now),
      relatedTools: { some: { toolSlug } },
    },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    take,
    select: { id: true, title: true, slug: true, excerpt: true },
  });
}

export function serializeGuide(guide) {
  if (!guide) return null;
  const doc = withHeadingIds(parseDoc(guide.contentJson));
  return {
    ...guide,
    contentJson: doc,
    searchText: undefined,
    featuredImage: guide.featuredImage
      ? { ...guide.featuredImage, data: undefined, url: `/api/media/${guide.featuredImage.id}` }
      : null,
    ogImage: guide.ogImage ? { id: guide.ogImage.id, url: `/api/media/${guide.ogImage.id}` } : null,
    tags: (guide.tags || []).map((item) => item.tag),
    relatedTools: (guide.relatedTools || []).map((item) => item.toolSlug),
    relatedGuides: (guide.relatedFrom || [])
      .map((item) => item.to)
      .filter((item) => item && !item.deletedAt && isPublicStatus(item)),
  };
}

export function buildGuideRecord(input, existing = {}) {
  const title = String(input.title || "").trim();
  const doc = withHeadingIds(parseDoc(input.contentJson));
  const searchText = `${title} ${input.excerpt || ""} ${extractText(doc)}`.toLowerCase();
  let slug = slugify(input.slug || existing.slug || title);
  if (["category", "search", "rss-xml", "new"].includes(slug)) slug = `${slug}-guide`;
  return {
    title,
    slug,
    excerpt: String(input.excerpt || "").trim(),
    contentJson: JSON.stringify(doc),
    searchText,
    status: input.status || existing.status || "draft",
    featured: Boolean(input.featured),
    publishedAt: parseDate(input.publishedAt) || existing.publishedAt || null,
    scheduledAt: parseDate(input.scheduledAt) || null,
    readingTime: estimateReadTime(searchText),
    seoTitle: String(input.seoTitle || title).trim(),
    seoDescription: String(input.seoDescription || input.excerpt || "").trim().slice(0, 160),
    canonicalUrl: String(input.canonicalUrl || "").trim(),
    robots: input.robots || "index,follow",
    focusTopic: String(input.focusTopic || "").trim(),
    featuredImageId: input.featuredImageId || null,
    ogImageId: input.ogImageId || null,
    authorId: input.authorId || null,
    categoryId: input.categoryId || null,
  };
}

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function syncGuideRelations(guideId, { tags = [], toolSlugs = [], relatedGuideIds = [] }) {
  await prisma.guideTag.deleteMany({ where: { guideId } });
  await prisma.guideTool.deleteMany({ where: { guideId } });
  await prisma.guideRelation.deleteMany({ where: { fromId: guideId } });

  const uniqueTags = [...new Set(tags.map((tag) => String(tag).trim()).filter(Boolean))];
  for (const name of uniqueTags) {
    const slug = slugify(name);
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
    await prisma.guideTag.create({ data: { guideId, tagId: tag.id } });
  }

  const uniqueTools = [...new Set(toolSlugs.filter(Boolean))];
  if (uniqueTools.length) {
    await prisma.guideTool.createMany({
      data: uniqueTools.map((toolSlug) => ({ guideId, toolSlug })),
    });
  }

  const uniqueRelated = [...new Set(relatedGuideIds.filter((id) => id && id !== guideId))];
  if (uniqueRelated.length) {
    await prisma.guideRelation.createMany({
      data: uniqueRelated.map((toId) => ({ fromId: guideId, toId })),
    });
  }
}

export async function saveRevision(guide) {
  await prisma.guideRevision.create({
    data: {
      guideId: guide.id,
      title: guide.title,
      excerpt: guide.excerpt,
      contentJson: guide.contentJson,
    },
  });
  const extra = await prisma.guideRevision.findMany({
    where: { guideId: guide.id },
    orderBy: { createdAt: "desc" },
    skip: 20,
    select: { id: true },
  });
  if (extra.length) {
    await prisma.guideRevision.deleteMany({ where: { id: { in: extra.map((item) => item.id) } } });
  }
}

export async function getAdminStats() {
  const [total, published, drafts, scheduled, unpublished, categories, recent] = await Promise.all([
    prisma.guide.count({ where: { deletedAt: null } }),
    prisma.guide.count({ where: { deletedAt: null, status: "published" } }),
    prisma.guide.count({ where: { deletedAt: null, status: "draft" } }),
    prisma.guide.count({ where: { deletedAt: null, status: "scheduled" } }),
    prisma.guide.count({ where: { deletedAt: null, status: "unpublished" } }),
    prisma.category.count(),
    prisma.guide.findMany({
      where: { deletedAt: null },
      orderBy: { updatedAt: "desc" },
      take: 6,
      select: { id: true, title: true, status: true, updatedAt: true, slug: true },
    }),
  ]);
  return { total, published, drafts, scheduled, unpublished, categories, recent };
}
