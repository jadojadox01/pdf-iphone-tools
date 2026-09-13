import Link from "next/link";
import { extractFaqs, extractText, slugFromHeading } from "./tiptap";
import { isSameGuideText, stripLeadingTitle } from "./article-display";
import { getTool } from "@/lib/tools";

export function GuideBody({ doc, title, className = "article-body" }) {
  if (!doc) return null;
  const ids = new Map();
  const content = prepareArticleNodes(doc.content || [], title);
  const nodes = renderNodes(content, ids);
  if (!className) return nodes;
  return <div className={className}>{nodes}</div>;
}

function prepareArticleNodes(nodes, title) {
  const heading = String(title || "").trim();
  return (nodes || []).flatMap((node) => {
    if (!node) return [];
    const text = extractText(node).replace(/\s+/g, " ").trim();
    if ((node.type === "heading" || node.type === "paragraph" || node.type === "blockquote") && heading && isSameGuideText(text, heading)) {
      return [];
    }
    if ((node.type === "blockquote" || node.type === "heading") && heading && text.toLowerCase().startsWith(heading.toLowerCase()) && text.length > heading.length) {
      const rest = stripLeadingTitle(text, heading);
      if (!rest) return [];
      return [{ type: "paragraph", content: [{ type: "text", text: rest }] }];
    }
    return [node];
  });
}

function headingId(node, ids) {
  const text = extractText(node).trim();
  let id = node.attrs?.id || slugFromHeading(text);
  const base = id;
  let n = 2;
  while (ids.has(id)) {
    id = `${base}-${n}`;
    n += 1;
  }
  ids.set(id, true);
  return id;
}

function renderNodes(nodes, ids) {
  return (nodes || []).map((node, index) => renderNode(node, index, ids));
}

function renderNode(node, index, ids) {
  if (!node) return null;
  if (node.type === "text") {
    let content = node.text || "";
    (node.marks || []).forEach((mark) => {
      if (mark.type === "bold") content = <strong key="b">{content}</strong>;
      if (mark.type === "italic") content = <em key="i">{content}</em>;
      if (mark.type === "underline") content = <u key="u">{content}</u>;
      if (mark.type === "code") content = <code key="c">{content}</code>;
      if (mark.type === "link") {
        const href = safeHref(mark.attrs?.href);
        if (!href) return;
        const internal = href.startsWith("/");
        content = internal ? (
          <Link key="a" href={href} className="guide-backlink">
            {content}
          </Link>
        ) : (
          <a key="a" href={href} className="guide-extlink" rel="noopener noreferrer">
            {content}
          </a>
        );
      }
    });
    return <span key={index}>{content}</span>;
  }

  const children = renderNodes(node.content, ids);
  switch (node.type) {
    case "paragraph":
      return <p key={index}>{children}</p>;
    case "heading": {
      const level = Math.min(4, Math.max(2, node.attrs?.level || 2));
      const Tag = `h${level}`;
      return (
        <Tag key={index} id={headingId(node, ids || new Map())}>
          {children}
        </Tag>
      );
    }
    case "bulletList":
      return <ul key={index}>{children}</ul>;
    case "orderedList":
      return <ol key={index}>{children}</ol>;
    case "listItem":
      return <li key={index}>{children}</li>;
    case "blockquote":
      return <blockquote key={index}>{children}</blockquote>;
    case "codeBlock":
      return (
        <pre key={index}>
          <code>{extractText(node)}</code>
        </pre>
      );
    case "horizontalRule":
      return <hr key={index} />;
    case "image": {
      const src = safeImageSrc(node.attrs?.src);
      if (!src) return null;
      return (
        <figure key={index} className={`article-figure article-figure-${node.attrs?.textAlign || "left"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={node.attrs?.alt || ""}
            width={node.attrs?.width || undefined}
            height={node.attrs?.height || undefined}
            style={node.attrs?.width ? { width: `${node.attrs.width}px`, height: "auto" } : undefined}
          />
          {node.attrs?.caption ? <figcaption>{node.attrs.caption}</figcaption> : null}
        </figure>
      );
    }
    case "table":
      return (
        <div key={index} className="table-wrap">
          <table>{children}</table>
        </div>
      );
    case "tableRow":
      return <tr key={index}>{children}</tr>;
    case "tableHeader":
      return <th key={index}>{children}</th>;
    case "tableCell":
      return <td key={index}>{children}</td>;
    case "youtube":
      return node.attrs?.src ? (
        <div key={index} className="video-wrap">
          <iframe
            src={safeYoutube(node.attrs.src)}
            title="Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : null;
    case "callout":
      return (
        <aside key={index} className={`callout callout-${node.attrs?.variant || "info"}`}>
          {children}
        </aside>
      );
    case "faqItem":
      return (
        <details key={index} className="guide-faq-item">
          <summary>
            <span className="guide-faq-q">{node.attrs?.question || "Question"}</span>
          </summary>
          <div className="guide-faq-a">{children}</div>
        </details>
      );
    case "toolCta": {
      const tool = getTool(node.attrs?.toolSlug);
      if (!tool) return null;
      return (
        <aside key={index} className="tool-cta">
          <h3>Try the tool</h3>
          <p>{tool.intro}</p>
          <Link className="btn btn-primary" href={`/${tool.slug}`}>
            {tool.cta}
          </Link>
        </aside>
      );
    }
    case "buttonLink": {
      const href = safeHref(node.attrs?.href);
      return href ? (
        <p key={index}>
          <Link className="btn btn-secondary" href={href}>
            {node.attrs.label || "Open"}
          </Link>
        </p>
      ) : null;
    }
    default:
      return <div key={index}>{children}</div>;
  }
}

function safeHref(href) {
  const value = String(href || "");
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:") return value;
  } catch {
    return "";
  }
  return "";
}

function safeImageSrc(src) {
  const value = String(src || "");
  if (value.startsWith("/api/media/") || value.startsWith("/media/")) return value;
  if (/^https?:\/\//i.test(value)) return value;
  return "";
}

function safeYoutube(src) {
  try {
    const url = new URL(src, "https://www.youtube.com");
    const host = url.hostname.replace(/^www\./, "");
    if (!/^(youtube\.com|youtu\.be|youtube-nocookie\.com)$/.test(host)) return "";
    let id = url.searchParams.get("v");
    if (!id && host === "youtu.be") id = url.pathname.replace(/^\//, "");
    if (!id && url.pathname.includes("/embed/")) id = url.pathname.split("/embed/")[1];
    if (!id) return "";
    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id.split("/")[0])}`;
  } catch {
    return "";
  }
}

export function faqsFromDoc(doc) {
  return extractFaqs(doc);
}
