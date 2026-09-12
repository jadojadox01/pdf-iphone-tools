"use client";

import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({ notes: "", liveWrites: true, onVercel: false });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((response) => response.json())
      .then((data) =>
        setSettings({
          notes: data.notes || "",
          liveWrites: data.liveWrites !== false,
          onVercel: Boolean(data.onVercel),
        })
      );
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
          Guides are stored in the CMS database. Creating and publishing from this dashboard does not require editing
          source files.
        </p>
        <p>
          On the live site, uploads and edits save through a Vercel Blob store. You do not upload from your laptop.
          Create a Blob store in the Vercel dashboard (Storage → Blob), connect it to this project, and redeploy. Then
          upload the featured image here again.
        </p>
        {settings.onVercel && !settings.liveWrites ? (
          <p className="alert alert-error">
            This live admin cannot save yet because no Blob store is connected. Add one in Vercel Storage, redeploy, and
            try the upload again.
          </p>
        ) : null}
      </div>
      <form className="workspace" onSubmit={save} style={{ marginTop: 16 }}>
        <label className="field">
          Internal notes
          <textarea value={settings.notes} onChange={(event) => setSettings((current) => ({ ...current, notes: event.target.value }))} />
        </label>
        <button className="btn btn-primary" type="submit">
          Save notes
        </button>
        {saved && <p className="help">Saved.</p>}
      </form>
    </div>
  );
}
