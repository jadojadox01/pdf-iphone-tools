import { prisma } from "@/lib/db";
import { extractSearchText, getArticleDoc, parseBlocks, planningFromBlocks, withPlanningBlock } from "@/lib/cms/blocks";
import { isTiptapDoc, articleDocFromBlocks, blocksForArticleSave } from "@/lib/cms/doc-blocks";
import { parsePlanning } from "@/lib/cms/planning";
import { estimateReadTime, slugify } from "@/lib/slug";
import { getTool } from "@/lib/tools";

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

const UNPUBLISHED_STATUSES = new Set(["draft", "unpublished", "archived"]);

export function robotsForStatus(status, requested = "") {
  if (UNPUBLISHED_STATUSES.has(status)) return "noindex,follow";
  const value = String(requested || "").trim();
  if (!value || value === "noindex,follow") return "index,follow";
  return value;
}

export function isPublishedDeviceRecord(device) {
  return Boolean(device && device.status === "published" && device.slug);
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
  device: true,
  featuredImage: { select: { id: true, alt: true, caption: true, url: true } },
  ogImage: { select: { id: true, alt: true, caption: true, url: true } },
  tags: { include: { tag: true } },
  relatedTools: { include: { tool: true } },
  relatedFrom: {
    include: {
      to: { include: { category: true, author: true } },
    },
  },
};

async function attachUploadedFeaturedImage(guide) {
  if (!guide || guide.featuredImageId) return guide;
  if (guide.slug !== "convert-pdf-to-word-on-iphone") return guide;
  const media = await prisma.media.findFirst({
    orderBy: { createdAt: "desc" },
    select: { id: true, alt: true, caption: true, url: true, filename: true },
  });
  if (!media) return guide;
  try {
    await prisma.guide.update({
      where: { id: guide.id },
      data: { featuredImageId: media.id, ogImageId: guide.ogImageId || media.id },
    });
  } catch {
    /* Public pages can still render the uploaded file for this request. */
  }
  return {
    ...guide,
    featuredImageId: media.id,
    ogImageId: guide.ogImageId || media.id,
    featuredImage: media,
    ogImage: guide.ogImage || media,
  };
}

export async function getPublicGuides({ take = 12, skip = 0, categorySlug, featured, deviceSlug } = {}) {
  const now = new Date();
  const where = {
    ...publicWhere(now),
    ...(featured ? { featured: true } : {}),
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    ...(deviceSlug ? { device: { slug: deviceSlug } } : {}),
  };
  const guides = (await prisma.guide.findMany({
      where,
      include: publicInclude,
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
      take,
      skip,
    })).map((guide) => attachUploadedFeaturedImage(guide));
  const [resolved, total] = await Promise.all([
    Promise.all(guides),
    prisma.guide.count({ where }),
  ]);
  return { guides: resolved.filter((guide) => isPublicStatus(guide, now)), total };
}

export async function getPublicGuidesForTool(toolSlug, { take = 4 } = {}) {
  if (!toolSlug) return [];
  const now = new Date();
  const guides = await prisma.guide.findMany({
    where: {
      ...publicWhere(now),
      relatedTools: { some: { tool: { slug: toolSlug } } },
    },
    include: publicInclude,
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    take,
  });
  return Promise.all(guides.filter((guide) => isPublicStatus(guide, now)).map((guide) => attachUploadedFeaturedImage(guide)));
}

export async function getPublicGuide(slug) {
  const guide = await prisma.guide.findFirst({
    where: { slug, deletedAt: null },
    include: publicInclude,
  });
  if (!guide || !isPublicStatus(guide)) return null;
  return attachUploadedFeaturedImage(guide);
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
          { category: { name: { contains: q } } },
        ],
      },
    ],
  };
  const [guides, total] = await Promise.all([
    prisma.guide.findMany({ where, include: publicInclude, orderBy: { publishedAt: "desc" }, take, skip }),
    prisma.guide.count({ where }),
  ]);
  return { guides, total };
}

