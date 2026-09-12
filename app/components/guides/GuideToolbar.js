"use client";

import { useEffect, useState } from "react";
import { Icon } from "../Icons";

const inflight = new Map();

export default function GuideToolbar({ slug, title, url, readMinutes, initialViews = 0 }) {
  const [views, setViews] = useState(initialViews);
  const shareUrl = encodeURIComponent(url);
  const shareText = encodeURIComponent(title);

  useEffect(() => {
    if (!slug) return undefined;
    let cancelled = false;
    const seenKey = `pdfflow-gv-${slug}`;
    let already = false;
    try {
      already = window.localStorage.getItem(seenKey) === "1";
    } catch {
      already = false;
    }
    const pending =
      inflight.get(slug) ||
      (already
        ? fetch(`/api/guides/view?slug=${encodeURIComponent(slug)}`).then((response) =>
            response.ok ? response.json() : null,
          )
        : fetch("/api/guides/view", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug }),
          }).then((response) => {
            if (!response.ok) return null;
            try {
              window.localStorage.setItem(seenKey, "1");
            } catch {
              /* private mode */
            }
            return response.json();
          })
      ).finally(() => inflight.delete(slug));
    inflight.set(slug, pending);
    pending
      .then((data) => {
        if (!cancelled && data && Number.isFinite(Number(data.views))) setViews(Number(data.views));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <>
      <div className="guide-share" aria-label="Share this guide">
        <a
          className="guide-share-btn is-facebook"
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
        >
          <Icon name="facebook" size={16} />
        </a>
        <a
          className="guide-share-btn is-linkedin"
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
        >
          <Icon name="linkedin" size={16} />
        </a>
        <a
          className="guide-share-btn is-x"
          href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
        >
          <Icon name="x" size={16} />
        </a>
      </div>
      <p className="guide-byline">
        <span>
          <Icon name="clock" size={16} />
          {readMinutes} min read
        </span>
        <span>
          <Icon name="eye" size={16} />
          {views === 1 ? "1 person viewed" : `${Number(views).toLocaleString()} people viewed`}
        </span>
      </p>
    </>
  );
}
