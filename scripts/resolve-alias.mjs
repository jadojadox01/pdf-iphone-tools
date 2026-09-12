import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

function existingFile(base) {
  const candidates = [base, `${base}.js`, `${base}.mjs`, path.join(base, "index.js")];
  return candidates.find((file) => {
    try {
      return fs.existsSync(file) && fs.statSync(file).isFile();
    } catch {
      return false;
    }
  });
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const match = existingFile(path.join(process.cwd(), specifier.slice(2)));
    if (match) return nextResolve(pathToFileURL(match).href, context);
  }

  if (specifier.startsWith(".") && context.parentURL && !path.extname(specifier)) {
    const parentDir = path.dirname(fileURLToPath(context.parentURL));
    const match = existingFile(path.resolve(parentDir, specifier));
    if (match) return nextResolve(pathToFileURL(match).href, context);
  }

  return nextResolve(specifier, context);
}
