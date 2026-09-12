import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const FILE = path.join(process.cwd(), "data", "tool-explain.json");

async function readAll() {
  try {
    const raw = await readFile(FILE, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export async function getExplainOverride(slug) {
  if (!slug) return null;
  const all = await readAll();
  return all[slug] || null;
}

export async function saveExplainOverride(slug, explain) {
  const all = await readAll();
  all[slug] = explain;
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, `${JSON.stringify(all, null, 2)}\n`, "utf8");
  return explain;
}
