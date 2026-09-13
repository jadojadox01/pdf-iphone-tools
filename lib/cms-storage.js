import { copyFile, mkdir, unlink, writeFile } from "fs/promises";
import { existsSync } from "fs";
import os from "os";
import path from "path";

export const CMS_DB_BLOB_PATH = "cms/cms.db";
export const BLOB_SETUP_MESSAGE =
  "The live CMS cannot save yet. In Vercel, open Storage → Create Blob Store, connect it to this project, and redeploy. Then upload the image here again.";

const WRITE_OPERATIONS = new Set([
  "create",
  "createMany",
  "update",
  "updateMany",
  "upsert",
  "delete",
  "deleteMany",
]);

export function runningOnVercel() {
  return Boolean(process.env.VERCEL);
}

export function blobConfigured() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.BLOB_STORE_ID ||
      process.env.VERCEL_BLOB_STORE_ID
  );
}

export function liveCmsWritable() {
  return !runningOnVercel() || blobConfigured();
}

export function cmsTmpPath() {
  return path.join(os.tmpdir(), "pdfflow-cms.db");
}

export function bundledCmsPath() {
  return path.join(process.cwd(), "data", "cms.db");
}

export function prismaFileUrl(filePath) {
  return `file:${filePath.replace(/\\/g, "/")}`;
}

export function isWriteOperation(operation) {
  return WRITE_OPERATIONS.has(operation);
}

function isMissingBlob(error) {
  const message = String(error?.message || error || "");
  return /token|store|BLOB_|not found|unauthorized|oidc|access/i.test(message);
}

function blobCreds() {
  const options = {};
  if (process.env.BLOB_READ_WRITE_TOKEN) options.token = process.env.BLOB_READ_WRITE_TOKEN;
  if (process.env.BLOB_STORE_ID || process.env.VERCEL_BLOB_STORE_ID) {
    options.storeId = process.env.BLOB_STORE_ID || process.env.VERCEL_BLOB_STORE_ID;
  }
  return options;
}

function blobAuth(extra = {}) {
  return { access: "private", ...blobCreds(), ...extra };
}

async function blob() {
  return import("@vercel/blob");
}

async function streamToBuffer(stream) {
  if (!stream) return Buffer.alloc(0);
  return Buffer.from(await new Response(stream).arrayBuffer());
}

export async function clearSqliteSidecars(filePath) {
  await Promise.all(["-wal", "-shm"].map((suffix) => unlink(`${filePath}${suffix}`).catch(() => undefined)));
}

export async function downloadCmsDb(filePath, { forWrite = false } = {}) {
  const { get } = await blob();
  const result = await get(CMS_DB_BLOB_PATH, blobAuth({ useCache: false })).catch(() => null);
  if (result === null || result.statusCode !== 200 || !result.stream) {
    throw new Error("CMS database blob is missing.");
  }
  await mkdir(path.dirname(filePath), { recursive: true });
  await clearSqliteSidecars(filePath);
  await writeFile(filePath, await streamToBuffer(result.stream));
  return result.blob?.etag || "ok";
}

export async function seedCmsDb(filePath) {
  const source = bundledCmsPath();
  await mkdir(path.dirname(filePath), { recursive: true });
  await clearSqliteSidecars(filePath);
  if (existsSync(source)) {
    await copyFile(source, filePath);
    return;
  }
  await writeFile(filePath, Buffer.alloc(0));
}

export async function persistCmsDb(filePath) {
  if (!runningOnVercel()) return;
  if (!existsSync(filePath)) return;
  const { readFile } = await import("fs/promises");
  const { put } = await blob();
  const body = await readFile(filePath);
  try {
    await put(
      CMS_DB_BLOB_PATH,
      body,
      blobAuth({
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/octet-stream",
      })
    );
  } catch (error) {
    if (isMissingBlob(error) || !blobConfigured()) {
      throw new Error(BLOB_SETUP_MESSAGE);
    }
    throw error;
  }
}

export async function putMediaBlob(pathname, bytes, mimeType) {
  const { put } = await blob();
  await put(
    pathname,
    bytes,
    blobAuth({
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: mimeType || "application/octet-stream",
    })
  );
  return "";
}

export async function getMediaBlob(pathname) {
  const { get } = await blob();
  const result = await get(pathname, blobAuth()).catch(() => null);
  if (result === null || result.statusCode !== 200 || !result.stream) return null;
  return {
    bytes: await streamToBuffer(result.stream),
    contentType: result.blob?.contentType || "",
  };
}

export async function deleteMediaBlob(pathname) {
  try {
    const { del } = await blob();
    await del(pathname, blobCreds());
  } catch {
    /* Local files and missing blobs are fine. */
  }
}

export function mediaBlobPath(id, ext) {
  return `media/${id}${ext}`;
}
