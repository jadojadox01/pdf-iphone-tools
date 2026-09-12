"use client";

import { useEffect, useState } from "react";

export default function AdminRedirectsPage() {
  const [redirects, setRedirects] = useState([]);
  const [form, setForm] = useState({ fromPath: "", toPath: "", statusCode: 301 });
  const [error, setError] = useState("");

  function load() {
    fetch("/api/admin/redirects")
      .then((response) => response.json())
      .then((data) => setRedirects(data.redirects || []));
  }

  useEffect(() => {
    load();
  }, []);

  async function create(event) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/admin/redirects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "Could not create redirect.");
      return;
    }
    setForm({ fromPath: "", toPath: "", statusCode: 301 });
    load();
  }

  async function remove(id) {
    if (!window.confirm("Delete this redirect?")) return;
    await fetch(`/api/admin/redirects/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="admin-page">
      <h1>Redirects</h1>
      <p className="help">
        Single-segment paths (like <code>/old-tool</code>) are applied by the site. Nested paths such as{" "}
        <code>/blog/...</code> also need an entry in <code>next.config.mjs</code> until a hosted database can drive all
        redirects.
      </p>
      {error && <div className="alert alert-error">{error}</div>}
      <form className="workspace" onSubmit={create}>
        <label className="field">
          From
          <input
            value={form.fromPath}
            onChange={(event) => setForm({ ...form, fromPath: event.target.value })}
            placeholder="/old-url"
            required
          />
        </label>
        <label className="field">
          To
          <input
            value={form.toPath}
            onChange={(event) => setForm({ ...form, toPath: event.target.value })}
            placeholder="/iphone/pdf-to-word"
            required
          />
        </label>
        <button className="btn btn-primary" type="submit">
          Add redirect
        </button>
      </form>
      <table className="admin-table">
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {redirects.map((item) => (
            <tr key={item.id}>
              <td>{item.fromPath}</td>
              <td>{item.toPath}</td>
              <td>
                <button type="button" onClick={() => remove(item.id)}>
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
