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

async function loadCmsDb(forWrite) {
  if (!runningOnVercel()) return;
  try {
    await downloadCmsDb(tmpPath, { forWrite });
  } catch {
    if (!existsSync(tmpPath)) {
      await seedCmsDb(tmpPath);
    }
  }
}

async function ensureCmsDb(forWrite = false) {
  if (!runningOnVercel()) return;
  const run = loading ? loading.then(() => loadCmsDb(forWrite), () => loadCmsDb(forWrite)) : loadCmsDb(forWrite);
  loading = run.catch(() => undefined);
  await run;
}

function createPrisma() {
  const options = {
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  };
  if (runningOnVercel()) {
    options.datasourceUrl = prismaFileUrl(tmpPath);
  }
  return new PrismaClient(options).$extends({
    query: {
      async $allOperations({ operation, args, query }) {
        const writing = isWriteOperation(operation);
        await ensureCmsDb(writing);
        const result = await query(args);
        if (writing) await persistCmsDb(tmpPath);
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
