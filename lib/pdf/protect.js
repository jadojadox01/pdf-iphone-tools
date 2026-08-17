import { loadPdfDocument, savePdf } from "./load";
import { assertPdfFile, replaceExtension } from "./validate";
import { ToolError } from "./errors";

export async function protectPdf(file, options = {}, onStatus) {
  await assertPdfFile(file);
  const password = String(options.password || "");
  const confirm = String(options.confirm || "");

  if (password.length < 4) {
    throw new ToolError(
      "INVALID_FILE",
      "Choose a password with at least 4 characters.",
      "Use a password you can remember. It cannot be recovered later.",
    );
  }
  if (password !== confirm) {
    throw new ToolError(
      "INVALID_FILE",
      "The passwords do not match.",
      "Enter the same password in both fields.",
    );
  }

  onStatus?.("Opening PDF…");
  const pdf = await loadPdfDocument(file, options.currentPassword);
  if (pdf.isEncrypted) {
    throw new ToolError(
      "PASSWORD_REQUIRED",
      "This PDF is already encrypted.",
      "Unlock it first if you want to change the password, then protect it again.",
    );
  }

  onStatus?.("Encrypting PDF…");
  pdf.encrypt({
    userPassword: password,
    ownerPassword: password,
    permissions: {
      printing: "highResolution",
      modifying: false,
      copying: false,
      annotating: false,
      fillingForms: true,
      contentAccessibility: true,
      documentAssembly: false,
    },
  });

  const blob = await savePdf(pdf);
  return {
    blob,
    filename: replaceExtension(file.name, "pdf"),
    mime: "application/pdf",
    meta: {
      protected: true,
      note: "Keep this password. It is not stored anywhere on this site.",
    },
  };
}
