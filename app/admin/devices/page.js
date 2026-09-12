"use client";

import { useEffect, useState } from "react";

export default function AdminDevicesPage() {
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState("");

  function load() {
    fetch("/api/admin/devices")
      .then((response) => response.json())
      .then((data) => setDevices(data.devices || []));
  }

  useEffect(() => {
    load();
  }, []);

  async function save(device) {
    setError("");
    const response = await fetch(`/api/admin/devices/${device.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(device),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "Could not save.");
      return;
    }
    load();
  }

  return (
    <div className="admin-page">
      <h1>Devices</h1>
      <p className="help">
        A device hub should exist only when the copy helps someone using that device. Do not publish Android, Windows, or
        Mac by swapping the word “iPhone”.
      </p>
      {error && <div className="alert alert-error">{error}</div>}
      {devices.map((device) => (
        <div className="workspace" key={device.id} style={{ marginTop: 16 }}>
          <h2>
            {device.name} <span className="help">/{device.slug}</span>
          </h2>
          <label className="field">
            Name
            <input
              value={device.name}
              onChange={(event) =>
                setDevices(devices.map((item) => (item.id === device.id ? { ...item, name: event.target.value } : item)))
              }
            />
          </label>
          <label className="field">
            Intro
            <textarea
              value={device.intro || ""}
              onChange={(event) =>
                setDevices(devices.map((item) => (item.id === device.id ? { ...item, intro: event.target.value } : item)))
              }
            />
          </label>
          <label className="field">
            Status
            <select
              value={device.status}
              onChange={(event) =>
                setDevices(devices.map((item) => (item.id === device.id ? { ...item, status: event.target.value } : item)))
              }
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </label>
          <p className="help">
            {device._count?.tools || 0} tool pairings · {device._count?.guides || 0} guides
          </p>
          <button type="button" className="btn btn-secondary" onClick={() => save(device)}>
            Save
          </button>
        </div>
      ))}
    </div>
  );
}
