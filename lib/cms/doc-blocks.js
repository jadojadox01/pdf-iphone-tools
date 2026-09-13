import { emptyBlock, newBlockId, parseBlocks, textToParagraphs } from "./blocks";
import { tokenizeLinks } from "./linkify";
import { emptyDoc, extractText } from "./tiptap";

export function isTiptapDoc(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value) && value.type === "doc" && Array.isArray(value.content));
}

export function articleDocFromBlocks(blocks) {
  const found = parseBlocks(blocks).find((block) => block.type === "articleDoc" && isTiptapDoc(block.data?.doc));
  return found?.data?.doc || null;
}

export function docFromGuideBlocks(blocks) {
  return articleDocFromBlocks(blocks) || blocksToDoc(blocks);
}

export function blocksForArticleSave(existingBlocks, doc) {
  const extras = parseBlocks(existingBlocks).filter((block) =>
    ["relatedTools", "relatedGuides", "toc"].includes(block.type),
  );
  if (!isTiptapDoc(doc)) return parseBlocks(existingBlocks).filter((block) => block.type !== "planning");
  return [...extras, { id: "article", type: "articleDoc", data: { doc } }];
}

function textNodes(text) {
  const tokens = tokenizeLinks(String(text || ""), []);
  return tokens.flatMap((token) => {
    if (!token.text) return [];
    const node = { type: "text", text: token.text };
    if (token.href) node.marks = [{ type: "link", attrs: { href: token.href } }];
    return [node];
  });
}

function paragraph(text) {
  return { type: "paragraph", content: textNodes(text) };
}

function heading(text, level = 2) {
  return { type: "heading", attrs: { level: Number(level) || 2 }, content: textNodes(text) };
}

function callout(variant, text) {
  return {
    type: "callout",
    attrs: { variant: variant || "info" },
    content: [paragraph(text)],
  };
}

function list(type, items) {
  return {
    type: type === "orderedList" ? "orderedList" : "bulletList",
    content: (items || []).filter(Boolean).map((item) => ({
      type: "listItem",
      content: [paragraph(typeof item === "string" ? item : [item.title, item.text].filter(Boolean).join(". "))],
    })),
  };
}

