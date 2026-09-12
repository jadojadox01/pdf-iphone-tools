"use client";

import Link from "next/link";

export default function Error({ reset }) {
  return (
    <div className="wrap" style={{ padding: "48px 0 64px" }}>
      <h1>Something went wrong</h1>
      <p className="lede">This page could not be loaded. Try again, or go back to the homepage.</p>
      <p className="hero-actions">
        <button className="btn btn-primary" type="button" onClick={() => reset()}>
          Try again
        </button>
        <Link className="btn btn-secondary" href="/">
          Homepage
        </Link>
        <Link className="btn btn-secondary" href="/tools">
          PDF tools
        </Link>
      </p>
    </div>
  );
}
