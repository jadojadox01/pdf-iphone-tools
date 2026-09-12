import { toolPath } from "@/lib/paths";
import { getTools } from "@/lib/tools";

function safeHref(href) {
  const value = String(href || "").trim();
  if (!value || value.startsWith("javascript:") || value.startsWith("data:")) return "";
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  if (/^https?:\/\//i.test(value)) return value;
  return "";
}

export function buildGuideLinks(guide) {
  const device = guide?.device?.slug;
  const items = [];
  for (const tool of getTools()) {
    items.push({ phrase: tool.name, href: toolPath(tool.slug, device) });
  }
  for (const item of guide?.relatedGuides || []) {
    if (!item?.title || !item?.slug) continue;
    if (item.slug === guide?.slug) continue;
    items.push({
      phrase: item.title,
      href: `/guides/${item.category?.slug || "how-to"}/${item.slug}`,
    });
  }
  return items.sort((a, b) => b.phrase.length - a.phrase.length);
}

const MARKDOWN_LINK = /\[([^\]]+)\]\((\/[^)\s]+|https?:\/\/[^)\s]+)\)/g;

export function tokenizeLinks(text, catalog = []) {
  const source = String(text || "");
  if (!source) return [];

  const taken = [];
  let match;
  const markdown = new RegExp(MARKDOWN_LINK.source, "g");
  while ((match = markdown.exec(source))) {
    const href = safeHref(match[2]);
    if (!href) continue;
    taken.push({
      start: match.index,
      end: match.index + match[0].length,
      text: match[1],
      href,
      external: !href.startsWith("/"),
    });
  }

  const lower = source.toLowerCase();
  for (const item of catalog) {
    const href = safeHref(item.href);
    const needle = String(item.phrase || "").toLowerCase();
    if (!href || needle.length < 4) continue;
    let from = 0;
    while (from < source.length) {
      const at = lower.indexOf(needle, from);
      if (at === -1) break;
      const end = at + needle.length;
      const overlap = taken.some((range) => at < range.end && end > range.start);
      const leftOk = at === 0 || !/[a-z0-9]/i.test(source[at - 1]);
      const rightOk = end === source.length || !/[a-z0-9]/i.test(source[end]);
      if (!overlap && leftOk && rightOk) {
        taken.push({
          start: at,
          end,
          text: source.slice(at, end),
          href,
          external: !href.startsWith("/"),
        });
        break;
      }
      from = at + 1;
    }
  }

  taken.sort((a, b) => a.start - b.start);
  const kept = [];
  for (const range of taken) {
    if (kept.some((item) => range.start < item.end && range.end > item.start)) continue;
    kept.push(range);
  }

  const tokens = [];
  let cursor = 0;
  for (const range of kept) {
    if (range.start > cursor) tokens.push({ text: source.slice(cursor, range.start) });
    tokens.push({ text: range.text, href: range.href, external: range.external });
    cursor = range.end;
  }
  if (cursor < source.length) tokens.push({ text: source.slice(cursor) });
  return tokens.length ? tokens : [{ text: source }];
}
