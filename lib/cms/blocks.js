export const BLOCK_LABELS = {
  hero: "Hero",
  quickAnswer: "Quick answer",
  paragraph: "Paragraph",
  heading: "Heading",
  image: "Image",
  video: "Video",
  quote: "Quote",
  list: "Bullet list",
  orderedList: "Numbered list",
  checklist: "Checklist",
  ribbon: "Ribbon / callout",
  steps: "Step-by-step",
  example: "Worked example",
  options: "Options / settings",
  howItWorks: "How it works",
  cta: "Button / CTA",
  toolCta: "Tool card",
  faq: "FAQ",
  troubleshooting: "Problem / cause / solution",
  comparison: "Comparison table",
  prosCons: "Pros and cons",
  relatedTools: "Related tools",
  relatedGuides: "Related guides",
  toc: "Table of contents",
  divider: "Divider",
  code: "Code",
  diagram: "Diagram",
  sources: "Sources / references",
};

export const BLOCK_GROUPS = [
  {
    id: "structure",
    label: "Structure",
    types: ["hero", "quickAnswer", "heading", "paragraph", "toc", "divider"],
  },
  {
    id: "instruction",
    label: "Instructions",
    types: ["steps", "checklist", "list", "orderedList", "example", "options"],
  },
  {
    id: "callouts",
    label: "Callouts",
    types: ["ribbon"],
  },
  {
    id: "media",
    label: "Media",
    types: ["image", "video", "quote", "code", "diagram"],
  },
  {
    id: "reference",
    label: "Reference",
    types: ["faq", "troubleshooting", "comparison", "prosCons", "howItWorks", "sources"],
  },
  {
    id: "next",
    label: "Next steps",
    types: ["toolCta", "cta", "relatedTools", "relatedGuides"],
  },
];

export const BLOCK_TYPES = BLOCK_GROUPS.flatMap((group) =>
  group.types.map((type) => ({ type, label: BLOCK_LABELS[type] || type, group: group.label })),
);

export const RIBBON_VARIANTS = [
  "info",
  "tip",
  "warning",
  "important",
  "success",
  "note",
  "problem",
  "solution",
];

export function newBlockId() {
  return `b_${Math.random().toString(36).slice(2, 10)}`;
}

export function emptyBlock(type) {
  const id = newBlockId();
  switch (type) {
    case "hero":
      return { id, type, data: { title: "", summary: "" } };
    case "quickAnswer":
      return { id, type, data: { title: "Short answer", text: "" } };
    case "heading":
      return { id, type, data: { level: 2, text: "" } };
    case "image":
      return { id, type, data: { url: "", alt: "", caption: "", mediaId: "", width: null, height: null, align: "left", wrap: null, annotation: "", credit: "" } };
    case "video":
      return { id, type, data: { url: "", title: "Video" } };
    case "quote":
      return { id, type, data: { text: "", cite: "" } };
    case "list":
    case "orderedList":
    case "checklist":
      return { id, type, data: { items: [""] } };
    case "ribbon":
      return { id, type, data: { variant: "tip", title: "Tip", text: "", href: "", cta: "" } };
    case "steps":
      return { id, type, data: { items: [{ title: "Step 1", text: "", imageUrl: "", imageAlt: "", caption: "" }] } };
    case "example":
      return { id, type, data: { title: "Example", situation: "", result: "", text: "" } };
    case "howItWorks":
      return { id, type, data: { title: "How this works", text: "" } };
    case "options":
      return { id, type, data: { title: "Options", items: [{ name: "", text: "" }] } };
    case "cta":
      return { id, type, data: { label: "Open tool", href: "/", text: "" } };
    case "toolCta":
      return { id, type, data: { toolSlug: "pdf-to-word", title: "Convert your PDF now", text: "" } };
    case "faq":
      return { id, type, data: { items: [{ q: "", a: "" }] } };
    case "troubleshooting":
      return { id, type, data: { items: [{ problem: "", cause: "", solution: "" }] } };
    case "comparison":
      return { id, type, data: { headers: ["Option", "Best for"], rows: [["", ""]] } };
    case "prosCons":
      return { id, type, data: { pros: [""], cons: [""] } };
    case "relatedTools":
    case "relatedGuides":
      return { id, type, data: {} };
    case "toc":
      return { id, type, data: { title: "On this page" } };
    case "divider":
      return { id, type, data: {} };
    case "code":
      return { id, type, data: { language: "text", text: "" } };
    case "diagram":
      return { id, type, data: { title: "", steps: ["Choose file", "Convert", "Download"] } };
    case "sources":
      return { id, type, data: { items: [{ title: "", url: "", note: "" }] } };
    default:
      return { id, type: "paragraph", data: { text: "" } };
  }
}

export function emptyGuideBlocks() {
  return [emptyBlock("hero"), emptyBlock("quickAnswer"), emptyBlock("paragraph")];
}

