import { ensureCatalogToolsInCms } from "../lib/cms/sync-catalog-tools.js";

const created = await ensureCatalogToolsInCms();
console.log(`Catalog tools synced. Created ${created} missing CMS records.`);
