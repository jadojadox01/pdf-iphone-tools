import { PDFDocument } from "@cantoo/pdf-lib";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { crc32, deflateSync } from "zlib";
import puppeteer from "puppeteer-core";

function solidPng(width, height, rgb = [20, 110, 210]) {
  const stride = width * 3 + 1;
  const raw = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y += 1) {
    const offset = y * stride;
    raw[offset] = 0;
    for (let x = 0; x < width; x += 1) {
      const i = offset + 1 + x * 3;
      raw[i] = rgb[0];
      raw[i + 1] = rgb[1];
      raw[i + 2] = rgb[2];
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  function chunk(type, data) {
    const header = Buffer.concat([Buffer.from(type), data]);
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(header) >>> 0);
    return Buffer.concat([len, header, crc]);
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const PNG_1x1 = solidPng(1, 1);
const PNG_64 = solidPng(64, 64);

const ROOT = path.dirname(fileURLToPath(new URL(".", import.meta.url)));
const BASE = "http://localhost:3000";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function dismissCookies(page) {
  const decline = await page.$(".cookie-notice button");
  if (decline) await decline.click();
}

async function upload(page, filePath) {
  const input = await page.waitForSelector('input[type="file"]', { timeout: 15000 });
  await input.uploadFile(filePath);
}

async function waitReady(page) {
  await page.waitForFunction(
    () =>
      document.body.innerText.includes("Your file is ready") ||
      document.querySelector(".alert-error")?.textContent,
    { timeout: 60000 },
  );
  return page.evaluate(() => {
    const error = document.querySelector(".alert-error");
    const ok = document.body.innerText.includes("Your file is ready");
    return {
      ok,
      error: error ? error.innerText.replace(/\s+/g, " ").trim() : "",
      download: Boolean([...document.querySelectorAll("button")].find((btn) => /download/i.test(btn.textContent))),
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    };
  });
}

async function clickNamed(page, pattern) {
  const clicked = await page.evaluate((source) => {
    const re = new RegExp(source, "i");
    const button = [...document.querySelectorAll("button")].find((item) => re.test(item.textContent || ""));
    if (!button) return false;
    button.click();
    return true;
  }, pattern);
  if (!clicked) throw new Error(`Button matching ${pattern} not found`);
}

async function main() {
  const outDir = path.join(ROOT, ".tmp-test");
  await mkdir(outDir, { recursive: true });
  const pngPath = path.join(outDir, "dot.png");
  const txtPath = path.join(outDir, "notes.txt");
  const pdfPath = path.join(outDir, "sample-browser.pdf");
  await writeFile(pngPath, PNG_1x1);
  await writeFile(path.join(outDir, "photo64.png"), PNG_64);
  await writeFile(txtPath, "this is not a pdf");
  const pdf = await PDFDocument.create();
  const pdfPage = pdf.addPage([400, 500]);
  pdfPage.drawText("Browser PNG source", { x: 40, y: 420, size: 18 });
  const image = await pdf.embedPng(PNG_64);
  pdfPage.drawImage(image, { x: 40, y: 40, width: 120, height: 120 });
  await writeFile(pdfPath, Buffer.from(await pdf.save()));

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const results = [];

  try {
    const tab = await browser.newPage();
    await tab.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

    for (const slug of ["image-to-pdf", "word-to-pdf", "pdf-to-png", "image-to-jpg", "heic-to-jpg", "extract-images"]) {
      await tab.goto(`${BASE}/tools/${slug}`, { waitUntil: "domcontentloaded", timeout: 60000 });
      await tab.waitForSelector("h1", { timeout: 20000 });
      await dismissCookies(tab);
      const title = await tab.$eval("h1", (node) => node.textContent.trim());
      const overflow = await tab.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      );
      results.push({ slug, title, overflow, page: "loaded" });
      if (overflow) throw new Error(`${slug} overflows horizontally on a 390px viewport`);
    }

    await tab.goto(`${BASE}/tools/image-to-pdf`, { waitUntil: "domcontentloaded" });
    await tab.waitForSelector("h1");
    await dismissCookies(tab);
    await upload(tab, pngPath);
    await clickNamed(tab, "Create PDF");
    const imagePdf = await waitReady(tab);
    if (!imagePdf.ok || !imagePdf.download) throw new Error(`Image to PDF failed: ${imagePdf.error}`);
    results.push({ slug: "image-to-pdf", happy: true, overflow: imagePdf.overflow });
    await clickNamed(tab, "Process another");

    await upload(tab, txtPath);
    await clickNamed(tab, "Create PDF");
    const invalid = await waitReady(tab);
    if (invalid.ok) throw new Error("Image to PDF accepted a text file.");
    if (!/supported|not a/i.test(invalid.error)) throw new Error(`Unexpected invalid error: ${invalid.error}`);
    results.push({ slug: "image-to-pdf", invalid: invalid.error });

    await tab.goto(`${BASE}/tools/word-to-pdf`, { waitUntil: "domcontentloaded" });
    await tab.waitForSelector("h1");
    await dismissCookies(tab);
    await upload(tab, path.join(outDir, "letter.docx"));
    await clickNamed(tab, "Convert Word to PDF");
    const word = await waitReady(tab);
    if (!word.ok || !word.download) throw new Error(`Word to PDF failed: ${word.error}`);
    results.push({ slug: "word-to-pdf", happy: true });

    await tab.goto(`${BASE}/tools/image-to-jpg`, { waitUntil: "domcontentloaded" });
    await tab.waitForSelector("h1");
    await dismissCookies(tab);
    await upload(tab, pngPath);
    await clickNamed(tab, "Convert to JPG");
    const jpg = await waitReady(tab);
    if (!jpg.ok || !jpg.download) throw new Error(`Image to JPG failed: ${jpg.error}`);
    results.push({ slug: "image-to-jpg", happy: true });

    await tab.goto(`${BASE}/tools/pdf-to-png`, { waitUntil: "domcontentloaded" });
    await tab.waitForSelector("h1");
    await dismissCookies(tab);
    await upload(tab, pdfPath);
    await clickNamed(tab, "Convert PDF to PNG");
    const png = await waitReady(tab);
    if (!png.ok || !png.download) throw new Error(`PDF to PNG failed: ${png.error}`);
    results.push({ slug: "pdf-to-png", happy: true });

    await tab.goto(`${BASE}/tools/extract-images`, { waitUntil: "domcontentloaded" });
    await tab.waitForSelector("h1");
    await dismissCookies(tab);
    await upload(tab, pdfPath);
    await clickNamed(tab, "Extract images");
    const extract = await waitReady(tab);
    if (!extract.ok || !extract.download) throw new Error(`Extract images failed: ${extract.error}`);
    results.push({ slug: "extract-images", happy: true });

    await tab.goto(`${BASE}/tools/heic-to-jpg`, { waitUntil: "domcontentloaded" });
    await tab.waitForSelector("h1");
    await dismissCookies(tab);
    await upload(tab, pngPath);
    await clickNamed(tab, "Convert HEIC to JPG");
    const heicInvalid = await waitReady(tab);
    if (heicInvalid.ok) throw new Error("HEIC tool accepted a PNG.");
    results.push({ slug: "heic-to-jpg", invalid: heicInvalid.error });

    console.log(JSON.stringify(results, null, 2));
    console.log("Browser tool smoke passed");
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
