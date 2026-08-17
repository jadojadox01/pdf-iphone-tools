"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/admin/meta")
      .then((response) => response.json())
      .then((data) => setStats(data.stats));
  }, []);

  if (!stats) return <div className="admin-page"><p>Loading…</p></div>;

  const cards = [
    ["Total Guides", stats.total],
    ["Published Guides", stats.published],
    ["Drafts", stats.drafts],
    ["Scheduled Guides", stats.scheduled],
    ["Unpublished", stats.unpublished],
    ["Categories", stats.categories],
  ];

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Dashboard</h1>
          <p className="help">Counts come from the database. Empty values show as 0.</p>
        </div>
        <Link className="btn btn-primary" href="/admin/guides/new">
          New guide
        </Link>
      </div>
      <div className="stat-grid">
        {cards.map(([label, value]) => (
          <div className="stat-card" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <h2>Recently updated</h2>
      <ul>
        {stats.recent.map((item) => (
          <li key={item.id}>
            <Link href={`/admin/guides/${item.id}`}>{item.title}</Link>
            <span className="help"> {item.status}</span>
          </li>
        ))}
        {!stats.recent.length && <li>No guides yet.</li>}
      </ul>
    </div>
  );
}
