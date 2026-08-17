const encoder = new TextEncoder();

export async function createSessionToken() {
  const secret = process.env.ADMIN_PASSWORD || "";
  const data = encoder.encode(`pdf-iphone-tools-admin:${secret}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function passwordAllowed(password) {
  const expected = process.env.ADMIN_PASSWORD;
  if (expected) return password === expected;
  return process.env.NODE_ENV !== "production" && password === "admin";
}
