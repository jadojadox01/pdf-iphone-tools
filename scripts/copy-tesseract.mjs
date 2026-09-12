import { mkdir, copyFile, access } from "fs/promises";
import { createWriteStream } from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { Readable } from "stream";

const root = process.cwd();
const dest = path.join(root, "public", "tesseract");
const files = [
  ["node_modules/tesseract.js/dist/worker.min.js", "worker.min.js"],
  ["node_modules/tesseract.js-core/tesseract-core-lstm.wasm.js", "tesseract-core-lstm.wasm.js"],
  ["node_modules/tesseract.js-core/tesseract-core-lstm.wasm", "tesseract-core-lstm.wasm"],
  ["node_modules/tesseract.js-core/tesseract-core-simd-lstm.wasm.js", "tesseract-core-simd-lstm.wasm.js"],
  ["node_modules/tesseract.js-core/tesseract-core-simd-lstm.wasm", "tesseract-core-simd-lstm.wasm"],
  ["node_modules/tesseract.js-core/tesseract-core-relaxedsimd-lstm.wasm.js", "tesseract-core-relaxedsimd-lstm.wasm.js"],
  ["node_modules/tesseract.js-core/tesseract-core-relaxedsimd-lstm.wasm", "tesseract-core-relaxedsimd-lstm.wasm"],
];

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await mkdir(dest, { recursive: true });
  for (const [from, name] of files) {
    const source = path.join(root, from);
    if (await exists(source)) await copyFile(source, path.join(dest, name));
  }

  const trained = path.join(dest, "eng.traineddata.gz");
  if (!(await exists(trained))) {
    const url = "https://cdn.jsdelivr.net/npm/@tesseract.js-data/eng/4.0.0_best_int/eng.traineddata.gz";
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Could not download OCR language data (${response.status}).`);
    await pipeline(Readable.fromWeb(response.body), createWriteStream(trained));
  }
}

main().catch((error) => {
  console.warn("OCR assets were not copied:", error.message);
});
