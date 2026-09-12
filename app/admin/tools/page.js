"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminToolsPage() {
  const [tools, setTools] = useState([]);
  const [error, setError] = useState("");

  function load() {
    fetch("/api/admin/tools")
      .then((response) => response.json())
      .then((data) => setTools(data.tools || []));
  }

  useEffect(() => {
    load();
  }, []);

  async function save(tool) {
    setError("");
    const iphone = (tool.devices || []).find((item) => item.device?.slug === "iphone");
    const response = await fetch(`/api/admin/tools/${tool.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: tool.name,
        intro: tool.intro,
        description: tool.description,
        cta: tool.cta,
        status: tool.status,
        iphone: {
          headline: iphone?.headline || "",
          intro: iphone?.intro || "",
          featured: Boolean(iphone?.featured),
        },
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "Could not save.");
      return;
    }
    load();
  }

  function update(toolId, patch) {
    setTools(tools.map((tool) => (tool.id === toolId ? { ...tool, ...patch } : tool)));
  }

  function updateIphone(toolId, patch) {
    setTools(
      tools.map((tool) => {
        if (tool.id !== toolId) return tool;
        const devices = (tool.devices || []).map((item) =>
          item.device?.slug === "iphone" ? { ...item, ...patch } : item,
        );
        return { ...tool, devices };
      }),
    );
  }

  return (
    <div className="admin-page">
      <h1>Tools</h1>
      <p className="help">
        Public converters come from working processors. Use Explain to edit the page copy under each tool. Do not invent
        tools that do not run.
      </p>
      {error && <div className="alert alert-error">{error}</div>}
      {tools.map((tool) => {
        const iphone = (tool.devices || []).find((item) => item.device?.slug === "iphone");
        return (
          <div className="workspace" key={tool.id} style={{ marginTop: 16 }}>
            <h2>
              {tool.name}{" "}
              <Link href={tool.publicPath} target="_blank">
                View
              </Link>{" "}
              <Link href={`/admin/tools/${tool.id}`}>Explain</Link>
            </h2>
            {!tool.catalogLive && <p className="help">This CMS record has no matching live processor.</p>}
            <label className="field">
              Name
              <input value={tool.name} onChange={(event) => update(tool.id, { name: event.target.value })} />
            </label>
            <label className="field">
              Intro
              <textarea value={tool.intro || ""} onChange={(event) => update(tool.id, { intro: event.target.value })} />
            </label>
            <label className="field">
              iPhone headline
              <input
                value={iphone?.headline || ""}
                onChange={(event) => updateIphone(tool.id, { headline: event.target.value })}
              />
            </label>
            <label className="field">
              iPhone intro
              <textarea
                value={iphone?.intro || ""}
                onChange={(event) => updateIphone(tool.id, { intro: event.target.value })}
              />
            </label>
            <label className="field">
              <input
                type="checkbox"
                checked={Boolean(iphone?.featured)}
                onChange={(event) => updateIphone(tool.id, { featured: event.target.checked })}
              />{" "}
              Featured on the iPhone hub
            </label>
            <p className="help">
              {(tool.guides || []).filter((item) => item.guide?.status === "published").length} published guides ·{" "}
              {tool._count?.guides || 0} linked in CMS
            </p>
            {(tool.guides || []).length ? (
              <ul className="help">
                {tool.guides.map((item) =>
                  item.guide ? (
                    <li key={item.guide.id}>
                      <Link href={`/admin/guides/${item.guide.id}`}>{item.guide.title}</Link>
                      {item.guide.status === "published" ? " (published)" : ` (${item.guide.status})`}
                    </li>
                  ) : null,
                )}
              </ul>
            ) : (
              <p className="help">No guides linked yet. Link them from the guide editor. Do not invent a public page.</p>
            )}
            <button type="button" className="btn btn-secondary" onClick={() => save(tool)}>
              Save
            </button>
          </div>
        );
      })}
    </div>
  );
}
