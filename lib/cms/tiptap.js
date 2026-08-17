export function emptyDoc() {
  return { type: "doc", content: [{ type: "paragraph" }] };
}

export function parseDoc(value) {
  if (!value) return emptyDoc();
  if (typeof value === "object") return value;
  try {
    const parsed = JSON.parse(value);
    return parsed?.type === "doc" ? parsed : emptyDoc();
  } catch {
    return emptyDoc();
  }
}

export function extractText(node) {
  if (!node) return "";
  if (node.type === "text") return node.text || "";
  if (node.attrs?.question) {
    return `${node.attrs.question} ${extractText({ content: node.content })}`;
  }
  return (node.content || []).map(extractText).join(node.type === "paragraph" ? "\n" : " ");
}

export function extractFaqs(node, list = []) {
  if (!node) return list;
  if (node.type === "faqItem" && node.attrs?.question) {
    list.push({
      q: node.attrs.question,
      a: extractText({ content: node.content }).trim(),
    });
  }
  (node.content || []).forEach((child) => extractFaqs(child, list));
  return list;
}

export function extractToc(node, list = []) {
  if (!node) return list;
  if (node.type === "heading" && (node.attrs?.level === 2 || node.attrs?.level === 3)) {
    const text = extractText(node).trim();
    if (text) {
      const id = node.attrs.id || slugFromHeading(text);
      list.push({ id, text, level: node.attrs.level });
    }
  }
  (node.content || []).forEach((child) => extractToc(child, list));
  return list;
}

export function slugFromHeading(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60) || "section";
}

export function withHeadingIds(node) {
  if (!node || typeof node !== "object") return node;
  const copy = { ...node, content: node.content ? node.content.map(withHeadingIds) : node.content };
  if (copy.type === "heading") {
    const text = extractText(copy).trim();
    copy.attrs = { ...(copy.attrs || {}), id: copy.attrs?.id || slugFromHeading(text) };
  }
  return copy;
}
