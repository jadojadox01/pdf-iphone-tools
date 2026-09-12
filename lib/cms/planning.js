export const CHECKLIST_ITEMS = [
  { id: "keywordIntent", label: "Primary keyword matches actual search intent" },
  { id: "solvesProblem", label: "Guide solves a real user problem" },
  { id: "original", label: "Content is original" },
  { id: "notCopied", label: "No copied/reworded competitor content" },
  { id: "toolWorks", label: "Tool actually works" },
  { id: "realGraphics", label: "Screenshots/graphics are real and useful" },
  { id: "imageAlt", label: "Images have useful alt text" },
  { id: "noFakeClaims", label: "No fake claims" },
  { id: "noFakeStats", label: "No fake statistics" },
  { id: "noKeywordStuffing", label: "No keyword stuffing" },
  { id: "noRepetition", label: "No repetitive sections" },
  { id: "internalLinks", label: "Internal links are relevant" },
  { id: "uniqueMeta", label: "Metadata is unique" },
  { id: "mobileLayout", label: "Mobile layout works" },
  { id: "linksWork", label: "Links work" },
  { id: "ctaWorks", label: "Tool CTA works" },
  { id: "privacyMatch", label: "Privacy claims match implementation" },
  { id: "manualReview", label: "Guide has been manually reviewed" },
];

export const SEARCH_INTENTS = [
  { id: "how-to", label: "How-to (do this task)" },
  { id: "troubleshoot", label: "Troubleshooting (something failed)" },
  { id: "compare", label: "Comparison (which method)" },
  { id: "explain", label: "Explainer (how it works)" },
];

export const DEVICE_INTENTS = [
  { id: "iphone", label: "iPhone / iPad" },
  { id: "android", label: "Android" },
  { id: "windows", label: "Windows" },
  { id: "mac", label: "Mac" },
  { id: "any", label: "Any device / browser" },
];

export const PRIORITIES = ["P1", "P2", "P3"];

export function emptyPlanning() {
  return {
    primaryKeyword: "",
    supportingKeywords: [],
    searchIntent: "how-to",
    deviceIntent: "iphone",
    toolDependency: "",
    priority: "P1",
    relatedSearches: [],
    internalLinkNotes: "",
    sources: [],
    checklist: Object.fromEntries(CHECKLIST_ITEMS.map((item) => [item.id, false])),
  };
}

export function parsePlanning(value) {
  const fallback = emptyPlanning();
  let parsed = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value || "{}");
    } catch {
      parsed = {};
    }
  }
  if (!parsed || typeof parsed !== "object") parsed = {};
  return {
    ...fallback,
    ...parsed,
    supportingKeywords: asList(parsed.supportingKeywords),
    relatedSearches: asList(parsed.relatedSearches),
    sources: Array.isArray(parsed.sources) ? parsed.sources.filter((item) => item && (item.title || item.url)) : [],
    checklist: { ...fallback.checklist, ...(parsed.checklist || {}) },
  };
}

export function stringifyPlanning(planning) {
  return JSON.stringify(parsePlanning(planning));
}

export function getGuidePlanning(guide) {
  if (!guide) return emptyPlanning();
  if (guide.planning && typeof guide.planning === "object" && !Array.isArray(guide.planning)) {
    return parsePlanning(guide.planning);
  }
  let blocks = guide.blocksJson || guide.blocks || [];
  if (typeof blocks === "string") {
    try {
      blocks = JSON.parse(blocks);
    } catch {
      blocks = [];
    }
  }
  const found = Array.isArray(blocks) ? blocks.find((block) => block?.type === "planning") : null;
  return parsePlanning(found?.data);
}

export function checklistComplete(planning) {
  const data = parsePlanning(planning);
  return CHECKLIST_ITEMS.every((item) => data.checklist[item.id] === true);
}

export function publishBlockReason(guide, planning) {
  const data = parsePlanning(planning || getGuidePlanning(guide));
  if (!String(guide?.title || "").trim()) return "Add a title before publishing.";
  if (!String(guide?.excerpt || "").trim()) return "Add a short introduction before publishing.";
  if (!data.primaryKeyword) return "Set the primary keyword before publishing.";
  if (!data.toolDependency) return "Name the working tool this guide depends on, or write “none” if it is not a tool guide.";
  if (!checklistComplete(data)) {
    return "Finish the quality checklist before publishing. Every item must be checked by a person.";
  }
  return "";
}

function asList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
