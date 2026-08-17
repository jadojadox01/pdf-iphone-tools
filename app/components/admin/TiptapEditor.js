"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { Underline } from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import { Youtube } from "@tiptap/extension-youtube";
import { Callout, FaqItem, ToolCta, ButtonLink } from "@/lib/cms/extensions";
import { emptyDoc } from "@/lib/cms/tiptap";
import { getTools } from "@/lib/tools";

const CaptionedImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: { default: null },
    };
  },
});

export default function TiptapEditor({ value, onChange }) {
  const tools = getTools();
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: false, underline: false }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      CaptionedImage.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder: "Write the guide here. Use headings so a table of contents can be built." }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({ width: 640, height: 360 }),
      Callout,
      FaqItem,
      ToolCta,
      ButtonLink,
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

  if (!editor) return <p className="help">Loading editor…</p>;

  async function uploadImage(file) {
    const body = new FormData();
    body.append("file", file);
    body.append("alt", file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
    const response = await fetch("/api/admin/media", { method: "POST", body });
    const data = await response.json();
    if (!response.ok) {
      window.alert(data.error || "Image upload failed.");
      return;
    }
    editor.chain().focus().setImage({ src: data.media.url, alt: data.media.alt, caption: data.media.caption }).run();
  }

  return (
    <div className="editor">
      <div className="editor-toolbar" role="toolbar" aria-label="Formatting">
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>List</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()}>Quote</button>
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>Code</button>
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()}>—</button>
        <button
          type="button"
          onClick={() => {
            const href = window.prompt("Link URL", "https://");
            if (href) editor.chain().focus().setLink({ href }).run();
          }}
        >
          Link
        </button>
        <label className="toolbar-upload">
          Image
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
          onClick={() => editor.chain().focus().insertContent({ type: "callout", attrs: { variant: "info" }, content: [{ type: "paragraph", content: [{ type: "text", text: "Helpful note" }] }] }).run()}
        >
          Callout
        </button>
        <button
          type="button"
          onClick={() => {
            const question = window.prompt("FAQ question");
            if (!question) return;
            editor.chain().focus().insertContent({
              type: "faqItem",
              attrs: { question },
              content: [{ type: "paragraph", content: [{ type: "text", text: "Answer" }] }],
            }).run();
          }}
        >
          FAQ
        </button>
        <select
          aria-label="Insert tool recommendation"
          defaultValue=""
          onChange={(event) => {
            if (!event.target.value) return;
            editor.chain().focus().insertContent({ type: "toolCta", attrs: { toolSlug: event.target.value } }).run();
            event.target.value = "";
          }}
        >
          <option value="">Tool CTA</option>
          {tools.map((tool) => (
            <option key={tool.slug} value={tool.slug}>
              {tool.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => {
            const href = window.prompt("Button URL", "/pdf-to-word");
            const label = window.prompt("Button label", "Open tool");
            if (href && label) editor.chain().focus().insertContent({ type: "buttonLink", attrs: { href, label } }).run();
          }}
        >
          Button
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
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
