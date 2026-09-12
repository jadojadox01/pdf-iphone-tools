import { prisma } from "../lib/db.js";
import { IPHONE_FIRST_EIGHT } from "../lib/cms/drafts/iphone-first-eight.js";
import { emptyPlanning } from "../lib/cms/planning.js";
import { extractSearchText, withPlanningBlock } from "../lib/cms/blocks.js";

async function main() {
  const author = (await prisma.author.findFirst({ where: { slug: "editorial" } })) || (await prisma.author.findFirst());
  const category = await prisma.category.findFirst({ where: { slug: "how-to" } });
  const device = await prisma.device.findFirst({ where: { slug: "iphone" } });
  if (!author || !category || !device) {
    throw new Error("Need an author, how-to category, and iPhone device in the database. Do not seed from this script.");
  }

  const created = [];
  for (const draft of IPHONE_FIRST_EIGHT) {
    const planning = {
      ...emptyPlanning(),
      ...draft.planning,
      checklist: emptyPlanning().checklist,
    };
    const blocks = withPlanningBlock(
      [
        ...draft.blocks,
        { id: `b_rel_t_${draft.slug}`, type: "relatedTools", data: {} },
        { id: `b_rel_g_${draft.slug}`, type: "relatedGuides", data: {} },
      ],
      planning,
    );
    const searchText = `${draft.title} ${draft.excerpt} ${extractSearchText(blocks)}`.toLowerCase();
    const data = {
      title: draft.title,
      excerpt: draft.excerpt,
      template: draft.template,
      blocksJson: JSON.stringify(blocks),
      searchText,
      status: "draft",
      featured: false,
      publishedAt: null,
      seoTitle: draft.seoTitle,
      seoDescription: draft.seoDescription,
      robots: "noindex,follow",
      focusTopic: planning.primaryKeyword || "",
      authorId: author.id,
      categoryId: category.id,
      deviceId: device.id,
      readingTime: Math.max(2, Math.round(searchText.split(/\s+/).length / 180)),
    };

    const existing = await prisma.guide.findUnique({ where: { slug: draft.slug } });
    let guide;
    if (existing) {
      if (existing.status === "published") {
        console.log(`Skip ${draft.slug} — already published. Left untouched.`);
        created.push(existing);
        continue;
      }
      guide = await prisma.guide.update({
        where: { slug: draft.slug },
        data,
      });
      console.log(`Updated draft ${draft.slug}`);
    } else {
      guide = await prisma.guide.create({
        data: { ...data, slug: draft.slug },
      });
      console.log(`Created draft ${draft.slug}`);
    }

    await prisma.guideTag.deleteMany({ where: { guideId: guide.id } });
    await prisma.guideTool.deleteMany({ where: { guideId: guide.id } });
    for (const name of draft.planning.supportingKeywords || []) {
      const tagSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const tag = await prisma.tag.upsert({
        where: { slug: tagSlug },
        update: { name },
        create: { slug: tagSlug, name },
      });
      await prisma.guideTag.create({ data: { guideId: guide.id, tagId: tag.id } });
    }
    for (const toolSlug of draft.relatedTools || []) {
      const tool = await prisma.tool.findUnique({ where: { slug: toolSlug } });
      if (tool) await prisma.guideTool.create({ data: { guideId: guide.id, toolId: tool.id } });
      else console.warn(`Tool missing in CMS catalog: ${toolSlug}`);
    }
    created.push(guide);
  }

  const bySlug = Object.fromEntries(created.map((item) => [item.slug, item]));
  for (const draft of IPHONE_FIRST_EIGHT) {
    const from = bySlug[draft.slug];
    if (!from) continue;
    await prisma.guideRelation.deleteMany({ where: { fromId: from.id } });
    for (const slug of draft.relatedSlugs || []) {
      const to = bySlug[slug] || (await prisma.guide.findUnique({ where: { slug } }));
      if (to && to.id !== from.id) {
        await prisma.guideRelation.create({ data: { fromId: from.id, toId: to.id } }).catch(() => null);
      }
    }
  }

  console.log("Drafts ready. None were published.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
