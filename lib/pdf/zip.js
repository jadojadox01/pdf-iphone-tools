import JSZip from "jszip";
import { bytesToBlob } from "./download";

export async function zipNamedBlobs(entries, onStatus) {
  const zip = new JSZip();
  entries.forEach((entry, index) => {
    onStatus?.(`Adding file ${index + 1} of ${entries.length}…`);
    zip.file(entry.name, entry.blob);
  });
  onStatus?.("Preparing ZIP…");
  const bytes = await zip.generateAsync({ type: "uint8array" });
  return bytesToBlob(bytes, "application/zip");
}
