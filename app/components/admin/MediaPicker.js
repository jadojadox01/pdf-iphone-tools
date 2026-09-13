"use client";

import { useEffect, useRef, useState } from "react";
import { uploadAdminMedia } from "@/lib/prepare-media-upload";

export default function MediaPicker({ value, onChange, label = "Image" }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

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
    try {
      const media = await uploadAdminMedia(file);
      onChange(media.id);
      setItems((current) => [media, ...current.filter((item) => item.id !== media.id)]);
      setOpen(false);
    } catch (uploadError) {
      setError(uploadError?.message || "Upload failed. Try a JPEG or PNG under 8 MB.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="field">
      <span>{label}</span>
      <p className="help">This picture appears at the top of the guide, on guide cards, and in link previews. Uploading or choosing an image saves it on this guide immediately.</p>
      {value && previewSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={previewSrc} alt={selected?.alt || "Featured image preview"} className="media-thumb" />
      ) : (
        <p className="help">No featured image selected yet.</p>
      )}
      {error ? <p className="alert alert-error">{error}</p> : null}
      <div className="hero-actions">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml,.jpg,.jpeg,.png,.webp,.gif,.svg"
          className="sr-only"
          onChange={onUpload}
          disabled={busy}
        />
        <button
          type="button"
          className="btn btn-primary"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? "Uploading…" : "Upload image"}
        </button>
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
