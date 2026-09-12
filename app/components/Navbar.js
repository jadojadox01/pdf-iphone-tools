"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getTools, getToolsByCategory, TOOL_CATEGORIES } from "@/lib/tools";
import { BRAND } from "@/config/brand";
import { toolPath } from "@/lib/paths";
import { DEVICE_HUBS } from "@/lib/devices";
import { Icon } from "./Icons";

export default function Navbar({ publishedDeviceSlugs = [] }) {
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [devicesOpen, setDevicesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const allTools = getTools();

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        setToolsOpen(false);
        setDevicesOpen(false);
        setSearchOpen(false);
      }
    };
    const onClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, []);

  useEffect(() => {
    if (searchOpen) {
      const input = searchRef.current?.querySelector("input");
      input?.focus();
    }
  }, [searchOpen]);

  function hoverOk() {
    return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="logo" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BRAND.logoSrc} alt={BRAND.name} className="logo-img" width="168" height="48" />
        </Link>

        <nav className="nav-links" aria-label="Main">
          <div
            className={`tools-menu${toolsOpen ? " open" : ""}`}
            onMouseEnter={() => {
              if (!hoverOk()) return;
              setToolsOpen(true);
              setDevicesOpen(false);
            }}
            onMouseLeave={() => {
              if (hoverOk()) setToolsOpen(false);
            }}
          >
            <button
              type="button"
              className="nav-button"
              aria-expanded={toolsOpen}
              aria-haspopup="true"
              onClick={() => {
                setToolsOpen((value) => !value);
                setDevicesOpen(false);
              }}
            >
              Tools
              <Icon name="chevron" size={16} className="nav-chevron" />
            </button>
            <div className="tools-panel" role="menu">
              {TOOL_CATEGORIES.map((category) => (
                <div key={category.id}>
                  <h3>{category.title}</h3>
                  {getToolsByCategory(category.id).map((tool) => (
                    <Link key={tool.slug} href={toolPath(tool.slug)} onClick={() => setToolsOpen(false)}>
                      <span className="nav-item-label">
                        <Icon name={tool.icon} size={16} />
                        {tool.name}
                      </span>
                      <span className="nav-tool-def">{tool.definition}</span>
                    </Link>
                  ))}
                </div>
              ))}
              <div>
                <h3>All</h3>
                <Link href="/tools" onClick={() => setToolsOpen(false)}>
                  All tools
                </Link>
              </div>
            </div>
          </div>
          <Link href="/guides">Guides</Link>
          <div
            className={`tools-menu devices-menu${devicesOpen ? " open" : ""}`}
            onMouseEnter={() => {
              if (!hoverOk()) return;
              setDevicesOpen(true);
              setToolsOpen(false);
            }}
            onMouseLeave={() => {
              if (hoverOk()) setDevicesOpen(false);
            }}
          >
            <button
              type="button"
              className="nav-button"
              aria-expanded={devicesOpen}
              aria-haspopup="true"
              onClick={() => {
                setDevicesOpen((value) => !value);
                setToolsOpen(false);
              }}
            >
              Devices
              <Icon name="chevron" size={16} className="nav-chevron" />
            </button>
            <div className="tools-panel devices-panel" role="menu">
              {DEVICE_HUBS.map((device) => {
                const live = publishedDeviceSlugs.includes(device.slug);
                return (
                <Link
                  key={device.slug}
                  href={live ? `/${device.slug}` : "/tools"}
                  onClick={() => setDevicesOpen(false)}
                >
                  <span className="nav-item-label">
                    <Icon name={device.slug} size={16} />
                    {device.name}
                  </span>
                  {!live ? (
                    <span className="nav-tool-def">Same tools in the browser — no separate page yet</span>
                  ) : null}
                </Link>
                );
              })}
            </div>
          </div>
          <Link href="/about">About</Link>
          <div className={`nav-search${searchOpen ? " open" : ""}`} ref={searchRef}>
            <button
              type="button"
              className="nav-search-btn"
              aria-label="Search"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((value) => !value)}
            >
              <SearchGlyph />
            </button>
            {searchOpen && (
              <form action="/search" method="get">
                <label className="sr-only" htmlFor="nav-q">
                  Search tools and guides
                </label>
                <input id="nav-q" name="q" placeholder="Search tools and guides" />
              </form>
            )}
          </div>
        </nav>

        <div className="mobile-quick">
          <Link href="/search" className="nav-search-btn" aria-label="Search" onClick={() => setOpen(false)}>
            <SearchGlyph />
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <div className={`mobile-menu${open ? " open" : ""}`}>
        <p className="mobile-menu-label">Tools</p>
        {allTools.map((tool) => (
          <Link key={tool.slug} href={toolPath(tool.slug)} onClick={() => setOpen(false)}>
            <span className="nav-item-label">
              <Icon name={tool.icon} size={18} />
              {tool.name}
            </span>
          </Link>
        ))}
        <Link href="/tools" onClick={() => setOpen(false)}>
          All tools
        </Link>
        <Link href="/guides" onClick={() => setOpen(false)}>
          Guides
        </Link>
        <p className="mobile-menu-label">Devices</p>
        {DEVICE_HUBS.map((device) => {
          const live = publishedDeviceSlugs.includes(device.slug);
          return (
          <Link
            key={device.slug}
            href={live ? `/${device.slug}` : "/tools"}
            onClick={() => setOpen(false)}
          >
            <span className="nav-item-label">
              <Icon name={device.slug} size={18} />
              {device.name}
              {!live ? " (browser tools)" : ""}
            </span>
          </Link>
          );
        })}
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

function SearchGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="M16 16.5L20.5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
