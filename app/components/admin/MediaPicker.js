"use client";

import { useEffect, useState } from "react";

export default function MediaPicker({ value, onChange, label = "Image" }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) return;
    const params = q ? `?q=${encodeURIComponent(q)}` : "";
    fetch(`/api/admin/media${params}`)
      .then((response) => response.json())
      .then((data) => setItems(data.media || []));
  }, [open, q]);

  const selected = items.find((item) => item.id === value);

  return (
    <div className="field">
      <span>{label}</span>
      {value && (
        <p className="help">
          Selected ID: {value}
          {selected?.filename ? ` (${selected.filename})` : ""}
        </p>
      )}
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/api/media/${value}`} alt="" className="media-thumb" />
      )}
      <div className="hero-actions">
        <button type="button" className="btn btn-secondary" onClick={() => setOpen((current) => !current)}>
          {open ? "Close library" : "Choose from media"}
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
                <img src={item.url} alt={item.alt || item.filename} />
                <span>{item.filename}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