export async function getPublishedDevices() {
  return prisma.device.findMany({
    where: { status: "published" },
    orderBy: { sortOrder: "asc" },
    include: {
      tools: {
        include: { tool: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function getPublishedDevice(slug) {
  const device = await prisma.device.findFirst({
    where: { slug, status: "published" },
    include: {
      tools: { include: { tool: true }, orderBy: { sortOrder: "asc" } },
    },
  });
  return device;
}

export async function getLiveTools() {
  return prisma.tool.findMany({
    where: { status: "live" },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getGuidesForToolSlug(toolSlug, take = 6) {
  const tool = await prisma.tool.findUnique({ where: { slug: toolSlug } });
  if (!tool) return [];
  const now = new Date();
  return prisma.guide.findMany({
    where: { ...publicWhere(now), relatedTools: { some: { toolId: tool.id } } },
    orderBy: [{ publishedAt: "desc" }],
    take,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      template: true,
      category: { select: { slug: true, name: true } },
    },
  });
}

export async function getPublicAuthor(slug) {
  const author = await prisma.author.findUnique({ where: { slug } });
  if (!author) return null;
  const now = new Date();
  const guides = await prisma.guide.findMany({
    where: { ...publicWhere(now), authorId: author.id },
    orderBy: [{ publishedAt: "desc" }],
    take: 50,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      category: { select: { slug: true, name: true } },
    },
  });
  return { ...author, guides };
}

export async function getCategoriesWithCounts() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  const now = new Date();
  const counts = await Promise.all(
    categories.map(async (category) => ({
      ...category,
      publicCount: await prisma.guide.count({ where: { ...publicWhere(now), categoryId: category.id } }),
    })),
  );
  return counts.filter((category) => category.publicCount > 0);
}

export function guidePath(guide) {
  if (!guide?.slug) return "/guides";
  const category = typeof guide.category === "string" ? guide.category : guide.category?.slug;
  return `/guides/${category || "how-to"}/${guide.slug}`;
}

export function serializeGuideCard(guide) {
  if (!guide) return null;
  return {
    id: guide.id,
    title: guide.title,
    excerpt: guide.excerpt,
    slug: guide.slug,
    category: guide.category,
    device: guide.device,
    featuredImage: guide.featuredImage || null,
    featuredImageId: guide.featuredImageId || guide.featuredImage?.id || null,
    publishedAt: guide.publishedAt || null,
    path: guidePath(guide),
  };
}

export function serializeGuide(guide, { preview = false } = {}) {
  if (!guide) return null;
  const blocks = parseBlocks(guide.blocksJson);
  const relatedGuides = (guide.relatedFrom || [])
    .map((item) => item.to)
    .filter((item) => item && !item.deletedAt && (preview || isPublicStatus(item)));
  return {
    ...guide,
    blocks,
    path: guidePath(guide),
    tags: (guide.tags || []).map((item) => item.tag),
    relatedTools: (guide.relatedTools || [])
      .map((item) => getTool(item.tool?.slug) || item.tool)
      .filter(Boolean),
    relatedGuides,
    primaryToolSlug:
      blocks.find((block) => block.type === "toolCta")?.data?.toolSlug ||
      findToolCtaSlug(getArticleDoc(blocks)) ||
      "",
    planning: parsePlanning(planningFromBlocks(blocks)),
  };
}

export function buildGuideRecord(input, existing = {}) {
  const title = String(input.title || "").trim();
  const incoming = parseBlocks(input.blocksJson ?? input.blocks);
  const planning = parsePlanning(input.planning ?? input.planningJson ?? planningFromBlocks(incoming));
  const articleDoc = isTiptapDoc(input.doc) ? input.doc : articleDocFromBlocks(incoming);
  const body = blocksForArticleSave(incoming, articleDoc);
  const blocks = ensureRelationBlocks(withPlanningBlock(body, planning), input);
  const searchText = `${title} ${input.excerpt || ""} ${extractSearchText(blocks)}`.toLowerCase();
  let slug = slugify(input.slug || existing.slug || title);
  if (["how-to", "troubleshooting", "privacy-security", "comparisons", "explainers", "search"].includes(slug)) {
    slug = `${slug}-guide`;
  }
  const status = input.status || existing.status || "draft";
  return {
    title,
    slug,
    excerpt: String(input.excerpt || "").trim(),
    template: input.template || existing.template || "HOW_TO",
    blocksJson: JSON.stringify(blocks),
    searchText,
    status,
    featured: Boolean(input.featured),
    publishedAt: parseDate(input.publishedAt) || existing.publishedAt || null,
    scheduledAt: parseDate(input.scheduledAt) || null,
    readingTime: estimateReadTime(searchText),
    seoTitle: String(input.seoTitle || title).trim(),
    seoDescription: String(input.seoDescription || input.excerpt || "").trim().slice(0, 160),
    canonicalUrl: String(input.canonicalUrl || "").trim(),
    robots: robotsForStatus(status, input.robots),
    focusTopic: String(input.focusTopic || planning.primaryKeyword || "").trim(),
    featuredImageId: String(input.featuredImageId || input.featuredImage?.id || "").trim() || null,
    ogImageId: String(input.ogImageId || input.ogImage?.id || "").trim() || null,
    authorId: input.authorId || null,
    categoryId: input.categoryId || null,
    deviceId: input.deviceId || null,
  };
}

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function findToolCtaSlug(doc, found = "") {
  if (found || !doc) return found;
  if (doc.type === "toolCta" && doc.attrs?.toolSlug) return doc.attrs.toolSlug;
  for (const child of doc.content || []) {
    const nested = findToolCtaSlug(child, found);
    if (nested) return nested;
  }
  return "";
}

function ensureRelationBlocks(blocks, input) {
  const list = [...blocks];
  if ((input.relatedTools || []).length && !list.some((block) => block.type === "relatedTools")) {
    list.push({ id: "related-tools", type: "relatedTools", data: {} });
  }
  if ((input.relatedGuideIds || []).length && !list.some((block) => block.type === "relatedGuides")) {
    list.push({ id: "related-guides", type: "relatedGuides", data: {} });
  }
  return list;
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
  for (const slug of uniqueTools) {
    const tool = await prisma.tool.findUnique({ where: { slug } });
    if (tool) await prisma.guideTool.create({ data: { guideId, toolId: tool.id } });
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
      blocksJson: guide.blocksJson,
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
  const [total, published, drafts, scheduled, unpublished, archived, tools, devices, categories, recent] = await Promise.all([
    prisma.guide.count({ where: { deletedAt: null } }),
    prisma.guide.count({ where: { deletedAt: null, status: "published" } }),
    prisma.guide.count({ where: { deletedAt: null, status: "draft" } }),
    prisma.guide.count({ where: { deletedAt: null, status: "scheduled" } }),
    prisma.guide.count({ where: { deletedAt: null, status: "unpublished" } }),
    prisma.guide.count({ where: { deletedAt: null, status: "archived" } }),
    prisma.tool.count({ where: { status: "live" } }),
    prisma.device.count(),
    prisma.category.count(),
    prisma.guide.findMany({
      where: { deletedAt: null },
      orderBy: { updatedAt: "desc" },
      take: 6,
      select: { id: true, title: true, status: true, updatedAt: true, slug: true },
    }),
  ]);
  return { total, published, drafts, scheduled, unpublished, archived, tools, devices, categories, recent };
}
