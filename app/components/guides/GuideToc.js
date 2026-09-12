"use client";

import { useEffect, useState } from "react";

export default function GuideToc({ title, items }) {
  const [activeId, setActiveId] = useState(items[0]?.id || "");

  useEffect(() => {
    const headings = items.map((item) => document.getElementById(item.id)).filter(Boolean);
    if (!headings.length) return undefined;

    const update = () => {
      const marker = 120;
      let current = headings[0].id;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= marker) current = heading.id;
      }
      setActiveId(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  return (
    <nav className="guide-toc-card" aria-label="On this page">
      <p className="guide-toc-label">{title || "On this page"}</p>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={item.id === activeId ? "is-active" : undefined}
              aria-current={item.id === activeId ? "location" : undefined}
              onClick={() => setActiveId(item.id)}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
