import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const FILE = path.join(process.cwd(), "data", "guide-views.json");
let queue = Promise.resolve();

function withLock(fn) {
  const run = queue.then(fn, fn);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readAll() {
  try {
    const raw = await readFile(FILE, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function writeAll(all) {
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, `${JSON.stringify(all)}\n`, "utf8");
}

export async function getGuideViews(slug) {
  if (!slug) return 0;
  const all = await readAll();
  return Math.max(0, Number(all[slug] || 0));
}

export async function incrementGuideViews(slug) {
  if (!slug) return 0;
  return withLock(async () => {
    const all = await readAll();
    const next = Math.max(0, Number(all[slug] || 0)) + 1;
    all[slug] = next;
    await writeAll(all);
    return next;
  });
}
