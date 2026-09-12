"use client";

import { useEffect, useState } from "react";
import { slugify } from "@/lib/slug";

export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [form, setForm] = useState({ name: "", slug: "", role: "", bio: "", website: "" });
  const [error, setError] = useState("");
  const [slugLocked, setSlugLocked] = useState(false);

  function load() {
    fetch("/api/admin/authors")
      .then((response) => response.json())
      .then((data) => setAuthors(data.authors || []));
  }

  useEffect(() => {
    load();
  }, []);

  async function create(event) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/admin/authors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "Could not create author.");
      return;
    }
    setForm({ name: "", slug: "", role: "", bio: "", website: "" });
    setSlugLocked(false);
    load();
  }

  async function save(author) {
    await fetch(`/api/admin/authors/${author.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(author),
    });
    load();
  }

  async function remove(id) {
    if (!window.confirm("Delete this author?")) return;
    const response = await fetch(`/api/admin/authors/${id}`, { method: "DELETE" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "Could not delete.");
      return;
    }
    load();
  }

  return (
    <div className="admin-page">
      <h1>Authors</h1>
      <p className="help">
        Use a real name or “PDFFlow”. Only write credentials, years, companies, or awards that are true. Leave the bio short if you have nothing extra to say.
      </p>
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
        <label className="field">
          Role
          <input value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} />
        </label>
        <label className="field">
          Bio
          <textarea value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} />
        </label>
        <label className="field">
          Website
          <input value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} />
        </label>
        <button className="btn btn-primary" type="submit">
          Add author
        </button>
      </form>
      {authors.map((author) => (
        <div className="workspace" key={author.id} style={{ marginTop: 16 }}>
          <label className="field">
            Name
            <input
              value={author.name}
              onChange={(event) =>
                setAuthors(authors.map((item) => (item.id === author.id ? { ...item, name: event.target.value } : item)))
              }
            />
          </label>
          <label className="field">
            Role
            <input
              value={author.role || ""}
              onChange={(event) =>
                setAuthors(authors.map((item) => (item.id === author.id ? { ...item, role: event.target.value } : item)))
              }
            />
          </label>
          <label className="field">
            Bio
            <textarea
              value={author.bio || ""}
              onChange={(event) =>
                setAuthors(authors.map((item) => (item.id === author.id ? { ...item, bio: event.target.value } : item)))
              }
            />
          </label>
          <div className="hero-actions">
            <button type="button" className="btn btn-secondary" onClick={() => save(author)}>
              Save
            </button>
            <button type="button" className="btn btn-danger" onClick={() => remove(author.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
