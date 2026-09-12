"use client";

import { ANALYTICS_OPEN_EVENT } from "@/lib/analytics";

export default function CookieSettingsLink() {
  return (
    <button
      type="button"
      className="footer-text-btn"
      onClick={() => window.dispatchEvent(new Event(ANALYTICS_OPEN_EVENT))}
    >
      Cookie settings
    </button>
  );
}
