export class ToolError extends Error {
  constructor(code, message, hint = "") {
    super(message);
    this.name = "ToolError";
    this.code = code;
    this.hint = hint;
  }
}

export function toToolError(error) {
  if (error instanceof ToolError) return error;

  const message = String(error?.message || error || "Something went wrong.");

  if (/password is incorrect|incorrect password|password incorrect/i.test(message)) {
    return new ToolError(
      "INCORRECT_PASSWORD",
      "That password is incorrect.",
      "Check the password and try again. This tool cannot unlock a PDF without the right password.",
    );
  }

  if (/password|encrypt/i.test(message)) {
    return new ToolError(
      "PASSWORD_REQUIRED",
      "This PDF is password-protected.",
      "Enter the password, or unlock the file first with Unlock PDF.",
    );
  }

  if (/invalid pdf|not a pdf/i.test(message)) {
    return new ToolError(
      "INVALID_FILE",
      "This does not look like a valid PDF.",
      "Choose a .pdf file and try again.",
    );
  }

  return new ToolError(
    "CONVERSION_FAILED",
    "Something went wrong while processing this file.",
    "Please try again or use another file.",
  );
}
