export function normalizeGuideText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

export function isSameGuideText(a, b) {
  return normalizeGuideText(a).toLowerCase() === normalizeGuideText(b).toLowerCase();
}

export function distinctDescription(seo, excerpt, title) {
  const heading = normalizeGuideText(title);
  const meta = normalizeGuideText(seo);
  const lede = normalizeGuideText(excerpt);
  if (meta && !isSameGuideText(meta, heading)) return meta;
  if (lede && !isSameGuideText(lede, heading)) return lede;
  return meta || lede || "";
}

export function stripLeadingTitle(text, title) {
  const source = String(text || "").trim();
  const heading = normalizeGuideText(title);
  if (!source || !heading) return source;
  const compact = normalizeGuideText(source);
  if (isSameGuideText(compact, heading)) return "";
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const prefix = new RegExp(`^${escaped}(?:\\s+|\\s*[:.\\-—–]\\s*)`, "i");
  if (prefix.test(compact)) return compact.replace(prefix, "").trim();
  return source;
}

export function isUsefulCaption(caption, title) {
  const text = normalizeGuideText(caption);
  if (!text || isSameGuideText(text, title)) return false;
  if (text.length < 28 && text === text.toLowerCase() && !/[.!?:,]/.test(text)) return false;
  return true;
}

export function tocItemsFromHeadings(headings, title) {
  const seen = new Set();
  const items = [];
  for (const heading of headings || []) {
    const text = normalizeGuideText(heading.text);
    if (!text || isSameGuideText(text, title)) continue;
    let id = String(heading.id || "").trim() || slugifyHeading(text);
    const base = id;
    let n = 2;
    while (seen.has(id)) {
      id = `${base}-${n}`;
      n += 1;
    }
    seen.add(id);
    items.push({ ...heading, id, text, level: Number(heading.level) || 2 });
  }
  const h2 = items.filter((item) => item.level === 2);
  return h2.length >= 3 ? h2 : items.filter((item) => item.level === 2 || item.level === 3);
}

function slugifyHeading(text) {
  return (
    String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60) || "section"
  );
}
