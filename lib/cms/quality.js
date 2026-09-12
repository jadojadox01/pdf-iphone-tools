import { extractHeadings, extractSearchText, parseBlocks } from "@/lib/cms/blocks";
import { parsePlanning } from "@/lib/cms/planning";
import { getTool, getTools } from "@/lib/tools";
import { slugify } from "@/lib/slug";

export const PUBLISH_VALUE_QUESTION =
  "If I remove the SEO purpose from this page, would this still be a genuinely useful resource for a real person?";

const TOOL_SLUGS = new Set(getTools().map((tool) => tool.slug));

export function assessGuideQuality(guide, meta = {}) {
  const blocks = parseBlocks(guide.blocks);
  const words = wordCount(extractSearchText(blocks));
  const headings = extractHeadings(blocks);
  const types = blocks.map((block) => block.type);
  const planning = parsePlanning(guide.planning || guide.planningJson);
  const warnings = [];

  if (!String(guide.title || "").trim()) {
    warnings.push(item("title", "Add a clear title that names the reader's problem or task."));
  }

  const excerpt = String(guide.excerpt || "").trim();
  if (!excerpt) {
    warnings.push(item("intro", "Add an introduction that states the reader's actual problem."));
  }

  if (!planning.primaryKeyword) {
    warnings.push(item("keyword", "Set a primary keyword that matches the search intent. Do not invent extra articles for the same intent."));
  }
  if (!planning.searchIntent) warnings.push(item("keyword", "Set search intent (how-to, troubleshoot, compare, or explainer)."));
  if (!guide.categoryId) warnings.push(item("meta", "Select a category."));
  if (!guide.authorId) warnings.push(item("meta", "Select an author. Use a real byline, not an invented person."));
  if (!String(guide.seoTitle || "").trim()) warnings.push(item("seo", "Add a title for search listings."));
  if (!String(guide.seoDescription || "").trim()) warnings.push(item("seo", "Add a meta description that matches what the guide actually covers."));
  if ((guide.seoTitle || "") === (guide.title || "") && (guide.seoDescription || "") === excerpt && excerpt) {
    warnings.push(item("seo", "SEO title and meta description copy the page title and intro. Rewrite them so the listing is unique, not duplicated."));
  }

  if (!blocks.length) {
    warnings.push(item("body", "There is no body content yet. Add only the sections that help someone finish the task."));
  }

  const empty = emptyBlocks(blocks);
  if (empty) {
    warnings.push(item("empty", `${empty} content block${empty === 1 ? "" : "s"} look empty. Remove them instead of leaving placeholders.`));
  }

  const headingTexts = headings.map((item) => item.text.trim().toLowerCase()).filter(Boolean);
  const dupes = headingTexts.filter((text, index) => headingTexts.indexOf(text) !== index);
  if (dupes.length) {
    warnings.push(item("headings", "Some headings repeat. Merge those sections or give them distinct purposes."));
  }

  if (planning.primaryKeyword && words > 40) {
    const hits = countPhrase(extractSearchText(blocks) + " " + (guide.title || "") + " " + excerpt, planning.primaryKeyword);
    if (hits > 12) {
      warnings.push(item("keyword", "The primary keyword appears unusually often. Say it where it is natural, not in every paragraph."));
    }
  }

  blocks.forEach((block) => {
    const data = block.data || {};
    if (block.type === "image") {
      if (!data.url) warnings.push(item("media", "An image block has no file or URL. Remove it or add the image."));
      else if (!String(data.alt || "").trim()) warnings.push(item("media", "An image is missing alt text. Describe what the reader should see."));
    }
    if (block.type === "video" && data.url && !isHttpUrl(data.url) && !data.url.includes("youtube")) {
      warnings.push(item("media", "A video URL does not look usable. Use a YouTube link or remove the block."));
    }
    if (block.type === "cta") {
      if (!data.href || !data.label) warnings.push(item("cta", "A button/CTA is missing a label or URL."));
      else if (!isInternalOrHttp(data.href)) warnings.push(item("cta", `The CTA URL “${data.href}” does not look valid.`));
    }
    if (block.type === "toolCta") {
      if (!getTool(data.toolSlug)) warnings.push(item("cta", `Tool CTA points at “${data.toolSlug || "blank"}”, which is not a live tool.`));
    }
    if (block.type === "ribbon" && data.href && !isInternalOrHttp(data.href)) {
      warnings.push(item("links", `A callout link “${data.href}” does not look valid.`));
    }
    if (block.type === "sources") {
      (data.items || []).forEach((source) => {
        if (source.url && !isInternalOrHttp(source.url)) {
          warnings.push(item("links", `A source URL “${source.url}” does not look valid.`));
        }
      });
    }
  });

  const hasToolLink =
    (guide.relatedTools || []).length > 0 ||
    Boolean(planning.toolDependency && planning.toolDependency !== "none" && getTool(planning.toolDependency)) ||
    blocks.some((block) => block.type === "toolCta" && getTool(block.data?.toolSlug));

  if (planning.toolDependency && planning.toolDependency !== "none" && !getTool(planning.toolDependency)) {
    warnings.push(item("related", `This guide depends on “${planning.toolDependency}”, which is not a live tool. Do not publish a promise the product cannot keep.`));
  }
  if (guide.template === "HOW_TO" && planning.toolDependency && planning.toolDependency !== "none" && !hasToolLink) {
    warnings.push(item("related", "Link the working tool this guide is about. One clear CTA is enough."));
  }

  if (guide.deviceId && planning.deviceIntent === "any") {
    warnings.push(item("device", "The page is tagged to a device, but planning says any device. Pick one so the instructions stay specific."));
  }

  const slug = slugify(guide.slug || guide.title);
  const clash = (meta.guides || []).find((item) => item.slug === slug && item.id !== guide.id);
  if (clash) warnings.push(item("slug", `The slug “${slug}” is already used by “${clash.title}”.`));

  (guide.relatedTools || []).forEach((slug) => {
    if (!TOOL_SLUGS.has(slug)) warnings.push(item("related", `Related tool “${slug}” is not in the live catalog.`));
  });

  (planning.sources || []).forEach((source) => {
    if (source.url && !isInternalOrHttp(source.url)) {
      warnings.push(item("links", `A reference URL “${source.url}” does not look valid.`));
    }
  });

  return {
    words,
    headingCount: headings.length,
    warnings,
    types,
    planning,
    ready: warnings.filter((item) => ["title", "intro", "body", "empty", "related"].includes(item.code)).length === 0,
  };
}

