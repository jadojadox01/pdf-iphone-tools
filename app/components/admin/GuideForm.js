"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import TiptapEditor from "./TiptapEditor";
import MediaPicker from "./MediaPicker";
import { emptyDoc, parseDoc } from "@/lib/cms/tiptap";
import { getTools } from "@/lib/tools";
import { SITE_URL } from "@/lib/site";

const defaultGuide = {
  title: "",
  slug: "",
  excerpt: "",
  contentJson: emptyDoc(),
  status: "draft",
  featured: false,
  scheduledAt: "",
  seoTitle: "",
  seoDescription: "",
  canonicalUrl: "",
  robots: "index,follow",
  focusTopic: "",
  featuredImageId: "",
  ogImageId: "",
  authorId: "",
  categoryId: "",
  tags: [],
  relatedTools: [],
  relatedGuideIds: [],
};

export default function GuideForm({ guideId }) {
  const router = useRouter();
  const tools = getTools();
  const [guide, setGuide] = useState(defaultGuide);
  const [meta, setMeta] = useState({ authors: [], categories: [], guides: [] });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("content");
  const [revisions, setRevisions] = useState([]);

  useEffect(() => {
    fetch("/api/admin/meta")
      .then((response) => response.json())
      .then((data) => setMeta(data));
  }, []);

  useEffect(() => {
    if (!guideId) return;
    fetch(`/api/admin/guides/${guideId}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.guide) {
          setError("Guide not found.");
          return;
        }
        setGuide({
          ...defaultGuide,
          ...data.guide,
          contentJson: parseDoc(data.guide.contentJson),
          scheduledAt: data.guide.scheduledAt ? data.guide.scheduledAt.slice(0, 16) : "",
          tags: data.guide.tags || [],
          relatedTools: data.guide.relatedTools || [],
          relatedGuideIds: data.guide.relatedGuideIds || [],
        });
        setRevisions(data.guide.revisions || []);
      });
  }, [guideId]);

  function update(key, value) {
    setGuide((current) => ({ ...current, [key]: value }));
  }

  const warnings = useMemo(() => {
    const list = [];
    if (!guide.title.trim()) list.push("Add a title.");
    if (!guide.excerpt.trim()) list.push("Add an excerpt.");
    if (!guide.categoryId) list.push("Select a category.");
    if (!guide.authorId) list.push("Select an author.");
    if (!guide.seoTitle.trim()) list.push("Add an SEO title.");
    if (!guide.seoDescription.trim()) list.push("Add a meta description.");
    const text = JSON.stringify(guide.contentJson);
    if (text.length < 80) list.push("The main content looks too short.");
    if (guide.featuredImageId && !guide.excerpt) list.push("Featured image is set; add alt text in Media if needed.");
    return list;
  }, [guide]);

  async function save(status) {
    setBusy(true);
    setError("");
    const payload = {
      ...guide,
      status: status || guide.status,
      tags: Array.isArray(guide.tags) ? guide.tags : String(guide.tags).split(",").map((item) => item.trim()).filter(Boolean),
      scheduledAt: guide.scheduledAt || null,
    };
    if (status === "published" && !guide.publishedAt) payload.publishedAt = new Date().toISOString();
    const response = await fetch(guideId ? `/api/admin/guides/${guideId}` : "/api/admin/guides", {
      method: guideId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) {
      setError(data.error || "Save failed.");
      return;
    }
    if (!guideId && data.guide?.id) {
      router.replace(`/admin/guides/${data.guide.id}`);
      return;
    }
    router.push("/admin/guides");
    router.refresh();
  }

  const seoTitle = guide.seoTitle || guide.title || "Untitled guide";
  const seoDesc = guide.seoDescription || guide.excerpt;
  const url = `${SITE_URL}/guides/${guide.slug || "your-slug"}`;

  return (
    <div>
      <div className="admin-tabs">
        {["content", "related", "seo", "publish"].map((item) => (
          <button key={item} type="button" className={tab === item ? "active" : ""} onClick={() => setTab(item)}>
            {item}
          </button>
        ))}
      </div>

      {tab === "content" && (
        <div className="workspace">
          <label className="field">
            Title
            <input value={guide.title} onChange={(event) => update("title", event.target.value)} />
          </label>
          <label className="field">
            Slug
            <input value={guide.slug} onChange={(event) => update("slug", event.target.value)} />
          </label>
          <label className="field">
            Excerpt
            <textarea value={guide.excerpt} onChange={(event) => update("excerpt", event.target.value)} />
          </label>
          <div className="field">
            <span>Article</span>
            <TiptapEditor value={guide.contentJson} onChange={(value) => update("contentJson", value)} />
          </div>
        </div>
      )}

      {tab === "related" && (
        <div className="workspace">
          <label className="field">
            Category
            <select value={guide.categoryId || ""} onChange={(event) => update("categoryId", event.target.value)}>
              <option value="">Select</option>
              {meta.categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Author
            <select value={guide.authorId || ""} onChange={(event) => update("authorId", event.target.value)}>
              <option value="">Select</option>
              {meta.authors.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Tags (comma separated)
            <input
              value={Array.isArray(guide.tags) ? guide.tags.join(", ") : guide.tags}
              onChange={(event) => update("tags", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))}
            />
          </label>
          <fieldset className="field">
            <legend>Related PDF tools</legend>
            {tools.map((tool) => (
              <label key={tool.slug}>
                <input
                  type="checkbox"
                  checked={guide.relatedTools.includes(tool.slug)}
                  onChange={(event) => {
                    const next = event.target.checked
                      ? [...guide.relatedTools, tool.slug]
                      : guide.relatedTools.filter((item) => item !== tool.slug);
                    update("relatedTools", next);
                  }}
                />{" "}
                {tool.name}
              </label>
            ))}
          </fieldset>
          <fieldset className="field">
            <legend>Related guides</legend>
            {meta.guides
              .filter((item) => item.id !== guideId)
              .map((item) => (
                <label key={item.id}>
                  <input
                    type="checkbox"
                    checked={guide.relatedGuideIds.includes(item.id)}
                    onChange={(event) => {
                      const next = event.target.checked
                        ? [...guide.relatedGuideIds, item.id]
                        : guide.relatedGuideIds.filter((id) => id !== item.id);
                      update("relatedGuideIds", next);
                    }}
                  />{" "}
                  {item.title}
                </label>
              ))}
          </fieldset>
        </div>
      )}

      {tab === "seo" && (
        <div className="workspace">
          <label className="field">
            SEO title ({(guide.seoTitle || "").length}/60 recommended)
            <input value={guide.seoTitle} onChange={(event) => update("seoTitle", event.target.value)} />
          </label>
          <label className="field">
            Meta description ({(guide.seoDescription || "").length}/160)
            <textarea value={guide.seoDescription} onChange={(event) => update("seoDescription", event.target.value.slice(0, 170))} />
          </label>
          <label className="field">
            Focus topic (editorial only)
            <input value={guide.focusTopic} onChange={(event) => update("focusTopic", event.target.value)} />
          </label>
          <label className="field">
            Canonical URL (optional)
            <input value={guide.canonicalUrl} onChange={(event) => update("canonicalUrl", event.target.value)} />
          </label>
          <label className="field">
            Robots
            <select value={guide.robots} onChange={(event) => update("robots", event.target.value)}>
              <option value="index,follow">index, follow</option>
              <option value="noindex,follow">noindex, follow</option>
              <option value="noindex,nofollow">noindex, nofollow</option>
            </select>
          </label>
          <MediaPicker label="Featured image" value={guide.featuredImageId} onChange={(value) => update("featuredImageId", value)} />
          <MediaPicker label="OG image" value={guide.ogImageId} onChange={(value) => update("ogImageId", value)} />
          <div className="seo-preview">
            <strong>Search preview</strong>
            <p className="help">Editorial only. This does not guarantee how Google will show the page.</p>
            <div className="google-preview">
              <div className="gp-url">{url}</div>
              <div className="gp-title">{seoTitle}</div>
              <div className="gp-desc">{seoDesc}</div>
            </div>
          </div>
        </div>
      )}

      {tab === "publish" && (
        <div className="workspace">
          <label>
            <input type="checkbox" checked={guide.featured} onChange={(event) => update("featured", event.target.checked)} /> Featured
          </label>
          <label className="field">
            Schedule for
            <input type="datetime-local" value={guide.scheduledAt || ""} onChange={(event) => update("scheduledAt", event.target.value)} />
          </label>
          <h3>Before publishing</h3>
          {warnings.length ? (
            <ul>
              {warnings.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="help">Required editorial fields look complete.</p>
          )}
          {guideId && (
            <p>
              <a className="btn btn-secondary" href={`/admin/guides/${guideId}/preview`} target="_blank" rel="noreferrer">
                Preview public layout
              </a>
            </p>
          )}
          {revisions.length > 0 && (
            <div>
              <h3>Revisions</h3>
              <p className="help">Restoring replaces the current title, excerpt, and article body with that saved version.</p>
              <ul>
                {revisions.map((item) => (
                  <li key={item.id}>
                    {new Date(item.createdAt).toLocaleString()} — {item.title}{" "}
                    <button
                      type="button"
                      onClick={async () => {
                        if (!window.confirm("Restore this revision?")) return;
                        await fetch(`/api/admin/guides/${guideId}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ action: "restore-revision", revisionId: item.id }),
                        });
                        window.location.reload();
                      }}
                    >
                      Restore
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}
      <div className="sticky-actions" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => save("draft")}>
          Save draft
        </button>
        <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => save("scheduled")}>
          Schedule
        </button>
        <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => save("unpublished")}>
          Unpublish
        </button>
        <button type="button" className="btn btn-primary" disabled={busy} onClick={() => save("published")}>
          Publish
        </button>
      </div>
    </div>
  );
}
