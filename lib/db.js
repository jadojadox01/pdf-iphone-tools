import { PrismaClient } from "@prisma/client";
import { existsSync } from "fs";
import {
  cmsTmpPath,
  downloadCmsDb,
  isWriteOperation,
  persistCmsDb,
  prismaFileUrl,
  runningOnVercel,
  seedCmsDb,
} from "@/lib/cms-storage";

const globalForPrisma = globalThis;
const tmpPath = cmsTmpPath();
let loadPromise = null;
let loadedAt = 0;
let baseClient = null;
const LOAD_TTL_MS = 3000;

async function loadCmsDb() {
  if (!runningOnVercel()) return;
  try {
    await downloadCmsDb(tmpPath, { forWrite: true });
  } catch {
    if (!existsSync(tmpPath)) await seedCmsDb(tmpPath);
  }
  loadedAt = Date.now();
}

async function ensureCmsDb() {
  if (!runningOnVercel()) return;
  if (existsSync(tmpPath) && Date.now() - loadedAt < LOAD_TTL_MS) return;
  if (!loadPromise) {
    loadPromise = loadCmsDb().finally(() => {
      loadPromise = null;
    });
  }
  await loadPromise;
}

async function checkpoint() {
  if (!baseClient) return;
  try {
    await baseClient.$queryRawUnsafe("PRAGMA wal_checkpoint(TRUNCATE);");
  } catch {
    /* Best-effort so the Blob copy includes the latest rows. */
  }
}

function createPrisma() {
  const options = {
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  };
  if (runningOnVercel()) {
    options.datasourceUrl = prismaFileUrl(tmpPath);
  }
  baseClient = new PrismaClient(options);
  return baseClient.$extends({
    query: {
      async $allOperations({ operation, args, query }) {
        const writing = isWriteOperation(operation);
        await ensureCmsDb();
        const result = await query(args);
        if (writing) {
          await checkpoint();
          await persistCmsDb(tmpPath);
          loadedAt = 0;
        }
        return result;
      },
    },
  });
}

export const prisma = globalForPrisma.prisma || createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export { blobConfigured, BLOB_SETUP_MESSAGE, liveCmsWritable, runningOnVercel } from "@/lib/cms-storage";
