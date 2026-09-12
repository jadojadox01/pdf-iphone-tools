"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

function asText(value) {
  if (Array.isArray(value)) return value.join("\n\n");
  return String(value || "");
}

function asLines(value) {
  if (Array.isArray(value)) return value.join("\n");
  return String(value || "");
}

function paragraphs(text) {
  return String(text || "")
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function lines(text) {
  return String(text || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function AdminToolExplainPage() {
  const { id } = useParams();
  const [tool, setTool] = useState(null);
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/tools/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setTool(data.tool);
        const explain = data.explain || {};
        setForm({
          does: asText(explain.does),
          why: asText(explain.why),
          usefulFor: asLines(explain.usefulFor),
          files: explain.files || "",
          happens: asText(explain.happens),
          howTitle: explain.howTitle || "",
          how: asLines(explain.how),
          exampleTitle: explain.example?.title || "Example",
          exampleSteps: asLines(explain.example?.steps),
          tip: explain.tip || "",
          important: explain.important || "",
          limits: asLines(explain.limits),
        });
      });
  }, [id]);

  async function save() {
    setError("");
    setSaved(false);
    const explain = {
      does: paragraphs(form.does),
      why: paragraphs(form.why),
      usefulFor: lines(form.usefulFor),
      files: form.files,
      happens: paragraphs(form.happens),
      howTitle: form.howTitle,
      how: lines(form.how),
      example: {
        title: form.exampleTitle,
        steps: lines(form.exampleSteps),
      },
      tip: form.tip,
      important: form.important,
      limits: lines(form.limits),
    };
    const response = await fetch(`/api/admin/tools/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ explain }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "Could not save.");
      return;
    }
    setSaved(true);
  }

  if (!form) return <p>Loading…</p>;

  function field(key, value) {
    setForm({ ...form, [key]: value });
  }

  return (
    <div className="admin-page">
      <p className="help">
        <Link href="/admin/tools">Tools</Link> → {tool?.name}
      </p>
      <h1>Explain {tool?.name}</h1>
      <p className="help">
        These sections appear under the working tool. Leave a box empty to hide that section. Write what the converter
        actually does. Do not invent percentages or guarantees.
      </p>
      {error && <div className="alert alert-error">{error}</div>}
      {saved && <div className="alert alert-ok">Saved.</div>}
      {tool?.publicPath ? (
        <p>
          <Link href={tool.publicPath} target="_blank">
            View public page
          </Link>
        </p>
      ) : null}
      <div className="workspace">
        <label className="field">
          What it does
          <textarea value={form.does} onChange={(event) => field("does", event.target.value)} rows={5} />
        </label>
        <label className="field">
          When to use it
          <textarea value={form.why} onChange={(event) => field("why", event.target.value)} rows={4} />
        </label>
        <label className="field">
          Useful for (one per line)
          <textarea value={form.usefulFor} onChange={(event) => field("usefulFor", event.target.value)} rows={4} />
        </label>
        <label className="field">
          Files
          <textarea value={form.files} onChange={(event) => field("files", event.target.value)} rows={3} />
        </label>
        <label className="field">
          How-to heading
          <input value={form.howTitle} onChange={(event) => field("howTitle", event.target.value)} />
        </label>
        <label className="field">
          How to use it (one step per line)
          <textarea value={form.how} onChange={(event) => field("how", event.target.value)} rows={5} />
        </label>
        <label className="field">
          What happens to the file
          <textarea value={form.happens} onChange={(event) => field("happens", event.target.value)} rows={4} />
        </label>
        <label className="field">
          Example title
          <input value={form.exampleTitle} onChange={(event) => field("exampleTitle", event.target.value)} />
        </label>
        <label className="field">
          Example steps (one per line)
          <textarea value={form.exampleSteps} onChange={(event) => field("exampleSteps", event.target.value)} rows={4} />
        </label>
        <label className="field">
          Tip
          <textarea value={form.tip} onChange={(event) => field("tip", event.target.value)} rows={3} />
        </label>
        <label className="field">
          Important
          <textarea value={form.important} onChange={(event) => field("important", event.target.value)} rows={3} />
        </label>
        <label className="field">
          Limits (one per line)
          <textarea value={form.limits} onChange={(event) => field("limits", event.target.value)} rows={5} />
        </label>
        <button type="button" className="btn btn-primary" onClick={save}>
          Save explanation
        </button>
      </div>
    </div>
  );
}
