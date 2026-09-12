"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { Underline } from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import { Youtube } from "@tiptap/extension-youtube";
import { TextAlign } from "@tiptap/extension-text-align";
import { NodeSelection, TextSelection } from "@tiptap/pm/state";
import { Callout, FaqItem, ToolCta, ButtonLink, Example, ProsCons, Diagram, Sources } from "@/lib/cms/extensions";
import { WordText, HighlightMark, BlockLayout } from "@/lib/cms/word-marks";
import { emptyDoc } from "@/lib/cms/tiptap";
import { getTools } from "@/lib/tools";
import { uploadAdminMedia } from "@/lib/prepare-media-upload";

const CaptionedImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: { default: null },
      annotation: { default: null },
      credit: { default: null },
      wrap: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-wrap") || null,
        renderHTML: (attributes) => (attributes.wrap ? { "data-wrap": attributes.wrap } : {}),
      },
    };
  },
  addNodeView() {
    const create = this.parent?.();
    return (props) => {
      const view = typeof create === "function" ? create(props) : null;
      if (!view?.dom) return view;
      const applyMove = (node) => {
        view.dom.draggable = true;
        view.dom.style.cursor = "grab";
        if (node?.attrs?.wrap) view.dom.dataset.wrap = node.attrs.wrap;
        else delete view.dom.dataset.wrap;
        view.dom.querySelectorAll("[data-resize-handle]").forEach((handle) => {
          handle.setAttribute("draggable", "false");
        });
      };
      applyMove(props.node);
      const originalUpdate = view.update?.bind(view);
      view.update = (node, decorations, innerDecorations) => {
        const ok = originalUpdate ? originalUpdate(node, decorations, innerDecorations) : true;
        if (ok !== false) applyMove(node);
        return ok;
      };
      return view;
    };
  },
});

const TABS = [
  { id: "home", label: "Home" },
  { id: "insert", label: "Insert" },
  { id: "layout", label: "Layout" },
  { id: "view", label: "View" },
];

const FONT_FAMILIES = [
  { value: "Calibri, 'Segoe UI', sans-serif", label: "Calibri" },
  { value: "Arial, Helvetica, sans-serif", label: "Arial" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "'Times New Roman', Times, serif", label: "Times New Roman" },
  { value: "Verdana, sans-serif", label: "Verdana" },
  { value: "'Courier New', Courier, monospace", label: "Courier New" },
];

const FONT_SIZES = ["12px", "14px", "16px", "18px", "24px", "32px"];

