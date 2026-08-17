"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getToolsByCategory, TOOL_CATEGORIES } from "@/lib/tools";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        setToolsOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="logo" onClick={() => setOpen(false)}>
          <span className="logo-mark">PDF</span>
          PDF iPhone Tools
        </Link>

        <nav className="nav-links" aria-label="Main">
          <div className={`tools-menu${toolsOpen ? " open" : ""}`}>
            <button
              type="button"
              className="nav-button"
              aria-expanded={toolsOpen}
              aria-haspopup="true"
              onClick={() => setToolsOpen((value) => !value)}
            >
              PDF Tools
            </button>
            <div className="tools-panel" role="menu">
              {TOOL_CATEGORIES.map((category) => (
                <div key={category.id}>
                  <h3>{category.title}</h3>
                  {getToolsByCategory(category.id).map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/${tool.slug}`}
                      onClick={() => setToolsOpen(false)}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <Link href="/guides">Guides</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className="mobile-quick">
          <Link href="/tools" onClick={() => setOpen(false)}>
            Tools
          </Link>
          <Link href="/guides" onClick={() => setOpen(false)}>
            Guides
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "✕" : "Menu"}
          </button>
        </div>
      </div>

      <div className={`mobile-menu${open ? " open" : ""}`}>
        <Link href="/tools" onClick={() => setOpen(false)}>
          All PDF tools
        </Link>
        {getToolsByCategory("convert").concat(getToolsByCategory("organize")).map((tool) => (
          <Link key={tool.slug} href={`/${tool.slug}`} onClick={() => setOpen(false)}>
            {tool.name}
          </Link>
        ))}
        <Link href="/sign-pdf" onClick={() => setOpen(false)}>
          Sign PDF
        </Link>
        <Link href="/protect-pdf" onClick={() => setOpen(false)}>
          Protect PDF
        </Link>
        <Link href="/unlock-pdf" onClick={() => setOpen(false)}>
          Unlock PDF
        </Link>
        <Link href="/guides" onClick={() => setOpen(false)}>
          Guides
        </Link>
        <Link href="/about" onClick={() => setOpen(false)}>
          About
        </Link>
        <Link href="/contact" onClick={() => setOpen(false)}>
          Contact
        </Link>
      </div>
    </header>
  );
}
