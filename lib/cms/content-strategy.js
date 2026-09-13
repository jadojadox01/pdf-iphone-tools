/**
 * How PDFFlow should use research, tools, and guides.
 * Keywords stay in the planning database. They are not a queue of URLs.
 */

export const CONTENT_PIPELINE = [
  "Build or verify the tool",
  "Test the tool on devices you own",
  "Document the tool",
  "Create the guide",
  "Link the guide to the tool",
  "Publish",
];

export const OWNED_DEVICES = ["Windows laptop", "Android phone"];

export const TOOL_GUIDE_SECTIONS = [
  { heading: "The problem", purpose: "What the reader is trying to do." },
  { heading: "What PDFFlow does", purpose: "What this tool actually does." },
  { heading: "Step-by-step", purpose: "How to finish the task with the live tool." },
  { heading: "Supported input formats", purpose: "What files the tool accepts." },
  { heading: "Output format", purpose: "What the reader downloads." },
  { heading: "Options and settings", purpose: "Only controls that exist in the tool." },
  { heading: "What happens during processing", purpose: "In the browser. Not uploaded for conversion." },
  { heading: "File limits", purpose: "Real size and page limits." },
  { heading: "Privacy", purpose: "Must match the implementation." },
  { heading: "Common errors", purpose: "Failures you have actually seen." },
  { heading: "Troubleshooting", purpose: "How to recover." },
  { heading: "Practical tips", purpose: "From tests on devices you own." },
  { heading: "Examples", purpose: "Real tasks, not extra keyword pages." },
  { heading: "Related tools", purpose: "Other live converters that help." },
  { heading: "Related guides", purpose: "Other published guides only." },
  { heading: "Use the tool", purpose: "One clear CTA." },
];

export const FAKE_DEVICE_CLAIM_RE =
  /tested (this )?on iphone|works perfectly on iphone|tested on iphone safari|verified on (iphone|safari on iphone)|we tested this on iphone/i;

export const DEVICE_CLONE_TITLE_RE = /\bon (iphone|ipad|android|windows|mac)\b/i;