function item(code, text) {
  return { code, text };
}

function wordCount(text) {
  return String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function countPhrase(haystack, phrase) {
  const text = String(haystack || "").toLowerCase();
  const needle = String(phrase || "").trim().toLowerCase();
  if (!needle) return 0;
  let count = 0;
  let index = 0;
  while (index < text.length) {
    const found = text.indexOf(needle, index);
    if (found === -1) break;
    count += 1;
    index = found + needle.length;
  }
  return count;
}

function emptyBlocks(blocks) {
  return blocks.filter((block) => {
    if (["divider", "toc", "relatedTools", "relatedGuides", "planning"].includes(block.type)) return false;
    const data = block.data || {};
    const text = [
      data.title,
      data.summary,
      data.text,
      data.alt,
      data.url,
      data.href,
      data.label,
      ...(data.items || []).map((item) => (typeof item === "string" ? item : Object.values(item || {}).join(" "))),
      ...(data.steps || []),
      ...(data.pros || []),
      ...(data.cons || []),
      ...(data.rows || []).flat(),
    ]
      .join(" ")
      .trim();
    return text.length < 2;
  }).length;
}

function isHttpUrl(value) {
  return /^https?:\/\//i.test(value) || String(value).startsWith("/");
}

function isInternalOrHttp(value) {
  const href = String(value || "").trim();
  if (!href || href === "#" || href.startsWith("javascript:")) return false;
  return href.startsWith("/") || /^https?:\/\//i.test(href) || href.startsWith("mailto:");
}
