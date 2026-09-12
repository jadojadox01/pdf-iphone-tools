import { Extension, Mark, mergeAttributes } from "@tiptap/core";

function styleFromAttrs(attributes) {
  const parts = [];
  if (attributes.fontFamily) parts.push(`font-family: ${attributes.fontFamily}`);
  if (attributes.fontSize) parts.push(`font-size: ${attributes.fontSize}`);
  if (attributes.color) parts.push(`color: ${attributes.color}`);
  return parts.length ? { style: parts.join("; ") } : {};
}

export const WordText = Mark.create({
  name: "wordText",
  addAttributes() {
    return {
      fontFamily: {
        default: null,
        parseHTML: (element) => element.style.fontFamily || null,
        renderHTML: () => ({}),
      },
      fontSize: {
        default: null,
        parseHTML: (element) => element.style.fontSize || null,
        renderHTML: () => ({}),
      },
      color: {
        default: null,
        parseHTML: (element) => element.style.color || null,
        renderHTML: () => ({}),
      },
    };
  },
  parseHTML() {
    return [{ tag: "span[data-word-text]" }];
  },
  renderHTML({ HTMLAttributes, mark }) {
    return ["span", mergeAttributes({ "data-word-text": "" }, HTMLAttributes, styleFromAttrs(mark?.attrs || {})), 0];
  },
});

export const HighlightMark = Mark.create({
  name: "highlightMark",
  addAttributes() {
    return {
      color: {
        default: "#fff59d",
        parseHTML: (element) => element.getAttribute("data-highlight") || element.style.backgroundColor || "#fff59d",
        renderHTML: (attributes) => ({
          "data-highlight": attributes.color || "#fff59d",
          style: `background-color: ${attributes.color || "#fff59d"}`,
        }),
      },
    };
  },
  parseHTML() {
    return [{ tag: "mark" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["mark", mergeAttributes(HTMLAttributes), 0];
  },
});

export const BlockLayout = Extension.create({
  name: "blockLayout",
  addGlobalAttributes() {
    return [
      {
        types: ["paragraph", "heading"],
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element) => element.style.lineHeight || null,
            renderHTML: (attributes) => (attributes.lineHeight ? { style: `line-height: ${attributes.lineHeight}` } : {}),
          },
          indent: {
            default: null,
            parseHTML: (element) => element.style.paddingLeft || null,
            renderHTML: (attributes) => (attributes.indent ? { style: `padding-left: ${attributes.indent}` } : {}),
          },
        },
      },
    ];
  },
});
