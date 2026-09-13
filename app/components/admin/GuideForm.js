"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import MediaPicker from "./MediaPicker";
import TiptapEditor from "./TiptapEditor";
import { parseBlocks, planningFromBlocks } from "@/lib/cms/blocks";
import { docFromGuideBlocks } from "@/lib/cms/doc-blocks";
import { emptyDoc } from "@/lib/cms/tiptap";
import { assessGuideQuality, PUBLISH_VALUE_QUESTION } from "@/lib/cms/quality";
import {
  CHECKLIST_ITEMS,
  DEVICE_INTENTS,
  PRIORITIES,
  SEARCH_INTENTS,
  emptyPlanning,
  parsePlanning,
  publishBlockReason,
} from "@/lib/cms/planning";
import { CONTENT_PIPELINE, OWNED_DEVICES, TOOL_GUIDE_SECTIONS } from "@/lib/cms/content-strategy";
import { getCanonicalTopic, getFoldedResearch, TOPIC_ROADMAP } from "@/lib/cms/topics";
import { getTools } from "@/lib/tools";
import { SITE_URL } from "@/lib/site";
import { slugify } from "@/lib/slug";

const defaultGuide = {
  title: "",
  slug: "",
  excerpt: "",
  template: "HOW_TO",
  blocks: [],
  status: "draft",
  featured: false,
  scheduledAt: "",
  seoTitle: "",
  seoDescription: "",
  canonicalUrl: "",
  robots: "noindex,follow",
  focusTopic: "",
  featuredImageId: "",
  ogImageId: "",
  authorId: "",
  categoryId: "",
  deviceId: "",
  tags: [],
  relatedTools: [],
  relatedGuideIds: [],
  planning: emptyPlanning(),
};

