"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import MediaPicker from "./MediaPicker";
import TiptapEditor from "./TiptapEditor";
import { parseBlocks, planningFromBlocks } from "@/lib/cms/blocks";
import { blocksToDoc, docToBlocks } from "@/lib/cms/doc-blocks";
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
import { TOPIC_ROADMAP } from "@/lib/cms/topics";
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
        setDoc(blocksToDoc(blocks));
        setSlugLocked(Boolean(data.guide.slug) && data.guide.slug !== slugify(data.guide.title || ""));
        setRevisions(data.guide.revisions || []);
      });
  }, [guideId]);

  function update(key, value) {
    setGuide((current) => ({ ...current, [key]: value }));
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
    update("blocks", docToBlocks(next));
  }

  function applyTopic(id) {
    const topic = TOPIC_ROADMAP.find((item) => item.id === id);
    if (!topic) return;
    setGuide((current) => ({
      ...current,
      title: current.title || topic.title,
      seoTitle: current.seoTitle || topic.title,
      relatedTools: topic.relatedTools?.length ? topic.relatedTools : current.relatedTools,
      tags: topic.supportingKeywords || current.tags,
      planning: {
        ...parsePlanning(current.planning),
        primaryKeyword: topic.primaryKeyword,
        supportingKeywords: topic.supportingKeywords || [],
        searchIntent: topic.searchIntent,
        deviceIntent: topic.deviceIntent,
        toolDependency: topic.toolDependency,
        priority: topic.priority,
        relatedSearches: topic.relatedSearches || [],
      },
    }));
  }

  const quality = useMemo(() => assessGuideQuality({ ...guide, planning: parsePlanning(guide.planning) }, meta), [guide, meta]);
  const warnings = quality.warnings;
  const planning = parsePlanning(guide.planning);
  const blocked = publishBlockReason(guide, planning);

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
    const payload = {
      ...guide,
      planning: parsePlanning(guide.planning),
      blocks: docToBlocks(doc),
      blocksJson: docToBlocks(doc),
      status: status || guide.status,
      tags: Array.isArray(guide.tags) ? guide.tags : String(guide.tags).split(",").map((item) => item.trim()).filter(Boolean),
      scheduledAt: guide.scheduledAt || null,
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
    router.push("/admin/guides");
    router.refresh();
  }

  const seoTitle = guide.seoTitle || guide.title || "Untitled guide";
  const seoDesc = guide.seoDescription || guide.excerpt;
  const categorySlug = meta.categories.find((item) => item.id === guide.categoryId)?.slug || "how-to";
  const url = `${SITE_URL}/guides/${categorySlug}/${guide.slug || "your-slug"}`;
  const otherGuides = (meta.guides || []).filter((item) => item.id !== guideId);

  return (
    <div className="guide-composer">
      <label className="field">
        Title
        <input value={guide.title} onChange={(event) => updateTitle(event.target.value)} placeholder="How to convert a picture to PDF on iPhone" />
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
          Load planning from the topic roadmap
          <select defaultValue="" onChange={(event) => applyTopic(event.target.value)}>
            <option value="">Choose a planned topic…</option>
            {TOPIC_ROADMAP.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.priority} · {topic.title}
              </option>
            ))}
          </select>
          <span className="help">Fills keywords and tool. It does not write the article.</span>
        </label>
      </div>

      <div className="composer-meta-grid">
        <label className="field">
          Primary keyword
          <input
            value={planning.primaryKeyword}
            onChange={(event) => updatePlanning("primaryKeyword", event.target.value)}
            placeholder="convert picture to PDF on iPhone"
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
            placeholder="photo to PDF iPhone, image to PDF iPhone"
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
          placeholder="Link the Image to PDF tool once. Related: merge, HEIC to JPG. Device hub: /iphone."
        />
      </label>

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
      <p className="help">Use a real screenshot or a clearly designed diagram. Do not mock an iPhone interface.</p>

      <div className="field">
        <span>Article</span>
        <p className="help">
          Write what this problem needs. Do not use the same outline on every guide. Insert can add Tip, Warning, Note, table, diagram, example, FAQ, sources, and a tool card.
        </p>
        <TiptapEditor value={doc} onChange={updateDoc} />
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
