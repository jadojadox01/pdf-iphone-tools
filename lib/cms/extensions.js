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
