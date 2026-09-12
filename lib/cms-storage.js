import { copyFile, mkdir, writeFile } from "fs/promises";
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
  return /token|store|BLOB_|not found|unauthorized|oidc/i.test(message);
}

async function blob() {
  return import("@vercel/blob");
}

async function streamToBuffer(stream) {
  if (!stream) return Buffer.alloc(0);
  return Buffer.from(await new Response(stream).arrayBuffer());
}

export async function downloadCmsDb(filePath, { forWrite = false } = {}) {
  const { get } = await blob();
  const options = { useCache: !forWrite };
  const result =
    (await get(CMS_DB_BLOB_PATH, { ...options, access: "private" }).catch(() => null)) ||
    (await get(CMS_DB_BLOB_PATH, { ...options, access: "public" }).catch(() => null));
  if (!result || result.statusCode !== 200 || !result.stream) {
    throw new Error("CMS database blob is missing.");
  }
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, await streamToBuffer(result.stream));
}

export async function seedCmsDb(filePath) {
  const source = bundledCmsPath();
  await mkdir(path.dirname(filePath), { recursive: true });
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
  const options = {
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/octet-stream",
  };
  try {
    await put(CMS_DB_BLOB_PATH, body, { ...options, access: "private" });
  } catch (error) {
    try {
      await put(CMS_DB_BLOB_PATH, body, { ...options, access: "public" });
    } catch (retryError) {
      if (isMissingBlob(error) || isMissingBlob(retryError) || !blobConfigured()) {
        throw new Error(BLOB_SETUP_MESSAGE);
      }
      throw retryError;
    }
  }
}

export async function putMediaBlob(pathname, bytes, mimeType) {
  const { put } = await blob();
  const options = {
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: mimeType || "application/octet-stream",
  };
  try {
    const uploaded = await put(pathname, bytes, { ...options, access: "public" });
    return uploaded.url;
  } catch {
    await put(pathname, bytes, { ...options, access: "private" });
    return "";
  }
}

export async function getMediaBlob(pathname) {
  const { get } = await blob();
  try {
    const result = await get(pathname, { access: "private" });
    if (result?.statusCode === 200 && result.stream) {
      return {
        bytes: await streamToBuffer(result.stream),
        contentType: result.blob?.contentType || "",
      };
    }
  } catch {
    /* try public next */
  }
  try {
    const result = await get(pathname, { access: "public" });
    if (result?.statusCode === 200 && result.stream) {
      return {
        bytes: await streamToBuffer(result.stream),
        contentType: result.blob?.contentType || "",
      };
    }
  } catch {
    return null;
  }
  return null;
}

export async function deleteMediaBlob(pathname) {
  try {
    const { del } = await blob();
    await del(pathname);
  } catch {
    /* Local files and missing blobs are fine. */
  }
}

export function mediaBlobPath(id, ext) {
  return `media/${id}${ext}`;
}