export default function TiptapEditor({ value, onChange }) {
  const tools = getTools();
  const [tab, setTab] = useState("home");
  const [full, setFull] = useState(false);
  const [ribbonOpen, setRibbonOpen] = useState(true);
  const [, setTick] = useState(0);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: false,
        underline: false,
        dropcursor: { color: "#185abd", width: 3 },
      }),
      Underline,
      WordText,
      HighlightMark,
      BlockLayout,
      TextAlign.configure({ types: ["heading", "paragraph", "image"] }),
      Link.configure({ openOnClick: false, autolink: true }),
      CaptionedImage.configure({
        inline: false,
        allowBase64: false,
        resize: {
          enabled: true,
          minWidth: 48,
          minHeight: 48,
          alwaysPreserveAspectRatio: true,
        },
      }),
      Placeholder.configure({
        placeholder: "Start typing. Full screen opens a Word-like page. Drag a picture corner or a table column to resize.",
      }),
      Table.configure({ resizable: true, lastColumnResizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({ width: 640, height: 360 }),
      Callout,
      FaqItem,
      ToolCta,
      ButtonLink,
      Example,
      ProsCons,
      Diagram,
      Sources,
    ],
    content: value || emptyDoc(),
    onUpdate: ({ editor: instance }) => onChange(instance.getJSON()),
  });

  useEffect(() => {
    if (!editor || !value) return;
    const current = JSON.stringify(editor.getJSON());
    const next = JSON.stringify(value);
    if (current !== next) editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  useEffect(() => {
    if (!editor) return undefined;
    const refresh = () => setTick((n) => n + 1);
    editor.on("selectionUpdate", refresh);
    editor.on("transaction", refresh);
    return () => {
      editor.off("selectionUpdate", refresh);
      editor.off("transaction", refresh);
    };
  }, [editor]);

  useEffect(() => {
    document.body.classList.toggle("word-writing", full);
    function onKey(event) {
      if (event.key === "Escape") setFull(false);
    }
    if (full) window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("word-writing");
      window.removeEventListener("keydown", onKey);
    };
  }, [full]);

  if (!editor) return <p className="help">Loading editor…</p>;

  async function uploadImage(file) {
    let media;
    try {
      media = await uploadAdminMedia(file);
    } catch (error) {
      window.alert(error?.message || "Image upload failed.");
      return;
    }
    const alt = window.prompt("Alt text — describe what the picture shows", media.alt || "") || media.alt || "";
    const caption = window.prompt("Caption (optional)", media.caption || "") || "";
    const annotation = window.prompt("Label on the picture (optional), e.g. Files → Downloads", "") || "";
    const credit = window.prompt("Source/credit if this is not your screenshot (optional)", "") || "";
    const image = {
      type: "image",
      attrs: {
        src: media.url,
        alt,
        caption,
        annotation,
        credit,
      },
    };
    if (editor.isActive("listItem") || editor.isActive("table")) {
      const insertAt = editor.state.selection.$from.after(1);
      editor.chain().insertContentAt(insertAt, image).run();
      return;
    }
    editor.chain().focus().setImage(image.attrs).run();
  }

  function insertRibbon(variant, sample) {
    editor
      .chain()
      .focus()
      .insertContent({
        type: "callout",
        attrs: { variant },
        content: [{ type: "paragraph", content: [{ type: "text", text: sample }] }],
      })
      .run();
  }

  function exec(command) {
    editor.view.focus();
    document.execCommand(command);
  }

  async function paste() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) editor.chain().focus().insertContent(text).run();
    } catch {
      editor.view.focus();
      document.execCommand("paste");
    }
  }

  function wordAttrs() {
    return editor.getAttributes("wordText") || {};
  }

  function setWord(patch) {
    editor.chain().focus().setMark("wordText", { ...wordAttrs(), ...patch }).run();
  }

  function currentSize() {
    return wordAttrs().fontSize || "16px";
  }

  function currentFamily() {
    return wordAttrs().fontFamily || FONT_FAMILIES[0].value;
  }

  function bumpSize(delta) {
    const index = FONT_SIZES.indexOf(currentSize());
    const next = FONT_SIZES[Math.min(FONT_SIZES.length - 1, Math.max(0, (index < 0 ? 2 : index) + delta))];
    setWord({ fontSize: next });
  }

  function toggleList(kind) {
    const list = {
      type: kind === "ordered" ? "orderedList" : "bulletList",
      content: [{ type: "listItem", content: [{ type: "paragraph" }] }],
    };
    if (kind === "bullet" && editor.can().toggleBulletList()) {
      editor.chain().focus().toggleBulletList().run();
      return;
    }
    if (kind === "ordered" && editor.can().toggleOrderedList()) {
      editor.chain().focus().toggleOrderedList().run();
      return;
    }
    const { selection } = editor.state;
    if (selection.node) {
      editor.chain().insertContentAt(selection.to, list).focus().run();
      return;
    }
    editor.chain().focus().insertContent(list).run();
  }

  function selectedBlockRange() {
    const { selection } = editor.state;
    if (selection.node) {
      return { pos: selection.from, node: selection.node };
    }
    const $from = selection.$from;
    if ($from.nodeAfter?.type.name === "image") {
      return { pos: $from.pos, node: $from.nodeAfter };
    }
    if ($from.nodeBefore?.type.name === "image") {
      return { pos: $from.pos - $from.nodeBefore.nodeSize, node: $from.nodeBefore };
    }
    const blockDepth = $from.depth >= 1 ? 1 : Math.max(1, $from.depth);
    return {
      pos: $from.before(blockDepth),
      node: $from.node(blockDepth),
    };
  }

  function moveBlock(direction) {
    const { pos, node } = selectedBlockRange();
    if (!node || node.type.name === "doc") return;
    const size = node.nodeSize;
    const neighbor =
      direction < 0 ? editor.state.doc.resolve(pos).nodeBefore : editor.state.doc.resolve(pos + size).nodeAfter;
    if (!neighbor) return;
    editor
      .chain()
      .command(({ tr }) => {
        tr.delete(pos, pos + size);
        const insertAt = direction < 0 ? pos - neighbor.nodeSize : pos + neighbor.nodeSize;
        tr.insert(insertAt, node);
        try {
          if (node.isLeaf || node.type.name === "image") {
            tr.setSelection(NodeSelection.create(tr.doc, insertAt));
          } else {
            tr.setSelection(TextSelection.near(tr.doc.resolve(insertAt + 1)));
          }
        } catch {
          /* keep cursor where it lands */
        }
        return true;
      })
      .run();
  }

  function setImageWrap(wrap) {
    if (!editor.isActive("image")) {
      window.alert("Click the picture first, then choose a place.");
      return;
    }
    editor.chain().focus().updateAttributes("image", { wrap }).run();
  }

  function indent(direction) {
    if (editor.isActive("listItem")) {
      if (direction > 0) editor.chain().focus().sinkListItem("listItem").run();
      else editor.chain().focus().liftListItem("listItem").run();
      return;
    }
    const type = editor.isActive("heading") ? "heading" : "paragraph";
    const current = Number.parseInt(editor.getAttributes(type).indent || "0", 10);
    const next = Math.max(0, (Number.isFinite(current) ? current : 0) + direction * 24);
    editor.chain().focus().updateAttributes(type, { indent: next ? `${next}px` : null }).run();
  }

  function on(kind, attrs) {
    return editor.isActive(kind, attrs) ? "is-active" : "";
  }

  const styleValue = editor.isActive("heading", { level: 2 })
    ? "h2"
    : editor.isActive("heading", { level: 3 })
      ? "h3"
      : editor.isActive("blockquote")
        ? "quote"
        : "p";

  return (
    <div className={`word-editor${full ? " is-full" : ""}`}>
      <div className="word-ribbon">
        <div className="word-ribbon-tabs" role="tablist" aria-label="Editor ribbon">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              className={tab === item.id ? "active" : ""}
              onClick={() => {
                setTab(item.id);
                setRibbonOpen(true);
              }}
            >
              {item.label}
            </button>
          ))}
          <div className="word-ribbon-end">
            <button type="button" title={ribbonOpen ? "Collapse ribbon" : "Show ribbon"} onClick={() => setRibbonOpen((open) => !open)}>
              {ribbonOpen ? "▴" : "▾"}
            </button>
            <button type="button" className={full ? "is-active" : ""} onClick={() => setFull((value) => !value)}>
              {full ? "Exit full screen" : "Full screen"}
            </button>
          </div>
        </div>

        {ribbonOpen && tab === "home" && (
          <div className="word-ribbon-body">
            <RibbonGroup label="Clipboard">
              <button type="button" className="word-ribbon-big" onClick={paste}>
                Paste
              </button>
              <div className="word-ribbon-stack">
                <button type="button" onClick={() => exec("cut")}>
                  Cut
                </button>
                <button type="button" onClick={() => exec("copy")}>
                  Copy
                </button>
              </div>
            </RibbonGroup>
            <RibbonGroup label="Font">
              <select aria-label="Font" value={currentFamily()} onChange={(event) => setWord({ fontFamily: event.target.value })}>
                {FONT_FAMILIES.map((font) => (
                  <option key={font.label} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
              <select aria-label="Font size" value={currentSize()} onChange={(event) => setWord({ fontSize: event.target.value })}>
                {FONT_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size.replace("px", "")}
                  </option>
                ))}
              </select>
              <button type="button" title="Grow font" onClick={() => bumpSize(1)}>
                A+
              </button>
              <button type="button" title="Shrink font" onClick={() => bumpSize(-1)}>
                A−
              </button>
              <button type="button" className={on("bold")} title="Bold" onClick={() => editor.chain().focus().toggleBold().run()}>
                <strong>B</strong>
              </button>
              <button type="button" className={on("italic")} title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()}>
                <em>I</em>
              </button>
              <button type="button" className={on("underline")} title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()}>
                <u>U</u>
              </button>
              <button type="button" className={on("strike")} title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()}>
                <s>ab</s>
              </button>
              <button type="button" className={on("highlightMark")} title="Highlight" onClick={() => editor.chain().focus().toggleMark("highlightMark").run()}>
                ab
              </button>
              <label className="word-color" title="Font color">
                A
                <input type="color" value={wordAttrs().color || "#111111"} onChange={(event) => setWord({ color: event.target.value })} />
              </label>
            </RibbonGroup>
            <RibbonGroup label="Paragraph">
              <button type="button" className={on("bulletList")} title="Bullets" onClick={() => toggleList("bullet")}>
                • Bullets
              </button>
              <button type="button" className={on("orderedList")} title="Numbering" onClick={() => toggleList("ordered")}>
                1. Numbering
              </button>
              <button type="button" title="Decrease indent" onClick={() => indent(-1)}>
                ⇤
              </button>
              <button type="button" title="Increase indent" onClick={() => indent(1)}>
                ⇥
              </button>
              <button type="button" className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""} title="Align left" onClick={() => editor.chain().focus().setTextAlign("left").run()}>
                ≡
              </button>
              <button type="button" className={editor.isActive({ textAlign: "center" }) ? "is-active" : ""} title="Center" onClick={() => editor.chain().focus().setTextAlign("center").run()}>
                ≣
              </button>
              <button type="button" className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""} title="Align right" onClick={() => editor.chain().focus().setTextAlign("right").run()}>
                ≡
              </button>
              <button type="button" className={editor.isActive({ textAlign: "justify" }) ? "is-active" : ""} title="Justify" onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
                ☰
              </button>
              <select
                aria-label="Line spacing"
                defaultValue=""
                onChange={(event) => {
                  if (!event.target.value) return;
                  const type = editor.isActive("heading") ? "heading" : "paragraph";
                  editor.chain().focus().updateAttributes(type, { lineHeight: event.target.value }).run();
                  event.target.value = "";
                }}
              >
                <option value="">Line spacing</option>
                <option value="1">1.0</option>
                <option value="1.15">1.15</option>
                <option value="1.5">1.5</option>
                <option value="2">2.0</option>
              </select>
            </RibbonGroup>
            <RibbonGroup label="Styles">
              <button type="button" className={`word-style${styleValue === "p" ? " is-active" : ""}`} onClick={() => editor.chain().focus().setParagraph().run()}>
                <span className="word-style-preview">AaBbCcDd</span>
                Normal
              </button>
              <button type="button" className={`word-style${styleValue === "h2" ? " is-active" : ""}`} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                <span className="word-style-preview word-style-h2">Heading 2</span>
                Heading 2
              </button>
              <button type="button" className={`word-style${styleValue === "h3" ? " is-active" : ""}`} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                <span className="word-style-preview word-style-h3">Heading 3</span>
                Heading 3
              </button>
              <button type="button" className={`word-style${styleValue === "quote" ? " is-active" : ""}`} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                <span className="word-style-preview word-style-quote">Quote</span>
                Quote
              </button>
            </RibbonGroup>
          </div>
        )}

        {ribbonOpen && tab === "insert" && (
          <div className="word-ribbon-body">
            <RibbonGroup label="Illustrations">
              <label className="toolbar-upload word-ribbon-big">
                Pictures
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  hidden
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) uploadImage(file);
                    event.target.value = "";
                  }}
                />
              </label>
              <button type="button" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
                Table
              </button>
              <button
                type="button"
                onClick={() => {
                  const src = window.prompt("YouTube URL");
                  if (src) editor.chain().focus().setYoutubeVideo({ src }).run();
                }}
              >
                Video
              </button>
            </RibbonGroup>
            <RibbonGroup label="Links">
              <button
                type="button"
                onClick={() => {
                  const href = window.prompt("Link URL", "https://");
                  if (href) editor.chain().focus().setLink({ href }).run();
                }}
              >
                Link
              </button>
              <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                Line
              </button>
              <button
                type="button"
                onClick={() => {
                  const href = window.prompt("Button URL", "/tools/pdf-to-word");
                  const label = window.prompt("Button label", "Open tool");
                  if (href && label) editor.chain().focus().insertContent({ type: "buttonLink", attrs: { href, label } }).run();
                }}
              >
                Button
              </button>
            </RibbonGroup>
            <RibbonGroup label="Ribbons">
              <button type="button" onClick={() => insertRibbon("tip", "Tip: keep the original file until you have checked the result.")}>
                Tip
              </button>
              <button type="button" onClick={() => insertRibbon("important", "Important: this step is easy to miss.")}>
                Important
              </button>
              <button type="button" onClick={() => insertRibbon("warning", "Warning: if you skip this, the download may fail.")}>
                Warning
              </button>
              <button type="button" onClick={() => insertRibbon("info", "Note: processing stays in this browser tab.")}>
                Note
              </button>
            </RibbonGroup>
            <RibbonGroup label="Guides">
              <button
                type="button"
                onClick={() => {
                  const question = window.prompt("FAQ question");
                  if (!question) return;
                  editor
                    .chain()
                    .focus()
                    .insertContent({
                      type: "faqItem",
                      attrs: { question },
                      content: [{ type: "paragraph", content: [{ type: "text", text: "Answer" }] }],
                    })
                    .run();
                }}
              >
                FAQ
              </button>
              <select
                aria-label="Insert tool"
                defaultValue=""
                onChange={(event) => {
                  if (!event.target.value) return;
                  editor.chain().focus().insertContent({ type: "toolCta", attrs: { toolSlug: event.target.value } }).run();
                  event.target.value = "";
                }}
              >
                <option value="">Tool card</option>
                {tools.map((tool) => (
                  <option key={tool.slug} value={tool.slug}>
                    {tool.name}
                  </option>
                ))}
              </select>
            </RibbonGroup>
            <RibbonGroup label="Blocks">
              <button
                type="button"
                onClick={() => {
                  const steps = window.prompt("Diagram steps, separated by →", "Choose image → Convert → Download PDF");
                  if (!steps) return;
                  editor.chain().focus().insertContent({ type: "diagram", attrs: { title: "How this works", steps } }).run();
                }}
              >
                Diagram
              </button>
              <button
                type="button"
                onClick={() => {
                  const situation = window.prompt("Example situation", "You have three receipt photos.");
                  if (situation == null) return;
                  editor.chain().focus().insertContent({
                    type: "example",
                    attrs: { title: "Example", situation },
                    content: [{ type: "paragraph", content: [{ type: "text", text: "Result: one PDF you can send." }] }],
                  }).run();
                }}
              >
                Example
              </button>
              <button
                type="button"
                onClick={() => {
                  const pros = window.prompt("Pros, one per line", "Keeps files on the iPhone\nNo extra app");
                  const cons = window.prompt("Cons, one per line", "Safari must stay open\nComplex layouts simplify");
                  if (pros == null) return;
                  editor.chain().focus().insertContent({ type: "prosCons", attrs: { pros: pros || "", cons: cons || "" } }).run();
                }}
              >
                Pros/cons
              </button>
              <button
                type="button"
                onClick={() => {
                  const title = window.prompt("Source title", "Apple Support: Files app");
                  if (!title) return;
                  const url = window.prompt("Source URL", "https://support.apple.com/") || "";
                  const note = window.prompt("Your note (not a copy of their text)", "") || "";
                  editor.chain().focus().insertContent({
                    type: "sources",
                    attrs: { items: JSON.stringify([{ title, url, note }]) },
                  }).run();
                }}
              >
                Source
              </button>
            </RibbonGroup>
          </div>
        )}

        {ribbonOpen && tab === "layout" && (
          <div className="word-ribbon-body">
            <RibbonGroup label="Page">
              <button type="button" className={full ? "is-active" : ""} onClick={() => setFull(true)}>
                Full screen page
              </button>
              <button type="button" onClick={() => setFull(false)}>
                Window
              </button>
            </RibbonGroup>
            <RibbonGroup label="Arrange">
              <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()}>
                Left
              </button>
              <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()}>
                Center
              </button>
              <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()}>
                Right
              </button>
              <button type="button" onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
                Justify
              </button>
            </RibbonGroup>
            <RibbonGroup label="Move">
              <button type="button" onClick={() => moveBlock(-1)}>
                Move up
              </button>
              <button type="button" onClick={() => moveBlock(1)}>
                Move down
              </button>
              <button type="button" onClick={() => setImageWrap("left")}>
                Wrap left
              </button>
              <button type="button" onClick={() => setImageWrap("right")}>
                Wrap right
              </button>
              <button type="button" onClick={() => setImageWrap(null)}>
                In line
              </button>
              <p className="help" style={{ margin: 0, maxWidth: 200 }}>
                Click a picture, then drag it (not a corner) onto the blue line, or use Move up / down.
              </p>
            </RibbonGroup>
            <RibbonGroup label="Picture">
              <button type="button" onClick={() => editor.chain().focus().updateAttributes("image", { width: 240, height: null }).run()}>
                Smaller
              </button>
              <button type="button" onClick={() => editor.chain().focus().updateAttributes("image", { width: 480, height: null }).run()}>
                Medium
              </button>
              <button type="button" onClick={() => editor.chain().focus().updateAttributes("image", { width: 720, height: null }).run()}>
                Large
              </button>
              <p className="help" style={{ margin: 0, maxWidth: 180 }}>
                Drag a corner to resize.
              </p>
            </RibbonGroup>
            <RibbonGroup label="Table">
              <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()}>
                Add column
              </button>
              <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()}>
                Add row
              </button>
              <button type="button" onClick={() => editor.chain().focus().deleteColumn().run()}>
                Delete column
              </button>
              <button type="button" onClick={() => editor.chain().focus().deleteRow().run()}>
                Delete row
              </button>
              <button type="button" onClick={() => editor.chain().focus().deleteTable().run()}>
                Delete table
              </button>
              <p className="help" style={{ margin: 0, maxWidth: 180 }}>
                Drag a column edge to resize.
              </p>
            </RibbonGroup>
          </div>
        )}

        {ribbonOpen && tab === "view" && (
          <div className="word-ribbon-body">
            <RibbonGroup label="Views">
              <button type="button" className={full ? "is-active" : ""} onClick={() => setFull(true)}>
                Full screen
              </button>
              <button type="button" className={!full ? "is-active" : ""} onClick={() => setFull(false)}>
                Page width
              </button>
            </RibbonGroup>
            <RibbonGroup label="Show">
              <button type="button" className={ribbonOpen ? "is-active" : ""} onClick={() => setRibbonOpen(true)}>
                Ribbon
              </button>
              <button type="button" onClick={() => setRibbonOpen(false)}>
                Collapse ribbon
              </button>
            </RibbonGroup>
            <p className="help" style={{ alignSelf: "center", padding: "0 12px" }}>
              Esc exits full screen. Drag the page bottom when not full screen to make the writing area taller.
            </p>
          </div>
        )}
      </div>
      <div className="word-paper-wrap">
        <EditorContent editor={editor} className="word-canvas" />
      </div>
    </div>
  );
}

function RibbonGroup({ label, children }) {
  return (
    <div className="word-ribbon-group">
      <div className="word-ribbon-controls">{children}</div>
      <span className="word-ribbon-label">{label}</span>
    </div>
  );
}
