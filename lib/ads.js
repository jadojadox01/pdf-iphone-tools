/**
 * Ads are not enabled. These constants document where Google-served ads
 * may be placed later without violating publisher inventory-value and
 * ads-interfering policies.
 *
 * Do not place ads:
 * - next to Choose/Convert/Download or other tool controls
 * - over content or navigation
 * - on 404, search, login, admin, or other low-content screens
 * - on screens that only exist to host ads
 *
 * Official references:
 * https://support.google.com/publisherpolicies/answer/11035030
 * https://support.google.com/publisherpolicies/answer/11112688
 */
export const ADS_ENABLED = false;

export const AD_FORBIDDEN_PAGES = new Set([
  "not-found",
  "search",
  "admin",
  "login",
  "privacy",
  "terms",
  "cookies",
  "contact",
]);

export function canShowAds(pageType) {
  return ADS_ENABLED && !AD_FORBIDDEN_PAGES.has(pageType);
}