export function blocksToDoc(blocks) {
  const content = [];
  for (const block of parseBlocks(blocks)) {
    const data = block.data || {};
    switch (block.type) {
      case "planning":
      case "relatedTools":
      case "relatedGuides":
      case "toc":
      case "articleDoc":
        break;
      case "hero":
        if (data.summary) content.push(paragraph(data.summary));
        break;
      case "quickAnswer":
        if (data.text) content.push(callout("info", data.text));
        break;
      case "heading":
        if (data.text) content.push(heading(data.text, data.level));
        break;
      case "paragraph":
        textToParagraphs(data.text).forEach((part) => content.push(paragraph(part)));
        break;
      case "list":
      case "checklist":
        if (data.items?.length) content.push(list("bulletList", data.items));
        break;
      case "orderedList":
      case "steps":
        if (data.items?.length) content.push(list("orderedList", data.items));
        break;
      case "ribbon":
        content.push(callout(data.variant || "tip", [data.title, data.text].filter(Boolean).join(": ")));
        break;
      case "image":
        if (data.url) {
          content.push({
            type: "image",
            attrs: {
              src: data.url,
              alt: data.alt || "",
              caption: data.caption || null,
              width: data.width || null,
              height: data.height || null,
              textAlign: data.align || null,
              wrap: data.wrap || null,
              annotation: data.annotation || null,
              credit: data.credit || null,
            },
          });
        }
        break;
      case "quote":
        content.push({
          type: "blockquote",
          content: [paragraph(data.text), data.cite ? paragraph(`— ${data.cite}`) : null].filter(Boolean),
        });
        break;
      case "code":
        content.push({
          type: "codeBlock",
          content: textNodes(data.text),
        });
        break;
      case "faq":
        (data.items || []).forEach((item) => {
          if (!item.q && !item.a) return;
          content.push({
            type: "faqItem",
            attrs: { question: item.q || "Question" },
            content: [paragraph(item.a || "")],
          });
        });
        break;
      case "toolCta":
        content.push({ type: "toolCta", attrs: { toolSlug: data.toolSlug || "pdf-to-word" } });
        break;
      case "cta":
        content.push({ type: "buttonLink", attrs: { href: data.href || "/", label: data.label || "Open" } });
        break;
      case "divider":
        content.push({ type: "horizontalRule" });
        break;
      case "video":
        if (data.url) content.push({ type: "youtube", attrs: { src: data.url } });
        break;
      case "comparison": {
        const headers = data.headers?.length ? data.headers : ["Column"];
        const rows = data.rows?.length ? data.rows : [headers.map(() => "")];
        const colWidths = data.colWidths || [];
        const cells = (values, type) =>
          headers.map((_, index) => ({
            type,
            attrs: colWidths[index] ? { colwidth: [colWidths[index]] } : {},
            content: [paragraph(typeof values[index] === "string" ? values[index] : "")],
          }));
        content.push({
          type: "table",
          content: [
            { type: "tableRow", content: cells(headers, "tableHeader") },
            ...rows.map((row) => ({ type: "tableRow", content: cells(row, "tableCell") })),
          ],
        });
        break;
      }
      case "example":
        content.push({
          type: "example",
          attrs: { title: data.title || "Example", situation: data.situation || "" },
          content: [paragraph(data.result || data.text || "")],
        });
        break;
      case "prosCons":
        content.push({
          type: "prosCons",
          attrs: {
            pros: (data.pros || []).filter(Boolean).join("\n"),
            cons: (data.cons || []).filter(Boolean).join("\n"),
          },
        });
        break;
      case "diagram":
        content.push({
          type: "diagram",
          attrs: {
            title: data.title || "",
            steps: (data.steps || []).filter(Boolean).join(" → "),
          },
        });
        break;
      case "sources":
        content.push({
          type: "sources",
          attrs: { items: JSON.stringify(data.items || []) },
        });
        break;
      case "troubleshooting":
        (data.items || []).forEach((item) => {
          const text = [
            item.problem && `Problem: ${item.problem}`,
            item.cause && `Cause: ${item.cause}`,
            item.solution && `Solution: ${item.solution}`,
          ]
            .filter(Boolean)
            .join("\n");
          if (text) content.push(callout("warning", text));
        });
        break;
      case "howItWorks":
      case "options":
        if (data.title) content.push(heading(data.title, 2));
        if (data.text) content.push(paragraph(data.text));
        if (data.situation) content.push(paragraph(data.situation));
        if (data.result) content.push(paragraph(data.result));
        (data.items || []).forEach((item) => {
          const line =
            typeof item === "string"
              ? item
              : [item.problem, item.cause, item.solution, item.name, item.text, item.q, item.a].filter(Boolean).join(" — ");
          if (line) content.push(paragraph(line));
        });
        (data.pros || []).forEach((item) => content.push(paragraph(`Pro: ${item}`)));
        (data.cons || []).forEach((item) => content.push(paragraph(`Con: ${item}`)));
        break;
      default:
        if (data.text) content.push(paragraph(data.text));
    }
  }
  return { type: "doc", content: content.length ? content : [{ type: "paragraph" }] };
}