export function starterOutline(kind) {
  const heading = (text) => ({ ...emptyBlock("heading"), data: { level: 2, text } });
  if (kind === "HOW_TO") {
    return [
      emptyBlock("hero"),
      emptyBlock("quickAnswer"),
      emptyBlock("toolCta"),
      emptyBlock("toc"),
      heading("What is the problem?"),
      emptyBlock("paragraph"),
      heading("Why this method?"),
      emptyBlock("paragraph"),
      heading("What you need"),
      emptyBlock("checklist"),
      heading("Step-by-step instructions"),
      emptyBlock("steps"),
      heading("Common problems"),
      emptyBlock("troubleshooting"),
      emptyBlock("howItWorks"),
      heading("Privacy and security"),
      emptyBlock("paragraph"),
      emptyBlock("faq"),
      emptyBlock("relatedTools"),
      emptyBlock("relatedGuides"),
      emptyBlock("cta"),
    ];
  }
  if (kind === "TROUBLESHOOTING") {
    return [
      emptyBlock("hero"),
      emptyBlock("quickAnswer"),
      heading("What is going wrong"),
      emptyBlock("paragraph"),
      heading("Fixes that actually work"),
      emptyBlock("troubleshooting"),
    ];
  }
  if (kind === "EXPLAINER") {
    return [
      emptyBlock("hero"),
      emptyBlock("quickAnswer"),
      heading("What this is"),
      emptyBlock("paragraph"),
      heading("How it works"),
      emptyBlock("howItWorks"),
    ];
  }
  if (kind === "COMPARISON") {
    return [
      emptyBlock("hero"),
      emptyBlock("quickAnswer"),
      heading("Side by side"),
      emptyBlock("comparison"),
    ];
  }
  return emptyGuideBlocks();
}

/** @deprecated Use starterOutline("HOW_TO") when an outline is actually wanted. */
export function howToTemplate() {
  return starterOutline("HOW_TO");
}

export function planningFromBlocks(blocks) {
  const found = parseBlocks(blocks).find((block) => block.type === "planning");
  return found?.data || {};
}

export function withPlanningBlock(blocks, planning) {
  const rest = parseBlocks(blocks).filter((block) => block.type !== "planning");
  return [{ id: "planning", type: "planning", data: planning }, ...rest];
}

export function parseBlocks(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getArticleDoc(blocks) {
  const found = parseBlocks(blocks).find((block) => block.type === "articleDoc" && block.data?.doc?.type === "doc");
  return found?.data?.doc || null;
}

function collectDocText(node) {
  if (!node) return "";
  if (node.type === "text") return node.text || "";
  if (node.attrs?.question) return `${node.attrs.question} ${collectDocText({ content: node.content })}`;
  return (node.content || []).map(collectDocText).join(node.type === "paragraph" ? "\n" : " ");
}

function collectDocHeadings(node, list = []) {
  if (!node) return list;
  if (node.type === "heading") {
    const text = collectDocText(node).trim();
    if (text) list.push({ id: slugFromHeading(text), text, level: Number(node.attrs?.level) || 2 });
  }
  (node.content || []).forEach((child) => collectDocHeadings(child, list));
  return list;
}

function collectDocFaqs(node, list = []) {
  if (!node) return list;
  if (node.type === "faqItem" && node.attrs?.question) {
    list.push({ q: node.attrs.question, a: collectDocText({ content: node.content }).trim() });
  }
  (node.content || []).forEach((child) => collectDocFaqs(child, list));
  return list;
}

export function blockText(block) {
  if (block?.type === "articleDoc") return collectDocText(block.data?.doc);
  if (!block?.data) return "";
  const data = block.data;
  const parts = [
    data.title,
    data.summary,
    data.text,
    data.cite,
    data.label,
    data.alt,
    data.caption,
    data.situation,
    data.result,
    ...(data.items || []).map((item) =>
      typeof item === "string"
        ? item
        : [item.title, item.text, item.q, item.a, item.problem, item.cause, item.solution, item.name, item.ribbonText]
            .filter(Boolean)
            .join(" "),
    ),
    ...(data.pros || []),
    ...(data.cons || []),
    ...(data.rows || []).flat(),
  ];
  return parts.filter(Boolean).join(" ");
}

export function extractSearchText(blocks) {
  return parseBlocks(blocks)
    .filter((block) => block.type !== "planning")
    .map(blockText)
    .join(" ")
    .toLowerCase();
}

export function extractHowToSteps(blocks) {
  return parseBlocks(blocks).flatMap((block) => {
    if (block.type !== "steps") return [];
    return (block.data?.items || [])
      .map((item) => ({
        name: String(item.title || item.text || "").trim(),
        text: String(item.text || item.title || "").trim(),
      }))
      .filter((item) => item.name && item.text);
  });
}

export function extractFaqs(blocks) {
  const list = parseBlocks(blocks);
  const article = getArticleDoc(list);
  if (article) return collectDocFaqs(article).filter((item) => item.q && item.a);
  return list.flatMap((block) => {
    if (block.type !== "faq") return [];
    return (block.data?.items || []).filter((item) => item.q && item.a);
  });
}

export function extractHeadings(blocks) {
  const list = parseBlocks(blocks);
  const article = getArticleDoc(list);
  const raw = article
    ? collectDocHeadings(article)
    : list.flatMap((block) => {
        if (block.type === "heading" && block.data?.text) {
          return [
            {
              id: slugFromHeading(block.data.text),
              text: block.data.text,
              level: Number(block.data.level) || 2,
            },
          ];
        }
        if (block.type === "howItWorks" && block.data?.title) {
          return [{ id: slugFromHeading(block.data.title), text: block.data.title, level: 2 }];
        }
        return [];
      });
  const seen = new Set();
  return raw.map((item) => {
    let id = item.id || slugFromHeading(item.text);
    const base = id;
    let n = 2;
    while (seen.has(id)) {
      id = `${base}-${n}`;
      n += 1;
    }
    seen.add(id);
    return { ...item, id };
  });
}

export function slugFromHeading(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60) || "section";
}

export function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function textToParagraphs(text) {
  return String(text || "")
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}
