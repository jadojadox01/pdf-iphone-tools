import { Node, mergeAttributes } from "@tiptap/core";

export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,
  addAttributes() {
    return {
      variant: { default: "info" },
    };
  },
  parseHTML() {
    return [{ tag: "aside[data-callout]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["aside", mergeAttributes(HTMLAttributes, { "data-callout": HTMLAttributes.variant || "info", class: `callout callout-${HTMLAttributes.variant || "info"}` }), 0];
  },
});

export const FaqItem = Node.create({
  name: "faqItem",
  group: "block",
  content: "block+",
  defining: true,
  addAttributes() {
    return {
      question: { default: "Question" },
    };
  },
  parseHTML() {
    return [{ tag: "div[data-faq]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-faq": "true", class: "faq-block" }), ["strong", {}, HTMLAttributes.question || "Question"], ["div", {}, 0]];
  },
});

export const ToolCta = Node.create({
  name: "toolCta",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      toolSlug: { default: "pdf-to-word" },
    };
  },
  parseHTML() {
    return [{ tag: "div[data-tool-cta]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-tool-cta": HTMLAttributes.toolSlug, class: "tool-cta" }), ["p", {}, `Tool: ${HTMLAttributes.toolSlug}`]];
  },
});

export const Example = Node.create({
  name: "example",
  group: "block",
  content: "block+",
  defining: true,
  addAttributes() {
    return {
      title: { default: "Example" },
      situation: { default: "" },
    };
  },
  parseHTML() {
    return [{ tag: "aside[data-example]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["aside", mergeAttributes(HTMLAttributes, { "data-example": "true", class: "guide-example" }), 0];
  },
});

export const ProsCons = Node.create({
  name: "prosCons",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      pros: { default: "", parseHTML: (el) => el.getAttribute("data-pros") || "", renderHTML: (attrs) => (attrs.pros ? { "data-pros": attrs.pros } : {}) },
      cons: { default: "", parseHTML: (el) => el.getAttribute("data-cons") || "", renderHTML: (attrs) => (attrs.cons ? { "data-cons": attrs.cons } : {}) },
    };
  },
  parseHTML() {
    return [{ tag: "div[data-pros-cons]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-pros-cons": "true", class: "pros-cons" }),
      ["p", {}, `Pros: ${HTMLAttributes["data-pros"] || ""}`],
      ["p", {}, `Cons: ${HTMLAttributes["data-cons"] || ""}`],
    ];
  },
});

export const Diagram = Node.create({
  name: "diagram",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      title: { default: "" },
      steps: { default: "", parseHTML: (el) => el.getAttribute("data-steps") || "", renderHTML: (attrs) => (attrs.steps ? { "data-steps": attrs.steps } : {}) },
    };
  },
  parseHTML() {
    return [{ tag: "div[data-diagram]" }];
  },
  renderHTML({ HTMLAttributes }) {
    const steps = HTMLAttributes["data-steps"] || "";
    return ["div", mergeAttributes(HTMLAttributes, { "data-diagram": "true", class: "guide-diagram" }), ["strong", {}, HTMLAttributes.title || "Diagram"], ["span", {}, steps]];
  },
});

export const Sources = Node.create({
  name: "sources",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      items: { default: "[]", parseHTML: (el) => el.getAttribute("data-items") || "[]", renderHTML: (attrs) => ({ "data-items": attrs.items || "[]" }) },
    };
  },
  parseHTML() {
    return [{ tag: "div[data-sources]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-sources": "true", class: "guide-sources" })];
  },
});

export const ButtonLink = Node.create({
  name: "buttonLink",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      href: { default: "/" },
      label: { default: "Open" },
    };
  },
  parseHTML() {
    return [{ tag: "div[data-button-link]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-button-link": "true" }), ["a", { href: HTMLAttributes.href }, HTMLAttributes.label || "Open"]];
  },
});
