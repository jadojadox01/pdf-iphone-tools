"use client";

import { useEffect, useState } from "react";
import { slugify } from "@/lib/slug";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", slug: "", description: "", sortOrder: 0 });
  const [error, setError] = useState("");
  const [slugLocked, setSlugLocked] = useState(false);

  function load() {
    fetch("/api/admin/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data.categories || []));
  }

  useEffect(() => {
    load();
  }, []);

  async function create(event) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "Could not create category.");
      return;
    }
    setForm({ name: "", slug: "", description: "", sortOrder: 0 });
    setSlugLocked(false);
    load();
  }

  async function save(category) {
    await fetch(`/api/admin/categories/${category.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    load();
  }

  async function remove(id) {
    if (!window.confirm("Delete this category?")) return;
    const response = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "Could not delete.");
      return;
    }
    load();
  }

  return (
    <div className="admin-page">
      <h1>Categories</h1>
      <p className="help">Public category pages only appear when they contain published guides.</p>
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
            placeholder="pdf-conversion"
          />
        </label>
        <label className="field">
          Description
          <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        </label>
        <label className="field">
          Sort order
          <input type="number" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })} />
        </label>
        <button className="btn btn-primary" type="submit">
          Add category
        </button>
      </form>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Guides</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>
                <input
                  value={category.name}
                  onChange={(event) =>
                    setCategories(categories.map((item) => (item.id === category.id ? { ...item, name: event.target.value } : item)))
                  }
                />
              </td>
              <td>
                <input
                  value={category.slug}
                  onChange={(event) =>
                    setCategories(categories.map((item) => (item.id === category.id ? { ...item, slug: event.target.value } : item)))
                  }
                />
              </td>
              <td>{category._count?.guides || 0}</td>
              <td className="row-actions">
                <button type="button" onClick={() => save(category)}>
                  Save
                </button>
                <button type="button" onClick={() => remove(category.id)}>
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
