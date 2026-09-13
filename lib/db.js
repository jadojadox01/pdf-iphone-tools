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
let loading = null;
let lastEtag = "";
let baseClient = null;

async function loadCmsDb() {
  if (!runningOnVercel()) return false;
  try {
    const etag = await downloadCmsDb(tmpPath, { forWrite: true });
    const replaced = etag !== lastEtag;
    lastEtag = etag;
    return replaced;
  } catch {
    if (!existsSync(tmpPath)) {
      await seedCmsDb(tmpPath);
      lastEtag = "seed";
      return true;
    }
    return false;
  }
}

async function ensureCmsDb() {
  if (!runningOnVercel()) return false;
  const run = loading ? loading.then(() => loadCmsDb(), () => loadCmsDb()) : loadCmsDb();
  loading = run.catch(() => false);
  return run;
}

async function checkpoint() {
  if (!baseClient) return;
  try {
    await baseClient.$queryRawUnsafe("PRAGMA journal_mode=DELETE;");
    await baseClient.$queryRawUnsafe("PRAGMA wal_checkpoint(TRUNCATE);");
  } catch {
    /* SQLite sidecars are best-effort. */
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
        const replaced = await ensureCmsDb();
        if (replaced) await baseClient.$disconnect();
        const result = await query(args);
        if (writing) {
          await checkpoint();
          await persistCmsDb(tmpPath);
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
