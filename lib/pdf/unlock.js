import { loadPdfDocument, savePdf } from "./load";
import { assertPdfFile, replaceExtension } from "./validate";
import { ToolError } from "./errors";

export async function unlockPdf(file, options = {}, onStatus) {
  await assertPdfFile(file);
  const password = String(options.password || "");
  if (!password) {
    throw new ToolError(
      "PASSWORD_REQUIRED",
      "Enter the current PDF password.",
      "This tool only removes a password you already know.",
    );
  }

  onStatus?.("Checking password…");
  const pdf = await loadPdfDocument(file, password);

  onStatus?.("Creating unlocked PDF…");
  const blob = await savePdf(pdf);
  return {
    blob,
    filename: replaceExtension(file.name, "pdf"),
    mime: "application/pdf",
    meta: {
      unlocked: true,
      note: "The downloaded file can be opened without that password.",
    },
  };
}
