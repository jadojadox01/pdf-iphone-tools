"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ANALYTICS_CHANGE_EVENT,
  ANALYTICS_OPEN_EVENT,
  ANALYTICS_STORAGE_KEY,
  GA_MEASUREMENT_ID,
} from "@/lib/analytics";

function readChoice() {
  try {
    const value = window.localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (value === "1") return "accepted";
    if (value === "0") return "declined";
  } catch {
    /* private mode */
  }
  return null;
}

function expireAnalyticsCookies() {
  const suffix = GA_MEASUREMENT_ID.replace(/^G-/, "");
  const names = ["_ga", `_ga_${suffix}`];
  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
  }
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
}

function saveChoice(accepted) {
  try {
    window.localStorage.setItem(ANALYTICS_STORAGE_KEY, accepted ? "1" : "0");
  } catch {
    /* ignore */
  }
  if (!accepted) expireAnalyticsCookies();
  else window[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
  window.dispatchEvent(new Event(ANALYTICS_CHANGE_EVENT));
}

export default function CookieNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(readChoice() === null);
    function reopen() {
      setOpen(true);
    }
    window.addEventListener(ANALYTICS_OPEN_EVENT, reopen);
    return () => window.removeEventListener(ANALYTICS_OPEN_EVENT, reopen);
  }, []);

  if (!open) return null;

  function choose(accepted) {
    saveChoice(accepted);
    setOpen(false);
  }

  return (
    <div className="cookie-notice" role="dialog" aria-labelledby="cookie-notice-title" aria-describedby="cookie-notice-text">
      <div className="wrap cookie-notice-inner">
        <div>
          <p id="cookie-notice-title" className="cookie-notice-title">
            Analytics cookies
          </p>
          <p id="cookie-notice-text" className="cookie-notice-text">
            PDF tools run in your browser and do not need cookies. Optional Google Analytics
            helps us see which pages are used. It does not receive your PDF files.{" "}
            <Link href="/cookies">Cookie Policy</Link>
          </p>
        </div>
        <div className="cookie-notice-actions">
          <button type="button" className="btn btn-secondary" onClick={() => choose(false)}>
            Decline
          </button>
          <button type="button" className="btn btn-primary" onClick={() => choose(true)}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
