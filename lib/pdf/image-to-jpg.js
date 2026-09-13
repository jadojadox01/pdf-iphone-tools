import { assertImageFiles, rasterizeImageToJpeg } from "./image-file";
import { report, span, yieldUi } from "./progress";
import { replaceExtension, sanitizeFilename } from "./validate";
import { zipNamedBlobs } from "./zip";

export async function convertImagesToJpg(files, options = {}, onStatus) {
  const heicOnly = Boolean(options.heicOnly);
  const list = await assertImageFiles(files, { heicOnly, minFiles: 1 });
  const quality = Number(options.quality) || 0.9;
  const images = [];

  for (let index = 0; index < list.length; index += 1) {
    const file = list[index];
    report(onStatus, span(8, 88, index, list.length), `Converting image ${index + 1} of ${list.length}…`);
    await yieldUi();
    const bytes = await rasterizeImageToJpeg(file, quality, onStatus);
    const blob = new Blob([bytes], { type: "image/jpeg" });
    images.push({
      name: replaceExtension(sanitizeFilename(file.name), "jpg"),
      blob,
    });
  }

  if (images.length === 1) {
    return {
      blob: images[0].blob,
      filename: images[0].name,
      mime: "image/jpeg",
      meta: { pages: 1 },
    };
  }

  report(onStatus, 92, "Creating ZIP…");
  const zip = await zipNamedBlobs(images, onStatus);
  return {
    blob: zip,
    filename: "images.jpg.zip",
    mime: "application/zip",
    meta: { pages: images.length, bundled: true },
  };
}
