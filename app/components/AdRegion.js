import { canShowAds } from "@/lib/ads";

/**
 * Reserved region for a future ad unit. Renders nothing while ads are off.
 * Callers must place this after publisher content, never beside tool buttons.
 */
export default function AdRegion({ pageType, slot }) {
  if (!canShowAds(pageType) || !slot) return null;
  return (
    <aside className="ad-region" data-ad-slot={slot} aria-label="Advertisement">
      {/* Ad code is intentionally omitted until ads are enabled. */}
    </aside>
  );
}
