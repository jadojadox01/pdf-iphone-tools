"use client";

import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({ notes: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((response) => response.json())
      .then((data) => setSettings({ notes: data.notes || "" }));
  }, []);

  async function save(event) {
    event.preventDefault();
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaved(true);
  }

  return (
    <div className="admin-page">
      <h1>Settings</h1>
      <div className="workspace">
        <p>
          Sign-in uses the <code>ADMIN_PASSWORD</code> environment variable. In local development the default is{" "}
          <code>admin</code> if that variable is unset.
        </p>
        <p>
          Guides are stored in SQLite at <code>data/cms.db</code>. Creating and publishing from this dashboard does not
          require editing source files.
        </p>
        <p className="help">
          On Vercel, file-based SQLite is not a durable write store. Seeded published guides can ship with the app; for
          ongoing production editing, move this CMS to a hosted Postgres database.
        </p>
      </div>
      <form className="workspace" onSubmit={save} style={{ marginTop: 16 }}>
        <label className="field">
          Internal notes
          <textarea value={settings.notes} onChange={(event) => setSettings({ notes: event.target.value })} />
        </label>
        <button className="btn btn-primary" type="submit">
          Save notes
        </button>
        {saved && <p className="help">Saved.</p>}
      </form>
    </div>
  );
}
