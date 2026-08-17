"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminSeoPage() {
  const [guides, setGuides] = useState([]);

  useEffect(() => {
    fetch("/api/admin/guides?status=published")
      .then((response) => response.json())
      .then((data) => setGuides(data.guides || []));
  }, []);

  return (
    <div className="admin-page">
      <h1>SEO</h1>
      <p className="help">
        Editorial checks only. These fields do not guarantee search rankings. Sitemap and RSS include published guides automatically.
      </p>
      <ul>
        <li>
          Sitemap: <a href="/sitemap.xml">/sitemap.xml</a>
        </li>
        <li>
          Guides feed: <a href="/guides/rss.xml">/guides/rss.xml</a>
        </li>
        <li>Admin routes are disallowed in robots.txt and send noindex headers.</li>
      </ul>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Guide</th>
            <th>SEO title</th>
            <th>Meta description</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {guides.map((guide) => (
            <tr key={guide.id}>
              <td>{guide.title}</td>
              <td>
                {(guide.seoTitle || "").length}/60
                {(guide.seoTitle || "").length > 60 ? " — long" : ""}
              </td>
              <td>
                {(guide.seoDescription || "").length}/160
                {(guide.seoDescription || "").length < 70 ? " — short" : ""}
              </td>
              <td>
                <Link href={`/admin/guides/${guide.id}`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!guides.length && <p>No published guides yet.</p>}
    </div>
  );
}