export function docToBlocks(doc) {
  const nodes = doc?.type === "doc" ? doc.content || [] : [];
  const blocks = [];
  let faqItems = [];

  function flushFaq() {
    if (!faqItems.length) return;
    blocks.push({
      id: newBlockId(),
      type: "faq",
      data: { items: faqItems },
    });
    faqItems = [];
  }

  for (const node of nodes) {
    if (node.type !== "faqItem") flushFaq();
    switch (node.type) {
      case "heading":
        blocks.push({
          ...emptyBlock("heading"),
          data: { level: Number(node.attrs?.level) || 2, text: extractText(node).trim() },
        });
        break;
      case "paragraph": {
        const text = extractText(node).trim();
        if (text) blocks.push({ ...emptyBlock("paragraph"), data: { text } });
        break;
      }
      case "bulletList":
        blocks.push({
          ...emptyBlock("list"),
          data: { items: (node.content || []).map((item) => extractText(item).trim()).filter(Boolean) },
        });
        break;
      case "orderedList":
        blocks.push({
          ...emptyBlock("steps"),
          data: {
            items: (node.content || []).map((item, index) => {
              const text = extractText(item).trim();
              return { title: `Step ${index + 1}`, text };
            }),
          },
        });
        break;
      case "blockquote":
        blocks.push({ ...emptyBlock("quote"), data: { text: extractText(node).trim(), cite: "" } });
        break;
      case "codeBlock":
        blocks.push({ ...emptyBlock("code"), data: { language: "text", text: extractText(node) } });
        break;
      case "horizontalRule":
        blocks.push(emptyBlock("divider"));
        break;
      case "image":
        blocks.push({
          ...emptyBlock("image"),
          data: {
            url: node.attrs?.src || "",
            alt: node.attrs?.alt || "",
            caption: node.attrs?.caption || "",
            width: node.attrs?.width || null,
            height: node.attrs?.height || null,
            align: node.attrs?.textAlign || "left",
            wrap: node.attrs?.wrap || null,
            annotation: node.attrs?.annotation || "",
            credit: node.attrs?.credit || "",
          },
        });
        break;
      case "callout": {
        const text = extractText(node).trim();
        const variant = node.attrs?.variant || "tip";
        blocks.push({
          ...emptyBlock("ribbon"),
          data: { variant, title: variant[0].toUpperCase() + variant.slice(1), text, href: "", cta: "" },
        });
        break;
      }
      case "faqItem":
        faqItems.push({ q: node.attrs?.question || "Question", a: extractText(node).trim() });
        break;
      case "toolCta":
        blocks.push({
          ...emptyBlock("toolCta"),
          data: { toolSlug: node.attrs?.toolSlug || "pdf-to-word", title: "", text: "" },
        });
        break;
      case "buttonLink":
        blocks.push({
          ...emptyBlock("cta"),
          data: { href: node.attrs?.href || "/", label: node.attrs?.label || "Open", text: "" },
        });
        break;
      case "youtube":
        blocks.push({ ...emptyBlock("video"), data: { url: node.attrs?.src || "", title: "Video" } });
        break;
      case "example":
        blocks.push({
          ...emptyBlock("example"),
          data: {
            title: node.attrs?.title || "Example",
            situation: node.attrs?.situation || "",
            result: extractText(node).trim(),
            text: extractText(node).trim(),
          },
        });
        break;
      case "prosCons":
        blocks.push({
          ...emptyBlock("prosCons"),
          data: {
            pros: String(node.attrs?.pros || "").split("\n").map((item) => item.trim()).filter(Boolean),
            cons: String(node.attrs?.cons || "").split("\n").map((item) => item.trim()).filter(Boolean),
          },
        });
        break;
      case "diagram":
        blocks.push({
          ...emptyBlock("diagram"),
          data: {
            title: node.attrs?.title || "",
            steps: String(node.attrs?.steps || "")
              .split("→")
              .map((item) => item.trim())
              .filter(Boolean),
          },
        });
        break;
      case "sources": {
        let items = [];
        try {
          items = JSON.parse(node.attrs?.items || "[]");
        } catch {
          items = [];
        }
        blocks.push({ ...emptyBlock("sources"), data: { items } });
        break;
      }
      case "table": {
        const rows = (node.content || []).map((row) =>
          (row.content || []).map((cell) => extractText(cell).trim()),
        );
        const headers = rows[0] || ["Column"];
        const colWidths = (node.content?.[0]?.content || []).map((cell) => {
          const width = cell.attrs?.colwidth;
          return Array.isArray(width) ? width[0] : null;
        });
        blocks.push({
          ...emptyBlock("comparison"),
          data: {
            headers,
            rows: rows.slice(1).length ? rows.slice(1) : [headers.map(() => "")],
            colWidths,
          },
        });
        break;
      }
      default:
        break;
    }
  }
  flushFaq();
  return blocks;
}

export function isEmptyDoc(doc) {
  return !extractText(doc || emptyDoc()).trim();
}
