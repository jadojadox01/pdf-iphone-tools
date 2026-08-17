import Link from "next/link";
import { extractFaqs, extractText, slugFromHeading } from "./tiptap";
import { getTool } from "@/lib/tools";

export function GuideBody({ doc }) {
  if (!doc) return null;
  return <div className="article-body">{renderNodes(doc.content || [])}</div>;
}

function renderNodes(nodes) {
  return (nodes || []).map((node, index) => renderNode(node, index));
}

function renderNode(node, index) {
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
          <Link key="a" href={href}>
            {content}
          </Link>
        ) : (
          <a key="a" href={href} rel="noopener noreferrer">
            {content}
          </a>
        );
      }
    });
    return <span key={index}>{content}</span>;
  }

  const children = renderNodes(node.content);
  switch (node.type) {
    case "paragraph":
      return <p key={index}>{children}</p>;
    case "heading": {
      const level = Math.min(4, Math.max(2, node.attrs?.level || 2));
      const Tag = `h${level}`;
      const id = node.attrs?.id || slugFromHeading(extractText(node));
      return (
        <Tag key={index} id={id}>
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
        <figure key={index} className="article-figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={node.attrs?.alt || ""} />
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
        <details key={index} className="article-faq">
          <summary>{node.attrs?.question || "Question"}</summary>
          <div>{children}</div>
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
  if (value.startsWith("/api/media/")) return value;
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
