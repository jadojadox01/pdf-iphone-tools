"use client";

import { useState } from "react";
import { Icon } from "./Icons";
import { BRAND, absoluteUrl } from "@/config/brand";
import { formatBytes } from "@/lib/site";
import { downloadLabel, resultHeadline } from "@/lib/pdf/result-copy";
import { toolPath } from "@/lib/paths";

export default function ToolResult({ tool, result, onDownload, onReset }) {
  const [copied, setCopied] = useState(false);
  const meta = result.meta || {};
  const shareUrl = typeof window !== "undefined" ? window.location.href : absoluteUrl(toolPath(tool.slug));
  const shareText = `${BRAND.name} — ${BRAND.tagline}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`${shareText} ${shareUrl}`);

  let sizeNote = null;
  if (typeof meta.originalSize === "number") {
    sizeNote = meta.increased
      ? `Compression did not reduce the file. Original ${formatBytes(meta.originalSize)} → ${formatBytes(meta.compressedSize)}.`
      : `Original ${formatBytes(meta.originalSize)} → ${formatBytes(meta.compressedSize)} (${meta.reduction}% smaller).`;
  }

  async function shareNative() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: BRAND.name, text: shareText, url: shareUrl });
        return;
      } catch {
        /* user cancelled or share failed; fall through to copy */
      }
    }
    await copyLink();
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="tool-result">
      <div className="tool-result-check" aria-hidden="true">
        <Icon name="check" size={36} />
      </div>
      <h2>{resultHeadline(tool)}</h2>
      <p className="tool-result-file">
        {result.filename}
        <span>
          {result.blob?.type || result.mime} · {formatBytes(result.blob.size)}
        </span>
      </p>
      {sizeNote ? <p className="help">{sizeNote}</p> : null}
      {meta.note ? <p className="help">{meta.note}</p> : null}

      <div className="tool-result-actions">
        <button type="button" className="btn btn-primary btn-full" onClick={onDownload}>
          <Icon name="download" size={18} />
          {downloadLabel(tool, result)}
        </button>
        <button type="button" className="btn btn-secondary btn-full" onClick={onReset}>
          Process another file
        </button>
      </div>

      <div className="tool-result-share">
        <p className="tool-result-slogan">{BRAND.tagline}</p>
        <p className="help">If this saved you time, share the tool.</p>
        <div className="tool-share-row">
          <button type="button" className="tool-share-btn" onClick={shareNative}>
            Share
          </button>
          <a className="tool-share-btn" href={`https://wa.me/?text=${encodedText}`} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" size={16} />
            WhatsApp
          </a>
          <a className="tool-share-btn" href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer">
            <Icon name="facebook" size={16} />
            Facebook
          </a>
          <a className="tool-share-btn" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodedUrl}`} target="_blank" rel="noopener noreferrer">
            <Icon name="x" size={16} />
            X
          </a>
          <a
            className="tool-share-btn"
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodeURIComponent(BRAND.name)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="linkedin" size={16} />
            LinkedIn
          </a>
          <button type="button" className="tool-share-btn" onClick={copyLink}>
            {copied ? "Link copied" : "Copy link"}
          </button>
        </div>
      </div>
    </div>
  );
}
