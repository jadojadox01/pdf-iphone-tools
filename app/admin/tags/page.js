"use client";

import { useEffect, useState } from "react";
import { slugify } from "@/lib/slug";

export default function AdminTagsPage() {
  const [tags, setTags] = useState([]);
  const [form, setForm] = useState({ name: "", slug: "" });
  const [error, setError] = useState("");
  const [slugLocked, setSlugLocked] = useState(false);

  function load() {
    fetch("/api/admin/tags")
      .then((response) => response.json())
      .then((data) => setTags(data.tags || []));
  }

  useEffect(() => {
    load();
  }, []);

  async function create(event) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/admin/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "Could not create tag.");
      return;
    }
    setForm({ name: "", slug: "" });
    setSlugLocked(false);
    load();
  }

  async function save(tag) {
    await fetch(`/api/admin/tags/${tag.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tag),
    });
    load();
  }

  async function remove(id) {
    if (!window.confirm("Delete this tag?")) return;
    await fetch(`/api/admin/tags/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="admin-page">
      <h1>Tags</h1>
      <p className="help">Tags connect related guides. They are optional. Do not create tags just to look busy.</p>
      {error && <div className="alert alert-error">{error}</div>}
      <form className="workspace" onSubmit={create}>
        <label className="field">
          Name
          <input
            value={form.name}
            onChange={(event) => {
              const name = event.target.value;
              setForm((current) => ({ ...current, name, slug: slugLocked ? current.slug : slugify(name) }));
            }}
            required
          />
        </label>
        <label className="field">
          Slug
          <input
            value={form.slug}
            onChange={(event) => {
              setSlugLocked(true);
              setForm({ ...form, slug: slugify(event.target.value) });
            }}
          />
        </label>
        <button className="btn btn-primary" type="submit">
          Add tag
        </button>
      </form>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Guides</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag) => (
            <tr key={tag.id}>
              <td>
                <input
                  value={tag.name}
                  onChange={(event) =>
                    setTags(tags.map((item) => (item.id === tag.id ? { ...item, name: event.target.value } : item)))
                  }
                />
              </td>
              <td>
                <input
                  value={tag.slug}
                  onChange={(event) =>
                    setTags(tags.map((item) => (item.id === tag.id ? { ...item, slug: event.target.value } : item)))
                  }
                />
              </td>
              <td>{tag._count?.guides || 0}</td>
              <td className="row-actions">
                <button type="button" onClick={() => save(tag)}>
                  Save
                </button>
                <button type="button" onClick={() => remove(tag.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
