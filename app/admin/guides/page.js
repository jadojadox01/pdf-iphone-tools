"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState([]);
  const [meta, setMeta] = useState({ categories: [], authors: [] });
  const [filters, setFilters] = useState({ status: "", categoryId: "", authorId: "", featured: "", q: "" });
  const [selected, setSelected] = useState([]);

  function load() {
    const params = new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([, value]) => value)));
    fetch(`/api/admin/guides?${params}`)
      .then((response) => response.json())
      .then((data) => setGuides(data.guides || []));
  }

  useEffect(() => {
    fetch("/api/admin/meta")
      .then((response) => response.json())
      .then((data) => setMeta(data));
  }, []);

  useEffect(() => {
    load();
  }, [filters]);

  async function act(id, action) {
    if (action === "delete" && !window.confirm("Soft-delete this guide? It will leave public listings.")) return;
    await fetch(`/api/admin/guides/${id}`, {
      method: action === "delete" ? "DELETE" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: action === "delete" ? undefined : JSON.stringify({
        action: action === "duplicate" ? "duplicate" : undefined,
        status: action === "publish" ? "published" : action === "unpublish" ? "unpublished" : undefined,
      }),
    });
    load();
  }

  async function bulk(action) {
    if (!selected.length) return;
    if (action === "delete" && !window.confirm(`Soft-delete ${selected.length} guides?`)) return;
    await fetch("/api/admin/guides/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ids: selected }),
    });
    setSelected([]);
    load();
  }

  const allIds = useMemo(() => guides.map((item) => item.id), [guides]);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Guides</h1>
        <Link className="btn btn-primary" href="/admin/guides/new">
          New guide
        </Link>
      </div>
      <div className="admin-filters">
        <input placeholder="Search" value={filters.q} onChange={(event) => setFilters({ ...filters, q: event.target.value })} />
        <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="scheduled">Scheduled</option>
          <option value="unpublished">Unpublished</option>
        </select>
        <select value={filters.categoryId} onChange={(event) => setFilters({ ...filters, categoryId: event.target.value })}>
          <option value="">All categories</option>
          {meta.categories.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
        <select value={filters.authorId} onChange={(event) => setFilters({ ...filters, authorId: event.target.value })}>
          <option value="">All authors</option>
          {meta.authors.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
        <select value={filters.featured} onChange={(event) => setFilters({ ...filters, featured: event.target.value })}>
          <option value="">Featured: any</option>
          <option value="true">Featured</option>
        </select>
      </div>
      <div className="admin-filters">
        <button type="button" className="btn btn-secondary" onClick={() => bulk("publish")}>Publish selected</button>
        <button type="button" className="btn btn-secondary" onClick={() => bulk("unpublish")}>Unpublish selected</button>
        <button type="button" className="btn btn-danger" onClick={() => bulk("delete")}>Delete selected</button>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selected.length === allIds.length && allIds.length > 0}
                  onChange={(event) => setSelected(event.target.checked ? allIds : [])}
                />
              </th>
              <th>Title</th>
              <th>Status</th>
              <th>Category</th>
              <th>Author</th>
              <th>Published</th>
              <th>Updated</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {guides.map((guide) => (
              <tr key={guide.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(guide.id)}
                    onChange={(event) => {
                      setSelected(event.target.checked ? [...selected, guide.id] : selected.filter((id) => id !== guide.id));
                    }}
                  />
                </td>
                <td>
                  <strong>{guide.title}</strong>
                  <div className="help">/guides/{guide.slug}</div>
                </td>
                <td>{guide.status}</td>
                <td>{guide.category?.name || "—"}</td>
                <td>{guide.author?.name || "—"}</td>
                <td>{guide.publishedAt ? new Date(guide.publishedAt).toLocaleDateString() : "—"}</td>
                <td>{new Date(guide.updatedAt).toLocaleDateString()}</td>
                <td>{guide.featured ? "Yes" : "No"}</td>
                <td className="row-actions">
                  <Link href={`/admin/guides/${guide.id}`}>Edit</Link>
                  <Link href={`/admin/guides/${guide.id}/preview`}>Preview</Link>
                  <button type="button" onClick={() => act(guide.id, "publish")}>Publish</button>
                  <button type="button" onClick={() => act(guide.id, "unpublish")}>Unpublish</button>
                  <button type="button" onClick={() => act(guide.id, "duplicate")}>Duplicate</button>
                  <button type="button" onClick={() => act(guide.id, "delete")}>Delete</button>
                </td>
              </tr>
            ))}
            {!guides.length && (
              <tr>
                <td colSpan={9}>No guides match these filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
