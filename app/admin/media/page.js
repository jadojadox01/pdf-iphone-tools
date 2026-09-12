"use client";

import { useEffect, useState } from "react";
import { uploadAdminMedia } from "@/lib/prepare-media-upload";

export default function AdminMediaPage() {
  const [media, setMedia] = useState([]);
  const [q, setQ] = useState("");
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");

  function load() {
    const params = q ? `?q=${encodeURIComponent(q)}` : "";
    fetch(`/api/admin/media${params}`)
      .then((response) => response.json())
      .then((data) => setMedia(data.media || []));
  }

  useEffect(() => {
    load();
  }, [q]);

  async function upload(event) {
    event.preventDefault();
    setError("");
    const file = event.target.file.files?.[0];
    if (!file) return;
    try {
      await uploadAdminMedia(file, { alt, caption });
      setAlt("");
      setCaption("");
      event.target.reset();
      load();
    } catch (uploadError) {
      setError(uploadError?.message || "Upload failed. Try a JPEG or PNG under 8 MB.");
    }
  }

  async function save(item) {
    await fetch(`/api/admin/media/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alt: item.alt, caption: item.caption }),
    });
    load();
  }

  async function remove(id) {
    if (!window.confirm("Delete this image?")) return;
    await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="admin-page">
      <h1>Media</h1>
      <p className="help">JPEG, PNG, WebP, GIF, or SVG. Maximum 8 MB. Use a real screenshot or a clearly designed diagram.</p>
      {error && <div className="alert alert-error">{error}</div>}
      <form className="workspace" onSubmit={upload}>
        <label className="field">
          File
          <input name="file" type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml,.jpg,.jpeg,.png,.webp,.gif,.svg" required />
        </label>
        <label className="field">
          Alt text
          <input value={alt} onChange={(event) => setAlt(event.target.value)} />
        </label>
        <label className="field">
          Caption
          <input value={caption} onChange={(event) => setCaption(event.target.value)} />
        </label>
        <button className="btn btn-primary" type="submit">
          Upload
        </button>
      </form>
      <label className="field" style={{ marginTop: 24 }}>
        Search
        <input value={q} onChange={(event) => setQ(event.target.value)} />
      </label>
      <div className="media-library">
        {media.map((item) => (
          <article className="media-card" key={item.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.url} alt={item.alt || item.filename} />
            <p className="help">{item.filename}</p>
            <p className="help">
              {item.width || "?"}×{item.height || "?"} · {Math.round((item.size || 0) / 1024)} KB
            </p>
            <label className="field">
              Alt
              <input
                value={item.alt || ""}
                onChange={(event) =>
                  setMedia(media.map((entry) => (entry.id === item.id ? { ...entry, alt: event.target.value } : entry)))
                }
              />
            </label>
            <label className="field">
              Caption
              <input
                value={item.caption || ""}
                onChange={(event) =>
                  setMedia(media.map((entry) => (entry.id === item.id ? { ...entry, caption: event.target.value } : entry)))
                }
              />
            </label>
            <p className="help">ID: {item.id}</p>
            <div className="hero-actions">
              <button type="button" className="btn btn-secondary" onClick={() => save(item)}>
                Save
              </button>
              <button type="button" className="btn btn-danger" onClick={() => remove(item.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
      {!media.length && <p>No images yet.</p>}
    </div>
  );
}