export default function GuideForm({ guideId }) {
  const router = useRouter();
  const tools = getTools();
  const [guide, setGuide] = useState(defaultGuide);
  const [doc, setDoc] = useState(emptyDoc());
  const [meta, setMeta] = useState({ authors: [], categories: [], guides: [], devices: [] });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [revisions, setRevisions] = useState([]);
  const [slugLocked, setSlugLocked] = useState(false);
  const [topicId, setTopicId] = useState("");
  const [docReady, setDocReady] = useState(!guideId);
  const [savedNote, setSavedNote] = useState("");
  const editorRef = useRef(null);

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
        const blocks = parseBlocks(data.guide.blocksJson || data.guide.blocks);
        setGuide({
          ...defaultGuide,
          ...data.guide,
          blocks,
          scheduledAt: data.guide.scheduledAt ? data.guide.scheduledAt.slice(0, 16) : "",
          tags: data.guide.tags || [],
          relatedTools: data.guide.relatedTools || [],
          relatedGuideIds: data.guide.relatedGuideIds || [],
          planning: parsePlanning(data.guide.planning || planningFromBlocks(blocks)),
        });
        setDoc(docFromGuideBlocks(blocks));
        setDocReady(true);
        setSlugLocked(Boolean(data.guide.slug) && data.guide.slug !== slugify(data.guide.title || ""));
        setRevisions(data.guide.revisions || []);
      });
  }, [guideId]);

  function update(key, value) {
    setGuide((current) => ({ ...current, [key]: value }));
    if (guideId && (key === "featuredImageId" || key === "ogImageId")) {
      fetch(`/api/admin/guides/${guideId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value || null }),
      }).catch(() => undefined);
    }
  }

  function updatePlanning(key, value) {
    setGuide((current) => ({
      ...current,
      planning: { ...parsePlanning(current.planning), [key]: value },
    }));
  }

  function updateTitle(value) {
    setGuide((current) => ({
      ...current,
      title: value,
      slug: slugLocked ? current.slug : slugify(value),
      seoTitle: current.seoTitle || value,
    }));
  }

  function updateSlug(value) {
    setSlugLocked(true);
    update("slug", slugify(value));
  }

  function updateDoc(next) {
    setDoc(next);
  }

  function applyTopic(id) {
    const topic = getCanonicalTopic(id);
    if (!topic) return;
    setTopicId(id);
    if (!slugLocked && !guide.slug) setSlugLocked(true);
    setGuide((current) => ({
      ...current,
      title: current.title || topic.title,
      slug: slugLocked || current.slug ? current.slug : slugify(topic.suggestedSlug || topic.title),
      seoTitle: current.seoTitle || topic.title,
      relatedTools: topic.relatedTools?.length ? topic.relatedTools : current.relatedTools,
      tags: topic.supportingKeywords || current.tags,
      planning: {
        ...parsePlanning(current.planning),
        primaryKeyword: topic.primaryKeyword,
        supportingKeywords: topic.supportingKeywords || [],
        searchIntent: topic.searchIntent,
        deviceIntent: topic.deviceIntent || "any",
        toolDependency: topic.toolDependency,
        priority: topic.priority,
        relatedSearches: topic.relatedSearches || [],
        internalLinkNotes:
          current.planning?.internalLinkNotes ||
          `Main CTA: ${topic.toolDependency}. Cover related searches in this page. Do not create extra URLs for keyword variants.`,
      },
    }));
  }

  const quality = useMemo(
    () =>
      assessGuideQuality(
        {
          ...guide,
          planning: parsePlanning(guide.planning),
          blocks: [
            { id: "article", type: "articleDoc", data: { doc } },
            ...(guide.blocks || []).filter((block) =>
              ["planning", "relatedTools", "relatedGuides", "toc"].includes(block.type),
            ),
          ],
        },
        meta,
      ),
    [guide, meta, doc],
  );
  const warnings = quality.warnings;
  const planning = parsePlanning(guide.planning);
  const blocked = publishBlockReason(guide, planning, { alreadyPublished: guide.status === "published" });

  async function save(status) {
    if (status === "published") {
      if (blocked) {
        setError(blocked);
        return;
      }
      if (warnings.length) {
        const ok = window.confirm(
          `${PUBLISH_VALUE_QUESTION}\n\n${warnings.length} warning${warnings.length === 1 ? "" : "s"} still apply. Publish only if this is still a useful resource.`,
        );
        if (!ok) return;
      }
    }
    setBusy(true);
    setError("");
    setSavedNote("");
    const liveDoc = editorRef.current?.getJSON?.() || doc;
    const payload = {
      title: guide.title,
      slug: guide.slug,
      excerpt: guide.excerpt,
      template: guide.template,
      featured: guide.featured,
      scheduledAt: guide.scheduledAt || null,
      seoTitle: guide.seoTitle,
      seoDescription: guide.seoDescription,
      canonicalUrl: guide.canonicalUrl,
      robots: guide.robots,
      focusTopic: guide.focusTopic,
      featuredImageId: guide.featuredImageId || null,
      ogImageId: guide.ogImageId || null,
      authorId: guide.authorId || null,
      categoryId: guide.categoryId || null,
      deviceId: guide.deviceId || null,
      tags: Array.isArray(guide.tags) ? guide.tags : String(guide.tags).split(",").map((item) => item.trim()).filter(Boolean),
      relatedTools: guide.relatedTools || [],
      relatedGuideIds: guide.relatedGuideIds || [],
      planning: parsePlanning(guide.planning),
      doc: liveDoc,
      status: status || guide.status,
    };
    if (status === "published" && !guide.publishedAt) payload.publishedAt = new Date().toISOString();
    if (status === "published" && (!guide.robots || guide.robots === "noindex,follow")) {
      payload.robots = "index,follow";
    }
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
    setDoc(liveDoc);
    setSavedNote("Saved. Internal links and formatting are kept in the article.");
  }

  const seoTitle = guide.seoTitle || guide.title || "Untitled guide";
  const seoDesc = guide.seoDescription || guide.excerpt;
  const categorySlug = meta.categories.find((item) => item.id === guide.categoryId)?.slug || "how-to";
  const url = `${SITE_URL}/guides/${categorySlug}/${guide.slug || "your-slug"}`;
  const otherGuides = (meta.guides || []).filter((item) => item.id !== guideId);
  const selectedTopic = getCanonicalTopic(topicId);
  const foldedResearch = topicId ? getFoldedResearch(topicId) : [];

  return (
    <div className="guide-composer">
      <div className="alert alert-info">
        <strong>Content pipeline:</strong> {CONTENT_PIPELINE.join(" → ")}.
        Test on devices you own ({OWNED_DEVICES.join(", ")}). Do not invent iPhone tests. Keywords are topics inside one useful guide, not extra URLs.
      </div>
      <label className="field">
        Title
        <input value={guide.title} onChange={(event) => updateTitle(event.target.value)} placeholder="How to Convert Images to PDF with PDFFlow" />
      </label>

      <div className="composer-meta-grid">
        <div className="field">
          <label>
            Slug
            <input value={guide.slug} onChange={(event) => updateSlug(event.target.value)} />
          </label>
          <p className="help">{slugLocked ? "You edited this slug." : "Filled from the title."}</p>
        </div>
        <label className="field">
          Load a tool-centered guide (not a keyword URL)
          <select value={topicId} onChange={(event) => applyTopic(event.target.value)}>
            <option value="">Choose a planned tool guide…</option>
            {TOPIC_ROADMAP.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.priority} · {topic.title}
              </option>
            ))}
          </select>
          <span className="help">Fills title, keywords, and the live tool. It does not write the article. Old iPhone/Android/Windows keyword rows stay in research; they are not extra pages.</span>
        </label>
      </div>

      <div className="composer-meta-grid">
        <label className="field">
          Primary keyword
          <input
            value={planning.primaryKeyword}
            onChange={(event) => updatePlanning("primaryKeyword", event.target.value)}
            placeholder="convert images to PDF"
          />
        </label>
        <label className="field">
          Supporting keywords (comma separated)
          <input
            value={(planning.supportingKeywords || []).join(", ")}
            onChange={(event) =>
              updatePlanning(
                "supportingKeywords",
                event.target.value.split(",").map((item) => item.trim()).filter(Boolean),
              )
            }
            placeholder="JPG to PDF, PNG to PDF, photo to PDF"
          />
        </label>
      </div>

      <div className="composer-meta-grid">
        <label className="field">
          Search intent
          <select value={planning.searchIntent} onChange={(event) => updatePlanning("searchIntent", event.target.value)}>
            {SEARCH_INTENTS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Device intent
          <select value={planning.deviceIntent} onChange={(event) => updatePlanning("deviceIntent", event.target.value)}>
            {DEVICE_INTENTS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Tool this guide depends on
          <select value={planning.toolDependency} onChange={(event) => updatePlanning("toolDependency", event.target.value)}>
            <option value="">Select</option>
            <option value="none">None — not a tool guide</option>
            {tools.map((tool) => (
              <option key={tool.slug} value={tool.slug}>
                {tool.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Priority
          <select value={planning.priority} onChange={(event) => updatePlanning("priority", event.target.value)}>
            {PRIORITIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field">
        Related searches (comma separated)
        <input
          value={(planning.relatedSearches || []).join(", ")}
          onChange={(event) =>
            updatePlanning(
              "relatedSearches",
              event.target.value.split(",").map((item) => item.trim()).filter(Boolean),
            )
          }
        />
      </label>
      <label className="field">
        Internal linking notes
        <textarea
          rows={2}
          value={planning.internalLinkNotes || ""}
          onChange={(event) => updatePlanning("internalLinkNotes", event.target.value)}
          placeholder="Link the live tool once. Cover JPG/PNG/photo as sections in this page, not extra URLs."
        />
      </label>

      {selectedTopic ? (
        <div className="alert alert-info">
          <p>
            <strong>Cover inside this guide — do not create extra URLs.</strong> Use these as headings, FAQs, examples, or troubleshooting. Do not keyword-stuff.
          </p>
          <p className="help" style={{ marginTop: 8 }}>
            {(selectedTopic.coverSections || []).length
              ? `Useful extra sections: ${selectedTopic.coverSections.join("; ")}.`
              : null}{" "}
            Suggested slug: {selectedTopic.suggestedSlug}
          </p>
          {foldedResearch.length ? (
            <ul className="help" style={{ marginTop: 8 }}>
              {foldedResearch.map((row) => (
                <li key={row.id}>
                  {row.primaryKeyword}
                  {row.supportingKeywords?.length ? ` · ${row.supportingKeywords.join(", ")}` : ""}
                </li>
              ))}
            </ul>
          ) : (
            <p className="help">No folded keyword rows for this tool yet.</p>
          )}
        </div>
      ) : null}

      <label className="field">
        Short introduction (shown under the title)
        <textarea
          value={guide.excerpt}
          onChange={(event) => update("excerpt", event.target.value)}
          rows={3}
          placeholder="What problem this guide solves, in one or two sentences."
        />
      </label>

      <div className="composer-meta-grid">
        <label className="field">
          Guide type
          <select value={guide.template || "HOW_TO"} onChange={(event) => update("template", event.target.value)}>
            <option value="HOW_TO">How-to</option>
            <option value="TROUBLESHOOTING">Troubleshooting</option>
            <option value="EXPLAINER">Explainer</option>
            <option value="COMPARISON">Comparison</option>
          </select>
        </label>
        <label className="field">
          Author
          <select value={guide.authorId || ""} onChange={(event) => update("authorId", event.target.value)}>
            <option value="">Select</option>
            {(meta.authors || []).map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Category
          <select value={guide.categoryId || ""} onChange={(event) => update("categoryId", event.target.value)}>
            <option value="">Select</option>
            {(meta.categories || []).map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Device hub
          <select value={guide.deviceId || ""} onChange={(event) => update("deviceId", event.target.value)}>
            <option value="">None</option>
            {(meta.devices || []).map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <MediaPicker label="Featured image" value={guide.featuredImageId} onChange={(value) => update("featuredImageId", value)} />
      <p className="help">Use a real screenshot from a device you own, or a clearly designed diagram. Do not mock an iPhone interface or fabricate device tests.</p>

      <div className="field">
        <span>Article</span>
        <p className="help">
          Help the reader finish the task with PDFFlow. Typical tool-guide sections: {TOOL_GUIDE_SECTIONS.map((item) => item.heading).join("; ")}.
          Skip any section that does not apply. Do not write a long generic SEO article. Insert can add Tip, Warning, Note, table, example, FAQ, sources, and a tool card.
        </p>
        <TiptapEditor
          value={doc}
          onChange={updateDoc}
          contentKey={guideId || "new"}
          ready={docReady}
          editorRef={editorRef}
        />
      </div>

      <details className="composer-advanced" open>
        <summary>Related tools and guides</summary>
        <fieldset className="field">
          <legend>Related PDF tools</legend>
          <div className="composer-checks">
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
          </div>
        </fieldset>
        <fieldset className="field">
          <legend>Related guides (2–4 is enough)</legend>
          <div className="composer-checks">
            {otherGuides.map((item) => (
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
                {item.title} ({item.status})
              </label>
            ))}
            {!otherGuides.length ? <p className="help">No other guides yet.</p> : null}
          </div>
        </fieldset>
      </details>

      <details className="composer-advanced">
        <summary>Sources / references</summary>
        <p className="help">Link official docs you used. Add your own note. Do not paste their article.</p>
        {(planning.sources || []).map((source, index) => (
          <div className="composer-meta-grid" key={`source-${index}`}>
            <input
              placeholder="Title"
              value={source.title || ""}
              onChange={(event) => {
                const next = [...planning.sources];
                next[index] = { ...next[index], title: event.target.value };
                updatePlanning("sources", next);
              }}
            />
            <input
              placeholder="https://"
              value={source.url || ""}
              onChange={(event) => {
                const next = [...planning.sources];
                next[index] = { ...next[index], url: event.target.value };
                updatePlanning("sources", next);
              }}
            />
            <input
              placeholder="What you took from it"
              value={source.note || ""}
              onChange={(event) => {
                const next = [...planning.sources];
                next[index] = { ...next[index], note: event.target.value };
                updatePlanning("sources", next);
              }}
            />
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => updatePlanning("sources", planning.sources.filter((_, itemIndex) => itemIndex !== index))}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => updatePlanning("sources", [...(planning.sources || []), { title: "", url: "", note: "" }])}
        >
          Add source
        </button>
      </details>

      <details className="composer-advanced">
        <summary>SEO</summary>
        <div className="composer-meta-grid">
          <label className="field">
            SEO title ({(guide.seoTitle || "").length}/60)
            <input value={guide.seoTitle} onChange={(event) => update("seoTitle", event.target.value)} />
          </label>
          <label className="field">
            Meta description ({(guide.seoDescription || "").length}/160)
            <textarea
              rows={2}
              value={guide.seoDescription}
              onChange={(event) => update("seoDescription", event.target.value.slice(0, 170))}
            />
          </label>
        </div>
        <label className="field">
          Canonical URL (optional)
          <input value={guide.canonicalUrl} onChange={(event) => update("canonicalUrl", event.target.value)} placeholder="Leave blank to use this page URL" />
        </label>
        <label className="field">
          Robots
          <select value={guide.robots} onChange={(event) => update("robots", event.target.value)}>
            <option value="index,follow">index, follow</option>
            <option value="noindex,follow">noindex, follow</option>
            <option value="noindex,nofollow">noindex, nofollow</option>
          </select>
        </label>
        <MediaPicker label="OG image (optional; featured image is used if empty)" value={guide.ogImageId} onChange={(value) => update("ogImageId", value)} />
        <div className="seo-preview">
          <strong>Search preview</strong>
          <div className="google-preview">
            <div className="gp-url">{guide.canonicalUrl || url}</div>
            <div className="gp-title">{seoTitle}</div>
            <div className="gp-desc">{seoDesc}</div>
          </div>
        </div>
      </details>

      <details className="composer-advanced" open>
        <summary>Quality checklist — required before publish</summary>
        <p className="help">{PUBLISH_VALUE_QUESTION} Check every box only after you have actually verified it. Drafts stay unpublished and noindex until a person finishes this list.</p>
        <div className="quality-checklist">
          {CHECKLIST_ITEMS.map((item) => (
            <label key={item.id}>
              <input
                type="checkbox"
                checked={Boolean(planning.checklist?.[item.id])}
                onChange={(event) =>
                  updatePlanning("checklist", { ...planning.checklist, [item.id]: event.target.checked })
                }
              />{" "}
              {item.label}
            </label>
          ))}
        </div>
        {warnings.length ? (
          <ul className="quality-checklist">
            {warnings.map((item) => (
              <li key={item.text}>{item.text}</li>
            ))}
          </ul>
        ) : (
          <p className="help">No automated warnings.</p>
        )}
        {guideId && (
          <p>
            <a className="btn btn-secondary" href={`/admin/guides/${guideId}/preview`} target="_blank" rel="noreferrer">
              Preview
            </a>
          </p>
        )}
        <label>
          <input type="checkbox" checked={guide.featured} onChange={(event) => update("featured", event.target.checked)} /> Featured
        </label>
      </details>

      {error && <div className="alert alert-error">{error}</div>}
      {savedNote ? <div className="alert alert-info">{savedNote}</div> : null}
      <div className="sticky-actions" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => save("draft")}>
          Save draft
        </button>
        {guideId ? (
          <a className="btn btn-secondary" href={`/admin/guides/${guideId}/preview`} target="_blank" rel="noreferrer">
            Preview
          </a>
        ) : null}
        <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => save(guide.status || "draft")}>
          Update
        </button>
        <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => save("unpublished")}>
          Unpublish
        </button>
        <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => save("archived")}>
          Archive
        </button>
        <button type="button" className="btn btn-primary" disabled={busy || Boolean(blocked)} onClick={() => save("published")}>
          Publish
        </button>
      </div>
      {blocked ? <p className="help">{blocked}</p> : null}
      {revisions.length > 0 && (
        <details className="composer-advanced">
          <summary>Revisions</summary>
          <ul>
            {revisions.map((item) => (
              <li key={item.id}>
                {new Date(item.createdAt).toLocaleString()} — {item.title}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
