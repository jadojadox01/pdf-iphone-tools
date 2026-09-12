"use client";

import { useEffect, useState } from "react";

export default function MediaPicker({ value, onChange, label = "Image" }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function load(query = q) {
    const params = query ? `?q=${encodeURIComponent(query)}` : "";
    fetch(`/api/admin/media${params}`)
      .then((response) => response.json())
      .then((data) => setItems(data.media || []));
  }

  useEffect(() => {
    if (value || open) load(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, q, value]);

  const selected = items.find((item) => item.id === value);
  const previewSrc = selected?.url || (value ? `/media/${value}` : "");

  async function onUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    const body = new FormData();
    body.append("file", file);
    body.append("alt", file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
    const response = await fetch("/api/admin/media", { method: "POST", body });
    const data = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) {
      setError(data.error || "Upload failed.");
      return;
    }
    onChange(data.media.id);
    setItems((current) => [data.media, ...current.filter((item) => item.id !== data.media.id)]);
    setOpen(false);
  }

  return (
    <div className="field">
      <span>{label}</span>
      <p className="help">This picture appears at the top of the guide, on guide cards, and in link previews.</p>
      {value && previewSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={previewSrc} alt={selected?.alt || "Featured image preview"} className="media-thumb" />
      ) : (
        <p className="help">No featured image selected yet.</p>
      )}
      {error ? <p className="alert alert-error">{error}</p> : null}
      <div className="hero-actions">
        <label className="btn btn-primary">
          {busy ? "Uploading…" : "Upload image"}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" hidden onChange={onUpload} disabled={busy} />
        </label>
        <button type="button" className="btn btn-secondary" onClick={() => setOpen((current) => !current)}>
          {open ? "Close library" : "Choose from library"}
        </button>
        {value && (
          <button type="button" className="btn btn-ghost" onClick={() => onChange("")}>
            Clear
          </button>
        )}
      </div>
      {open && (
        <div className="media-picker">
          <input placeholder="Search media" value={q} onChange={(event) => setQ(event.target.value)} />
          <div className="media-grid">
            {items.map((item) => (
              <button
                type="button"
                key={item.id}
                className={item.id === value ? "selected" : ""}
                onClick={() => {
                  onChange(item.id);
                  setOpen(false);
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url || `/media/${item.id}`} alt={item.alt || item.filename} />
                <span>{item.filename}</span>
              </button>
            ))}
          </div>
          {!items.length ? <p className="help">No images in the library yet. Upload one above.</p> : null}
        </div>
      )}
    </div>
  );
}
